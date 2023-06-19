<script setup>
//imports
  import { supabase } from '../supabase';
  import Card from './Card.vue';
  import { useUserStore } from '../stores/users';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref } from 'vue';
  import Observer from './Observer.vue'

//store
  const userStore = useUserStore()
  const {user} = storeToRefs(userStore)

//timeline
  const posts = ref([])
  const lastCardIndex = ref(3)
  const ownerIds = ref([])
  const reachEnd = ref(false)

//fetch data
  async function fetchData (){
    const {data: followingData} = await supabase
    .from('followers_following')
    .select('following_id')
    .eq('follower_id', user.value.id)

    ownerIds.value = followingData.map(f=> f.following_id)

    const {data} = await supabase
    .from('posts')
    .select()
    .in('owner_id',ownerIds.value)
    .range(0,lastCardIndex.value)
    .order('created_at', {ascending: false})

    posts.value = data

  }

  async function fetchNextSet(){
    if(!reachEnd.value){
      const {data} = await supabase
        .from('posts')
        .select()
        .in('owner_id',ownerIds.value)
        .range(lastCardIndex.value+1,lastCardIndex.value + 3)
        .order('created_at', {ascending: false})

      //desestruturando o array q tem dentro e jogando mais valor no fim
      posts.value = [
        ...posts.value,
        ...data
      ]

      //nao entendi (deve dar pra fazer melhor)
      lastCardIndex.value = lastCardIndex.value + 3
      if(data.length){
        reachEnd.value = true
      }
      console.log(data.length)
    }
  }

//onMounted
  onMounted(()=>{
    fetchData()
  })

  
</script>

<template>
  <div class="timeline-container">
    <Card
      v-for="post in posts"
      :key="post.id"
      :post="post"
    />
    <Observer @intersect="fetchNextSet" />
  </div>
</template>