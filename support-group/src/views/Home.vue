<template>
  <div class="home-container">
    <p>מסך הבית</p>
  </div>
</template>

<script>
import { onMounted } from '@vue/runtime-core'
import {projectAuth} from '../firebase/config'

export default {
  name: 'Home',
  setup(){

    onMounted(()=>{
      setTimeout(() => {
        console.log(projectAuth.currentUser);
      }, 1000);
    })
    return{}
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