import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('users', () => {

  const user = ref(null)

  const errorMessage = ref('')

  const loading = ref(false)

  const loadingUser = ref(false)

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  async function handleLogin (credentials){
    const {email, password} = credentials

    if(!validateEmail(email)){
      return errorMessage.value = 'Email is invalid'
    }

    if(!password.length){
      return errorMessage.value = 'Password cannot be empty!'
    }

    loading.value = true

    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error){
      loading.value = false
      return errorMessage.value = error.message
    }

    const { data: existingUser} = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single()

    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id
    }
    loading.value = false
    errorMessage.value = ''
  }

  async function handleSignup (credentials){
    const {username, email, password} = credentials

    if(username.length < 4){
      return errorMessage.value = 'Username is too short'
    }

    if(password.length < 6){
      return errorMessage.value = 'Password is too short'
    }

    if(!validateEmail(email)){
      return errorMessage.value = 'Email is invalid'
    }

    errorMessage.value = ''

    loading.value = true

    const { data: userWithUsername} = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single()

    if(userWithUsername){
      loading.value = false
      return errorMessage.value = 'User already registred'
    }

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if(error){
      loading.value = false
      return errorMessage.value = error.message
    }

    await supabase.from('users').insert({
      username,
      email
    })

    const { data: newUser} = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()
    
    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }

    loading.value = false

  }

  async function handleLogout (){
    await supabase.auth.signOut()
    user.value = null
  }

  async function getUser (){

    loadingUser.value = true

    const {data} = await supabase.auth.getUser()

    if(!data.user) {
      loadingUser.value = false
      return user.value = null
    }

    const {data: userWithEmail} = await supabase
    .from('users')
    .select()
    .eq('email', data.user.email)
    .single()

    user.value = {
      username: userWithEmail.username,
      email: userWithEmail.email,
      id: userWithEmail.id
    }

    loadingUser.value = false
  }

  function clearErrorMessage (){
    errorMessage.value = ''
  }

  return { user, errorMessage, handleLogin, handleSignup, handleLogout, getUser, clearErrorMessage, loading, loadingUser}
})
