<script setup>
//imports
  import { ref, onMounted } from 'vue';

//observer
  const observer = ref(null)
  const root = ref(null)

//emits
  const emits = defineEmits(['intersect'])

//onMounted
  onMounted(()=>{
    observer.value = new IntersectionObserver(([entry])=>{
      if(entry && entry.isIntersecting){
        emits('intersect')
      }
    })
    observer.value.observe(root.value)
  })

</script>

<template>
  <div class="observer" ref="root">
    
  </div>
</template>

<style scoped>
.observer{
  height: 10px;
  width: 10px;
}
</style>