<script setup>
//imports
  import {RouterLink, useRouter} from 'vue-router'
  import Container from './Container.vue'
  import AuthModal from './AuthModal.vue'
  import { ref } from 'vue'
  import { useUserStore } from '../stores/users'
  import { storeToRefs } from 'pinia'

//stores
  const userStore = useUserStore()
  const {user, loadingUser} = storeToRefs(userStore)

//router
  const router = useRouter()

//search 
  const searchUser = ref('')
  function onSearch(){
    if(searchUser.value){
      router.push(`/profile/${searchUser.value}`)
      searchUser.value = ''
    }
  }

//logout
async function handleLogout (){
  await userStore.handleLogout()
}

function goToUsersProfile(){
  router.push(`/profile/${user.value.username}`)
}

</script>

<template>
  <ALayoutHeader>
    <Container>
      <div class="nav-container">
        <div class="right-content">
          <RouterLink to="/"> Intagram</RouterLink>
          <AInputSearch
            v-model:value="searchUser"
            placeholder="username..."
            style="width: 200px"
            @search="onSearch"
          />
        </div>
        <div class="content" v-if="!loadingUser">
          <div class="left-content" v-if="!user">
            <AuthModal :isLogin="false"/>
            <AuthModal :isLogin="true"/>
          </div>
  
          <div class="left-content" v-else>
            <AButton type="primary" @click="goToUsersProfile"> Profile </AButton>
            <AButton type="primary" @click="handleLogout"> Logout </AButton>
          </div>
        </div>
      </div>
    </Container>
  </ALayoutHeader>
</template>

<style scoped>

.nav-container{
  display: flex;
  justify-content: space-between;
}

.right-content{
  display: flex;
  align-items: center;
}
.right-content a{
  margin-right: 10px;
}

.left-content{
  display: flex;
  align-items: center;
}

.left-content button{
  margin-left: 10px;
}

.content{
  display: flex;
  align-items: center;
}
</style>
