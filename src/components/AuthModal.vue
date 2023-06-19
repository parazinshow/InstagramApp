<script setup>
  import { ref, reactive} from 'vue'
  import { useUserStore } from '../stores/users'
  import {storeToRefs} from 'pinia'

//store
  const userStore = useUserStore()
  const { errorMessage, loading, user } = storeToRefs(userStore)

//props
  const props = defineProps(['isLogin'])

//modal
  const visible = ref(false)
  const showModal = () => {
    visible.value = true
  };
  const handleOk = async (e) => {
    if(props.isLogin){
      await userStore.handleLogin({
        password: userCredentials.password,
        email: userCredentials.email
      })
    }else{
      await userStore.handleSignup(userCredentials)
    }
    
    if(user.value){
      clearUserCredentialInput()
      visible.value = false
    }
  };
  const handleCancel = () =>{
    clearUserCredentialInput()
    visible.value = false
  }

//clearUser

  const clearUserCredentialInput = () =>{
    userCredentials.email = ''
    userCredentials.password = ''
    userCredentials.username = ''
    userStore.clearErrorMessage()
  }

//button title
  const title = props.isLogin ? 'Login' : 'Signup'

//user credentials
  const userCredentials = reactive({
    email: '',
    password: '',
    username: ''
  })
</script>

<template>
  <div>
    <AButton class="btn" type="primary" @click="showModal">{{title}}</AButton>
    <AModal v-model:visible="visible" :title="title" @ok="handleOk">
      <template #footer>
        <AButton key="back" @click="handleCancel">Cancel</AButton>
        <AButton
          :disable="loading"
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          Submit
        </AButton>
      </template>
      <div v-if="!loading" class="input-container">
        <AInput class="input" v-if="!isLogin" v-model:value="userCredentials.username" placeholder="Username" />
        <AInput class="input" v-model:value="userCredentials.email" placeholder="Email" />
        <AInput class="input" v-model:value="userCredentials.password" placeholder="Password"
        type="password"/>
      </div>
      <div v-else class="spinner">
        <ASpin/>
      </div>
      <ATypographyText v-if="errorMessage" type="danger">{{errorMessage}}</ATypographyText>
    </AModal>
  </div>
</template>

<style scoped>
.btn{
  margin-left: 10px;
}

.input{
  margin-top: 10px;
}

.input-container{
  height: 120px;
}

.spinner{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
</style>