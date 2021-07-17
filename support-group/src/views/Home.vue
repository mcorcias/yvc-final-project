<template>
  <div class="home-container">
    <p>מסך הבית</p>
  </div>
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import store from '../store/index'
export default {
  name: 'Home',
  setup(){
    const currentUser = ref(computed(()=>{
      return store.getters.getUserProfile
    }))

    return{currentUser}
  }
}
</script>

<style scoped>
  .home-container{
    font-size: 2rem;
    width: 100%;
    height: calc(100vh - 3rem);
    background: burlywood;
  }
</style>