<template>
  <div class="home-container">
    <ChatManager v-if="currentUser.role=='psyc'" />
  </div>
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import store from '../store/index'
import ChatManager from '../components/chat/admin/ChatManager.vue'
export default {
  components:{ChatManager},
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
  }
</style>