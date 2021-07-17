<template>
<div class="app-container">
  <Navbar @toggleSideBar="handleToggleSideBar"/>
  <router-view/>
  <Sidebar v-model:visible="visibleLeft">
	  <div class="sidebar-container">
      <div class="header">
          <Avatar v-if="!avatar" icon="pi pi-user" class="p-mr-2 avatar" size="xlarge" shape="circle" />
          <Avatar v-if="avatar" :image="avatar" class="p-mr-2 avatar" size="xlarge" shape="circle" />
          <h4>{{userName}}</h4>
      </div>
      <div class="options">
        <div class="icon" @click="handleRedirect('Settings')">
          <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fgear%20(1).png?alt=media&token=d05a18f9-e499-4f39-bfd3-94bc1f6ac84a">
          </div>
          <div class="content">
            <p>הגדרות</p>
          </div>
        </div>
        <div class="icon">
          <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fcalendar.png?alt=media&token=2bbc49eb-7a16-41fe-98be-1ca83654bdae">
          </div>
          <div class="content">
            <p>יומן</p>
          </div>
        </div>
        <div class="icon">
           <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fchat.png?alt=media&token=e1841a4a-892d-4093-8ee0-d7907e062440">
           </div>
           <div class="content">
            <p>צ'אט</p>
           </div>
        </div>
      </div>
    </div>
  </Sidebar>
</div>

</template>

<script>
import { computed, ref } from 'vue'
import Navbar from '../src/components/navbar/Navbar'
import 'primevue/resources/themes/saga-blue/theme.css'      
import 'primevue/resources/primevue.min.css'                
import 'primeicons/primeicons.css'                           
import Sidebar from 'primevue/sidebar';
import Avatar from 'primevue/avatar';
import store from '../src/store/index'
import { useRouter } from 'vue-router'

export default {
  components:{Navbar,Sidebar,Avatar},
  setup(){
    const router = useRouter()
    const visibleLeft = ref(false)
    const handleToggleSideBar = ()=>{
      visibleLeft.value =! visibleLeft.value
    }
    const handleRedirect=(path)=>{
      router.push({name:path})
    }

    const avatar = ref(computed(()=>{
      if(store.getters.getUserProfile.avatar){
        return store.getters.getUserProfile.avatar
      }else{
        return null
      }
    }))
    const userName = ref(computed(()=>{
      return store.getters.getUserProfile.fullName
    }))
    return{visibleLeft,handleToggleSideBar,handleRedirect,userName,avatar}
  }

}
</script>
<style>
  *{
    direction: rtl;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  .app-container{
    width: 100vw;
  }
  .sidebar-container{
    width: 100%;
    height: 100vh;
    
  }
  .sidebar-container .header{
    text-align: center;
    width: 100%;
    height: 20vh;
    border-bottom: 1px solid lightgray;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .avatar{
    cursor: pointer;
  }
  .options{
    margin-top: 10px;
    width: 100%;
    height: 40%;
  }
  .icon{
    margin-bottom: 15px;
    width: 100%;
    height: 10%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    cursor: pointer;
  }
  .icon .image{
    width: 20%;
    height: 100%;
  }
  .icon .content{
    width: 70%;
    height: 100%;
    font-size: 1.3rem;
  }
  .icon:hover{
    transform: scale(1.1);
  }
  
</style>
