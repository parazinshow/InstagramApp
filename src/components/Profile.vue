<script setup>
//imports
  import Container from './Container.vue';
  import UserBar from './UserBar.vue'
  import ImageGallary from './ImageGallary.vue';
  import { ref, onMounted, watch, reactive } from 'vue';
  import { supabase } from '../supabase';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '../stores/users';
  import { storeToRefs } from 'pinia';

//store
  const userStore = useUserStore()

//user logado
  const {user: loggedInUser} = storeToRefs(userStore)

//userInfo
  const userInfo = reactive({
    posts: null,
    followers: null,
    following: null
  })

//loading state
  const loading = ref(false)

//user profile
  const user = ref(null)

//route
  const route = useRoute()
  const {username} = route.params

//posts
  const posts = ref([])
  function addNewPosts (post){
    posts.value.unshift(post)
  }

//toggling button
  function updateIsFollowing(follow){
    isFollowing.value = follow
  }
  
//follows
  const isFollowing = ref(false)

//fetch data
  async function fetchData(){
    loading.value = true
    const {data: userData} = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single()

    if(!userData){
      loading.value = false
      return user.value = null
    }

    user.value = userData

    const {data: postsData} = await supabase
    .from('posts')
    .select()
    .eq('owner_id', user.value.id)

    posts.value = postsData

    await fetchIsFollowing()

    const followerCount = await fetchFollowersCount()

    const followingCount = await fetchFollowingCount()

    userInfo.followers = followerCount

    userInfo.following = followingCount

    userInfo.posts = posts.value.length

    loading.value = false
  }

//fetch is following
  async function fetchIsFollowing(){
    if(loggedInUser.value && (loggedInUser.value.id !== user.value.id) ){
      const {data} = await supabase
      .from('followers_following')
      .select()
      .eq('follower_id', loggedInUser.value.id)
      .eq('following_id',user.value.id)
      .single()

      if(data){
        return isFollowing.value = true
      }
      
    }
  }

//fetch follower Count
  async function fetchFollowersCount (){
    const {count} = await supabase
      .from('followers_following')
      .select('*', {count: 'exact'})
      .eq('following_id', user.value.id)

    return count
  }
//fetch follower Count
async function fetchFollowingCount (){
    const {count} = await supabase
      .from('followers_following')
      .select('*', {count: 'exact'})
      .eq('follower_id', user.value.id)

    return count
  }

  watch(loggedInUser,()=>{
    fetchIsFollowing()
  })
  onMounted(() => {
    fetchData()
  })

</script>

<template>
  <Container>
    <div class="profile-container" v-if="!loading">
      <UserBar
        :key="$route.params.username"
        :user="user"
        :userInfo="userInfo"
        :addNewPost="addNewPosts"
        :isFollowing="isFollowing"
        :updateIsFollowing="updateIsFollowing"
      />
      <ImageGallary :posts="posts"/>
    </div>
    <div v-else>
      <ASpin class="spinner"/>
    </div>
  </Container>
</template>

<style scoped>

.profile-container{
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.spinner{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85vh;
}

</style>