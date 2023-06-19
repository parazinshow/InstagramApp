<script setup>
//imports
  import UploadPhotoModal from './UploadPhotoModal.vue';
  import { useUserStore } from '../stores/users';
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { supabase } from '../supabase';

//router
  const route = useRoute()
  const userStore = useUserStore()

//users
  const {username: profileUsername} = route.params
  const { user } = storeToRefs(userStore)
  
//props
  const props = defineProps([
    'user',
    'userInfo',
    'addNewPost',
    'isFollowing',
    'updateIsFollowing'
  ])

//follow
  async function followUser(){
    props.updateIsFollowing(true)
    await supabase.from('followers_following')
    .insert({
      follower_id: user.value.id,
      following_id: props.user.id
    })
  }
//unfollow
  async function unfollowUser(){
    props.updateIsFollowing(false)
    await supabase.from('followers_following')
    .delete()
    .eq('follower_id', user.value.id)
    .eq('following_id', props.user.id)
  }

</script>


<template>
  <div class="userbar-container" v-if="props.user">
    <div class="top-content">
      <ATypographyTitle :level="2">{{props.user.username}}</ATypographyTitle>
      <div v-if="user">
        <UploadPhotoModal
        v-if="profileUsername === user.username"
        :addNewPost="addNewPost"
        />
        <div v-else>
          <AButton @click="followUser" v-if="!props.isFollowing">Follow</AButton>
          <AButton @click="unfollowUser" v-else>Following</AButton>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <ATypographyTitle :level="5">{{props.userInfo.posts}} posts</ATypographyTitle>
      <ATypographyTitle :level="5">{{props.userInfo.followers}} followers</ATypographyTitle>
      <ATypographyTitle :level="5">{{props.userInfo.following}} following</ATypographyTitle>
    </div>
  </div>
  <div class="userbar-container" v-else>
    <div class="top-content">
      <ATypographyTitle :level="2">User Not Found</ATypographyTitle>
    </div>
  </div>
</template>

<style scoped>
  .userbar-container {
    padding-bottom: 75px;
    width: 100%;
  }

  .bottom-content {
    display: flex;
    align-items: center;
  }

  .bottom-content h5{
    margin: 0 !important;
    padding: 0;
    margin-right: 30px !important;
    align-items: center;
  }

  .top-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>