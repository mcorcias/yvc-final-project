<template>
  <div class="home-container">
    <ChatManager v-if="currentUser.role=='psyc'" />
    <CreateMsg v-if="currentUser.role=='teacher'"/>
    <HomePage v-if="currentUser.role=='user'" />
  </div>
</template>

<script>
import { computed, ref } from '@vue/runtime-core'
import store from '../store/index'
import ChatManager from '../components/chat/admin/ChatManager.vue'
import CreateMsg from '../components/msg_for_lect/CreateMsg.vue'
import HomePage from '../components/user_home/HomePage.vue'
export default {
  components:{ChatManager,CreateMsg,HomePage},
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
    height: 100%;
    overflow-y: auto;
  }
</style>