<script setup>
//imports
  import { ref } from 'vue';
  import { supabase } from '../supabase';
  import { useUserStore } from '../stores/users';
  import { storeToRefs } from 'pinia';

//store
  const userStore = useUserStore()
  const {user} = storeToRefs(userStore)

//error message
  const errorMessage = ref('')

//loading state
  const loading = ref(false)

//images variables
  const caption = ref('')
  const file = ref(null)

//props
  const props = defineProps(['addNewPost'])

//modal
  const visible = ref(false)
  const showModal = () => {
    visible.value = true;
  }

//handlers
  const handleOk = async(e) => {
    loading.value = true

    const fileName = Math.floor(Math.random() * 1000000000000000)
    let filePath
    if(file.value){
      const {data,error} = await supabase.storage.from('images').upload('public/' + fileName, file.value)

      if(error){
        loading.value = false
        return errorMessage.value = 'Unable to upload image'
      }

      filePath = data.path
      await supabase.from('posts').insert({
        url: filePath,
        caption: caption.value,
        owner_id: user.value.id
      })
    }

    loading.value = false
    visible.value = false
    caption.value = ''
    props.addNewPost({
      url: filePath,
      caption: caption.value
    })
  }

  function handleUploadChange(e){
    if(e.target.files[0]){
      file.value = e.target.files[0]
    }
  }

</script>

<template>
  <div>
    <AButton @click="showModal">Upload Photo</AButton>
    <AModal v-model:visible="visible" title="Basic Modal" @ok="handleOk">
    <div v-if="!loading">
      <input type="file" accept=".jpeg,.png" @change="handleUploadChange">
      <AInput
        v-model:value="caption"
        placeholder="Caption..."
        :maxLength="50"
      />
    </div>
    <div class="spinner" v-else>
      <ASpin class="spinner"/>
    </div>

    </AModal>
  </div>
</template>

<style scoped>
input{
  margin-top: 10px;
}
.spinner{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>