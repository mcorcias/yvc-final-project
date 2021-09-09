<template>
<div class="app-container">
  <Navbar @toggleSideBar="handleToggleSideBar"/>
  <router-view/>
  <Sidebar v-model:visible="visibleLeft"> 
	  <div class="sidebar-container">
      <div class="header">
          <Avatar v-if="!avatar" icon="pi pi-user" class="p-mr-2 avatar" size="xlarge" shape="circle" />
          <Avatar v-if="avatar" :image="avatar" class="p-mr-2 avatar" size="xlarge" shape="circle" @click="showAvatarModal=true" />
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
        <div class="icon" @click="handleRedirect('Courses')">
          <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fbook.png?alt=media&token=1f13992d-4053-42b9-b9d8-79d98e2bcece">
          </div>
          <div class="content">
            <p>קורסים</p>
          </div>
        </div>
        <div v-if="userRole=='teacher'" class="icon" @click="handleRedirect('ArchivesCourses')">
          <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Farchive.png?alt=media&token=6c55a23c-b91f-4a00-a7f9-1b04a70ab255">
          </div>
          <div class="content">
            <p>ארכיון קורסים</p>
          </div>
        </div>
        <div class="icon" @click="handleRedirect('Calendar')">
          <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fcalendar.png?alt=media&token=2bbc49eb-7a16-41fe-98be-1ca83654bdae">
          </div>
          <div class="content">
            <p>יומן</p>
          </div>
        </div>
        <div class="icon" @click="handleRedirect('UserMessages')">
           <div class="image">
            <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fletter.png?alt=media&token=f7325470-a86e-4feb-b8b2-be7d927b2913">
            <div v-if="qnt_msg>0" class="counter">{{qnt_msg}}</div>
           </div>
           <div class="content">
            <p>הודעות</p>
           </div>
        </div>
      </div>
    </div>
  </Sidebar>

  <Dialog header="תמונת פרופיל" v-model:visible="showAvatarModal"  modal>
      <div class="progile-image">
          <img :src="avatar" >
      </div>
  </Dialog>
</div>

</template>

<script>
import { computed, ref } from 'vue'
import Navbar from '../src/components/navbar/Navbar'
import 'primevue/resources/themes/saga-blue/theme.css'      
import 'primevue/resources/primevue.min.css'                
import 'primeicons/primeicons.css'                           
import Sidebar from 'primevue/sidebar';
import Dialog from 'primevue/dialog';
import Avatar from 'primevue/avatar';
import store from '../src/store/index'
import {showAvatarModal} from './methods/AvatarModal'
import { useRouter } from 'vue-router'

export default {
  components:{Navbar,Sidebar,Avatar,Dialog},
  setup(){
    const router = useRouter()
    const visibleLeft = ref(false)
    const handleToggleSideBar = ()=>{
      visibleLeft.value =! visibleLeft.value
    }
    const handleRedirect=(path)=>{
      visibleLeft.value=false
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
    const userRole = ref(computed(()=>{
       return store.getters.getUserProfile.role
    }))

    const qnt_msg = ref(computed(()=>{
      return store.getters.get_qnt_msgs
    }))
    return{visibleLeft,handleToggleSideBar,handleRedirect,userRole,userName,avatar,showAvatarModal,qnt_msg}
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
    background: rgb(243,244,248);
    background: radial-gradient(circle, rgba(243,244,248,1) 0%, rgba(215,221,229,1) 100%);
  }
  .sidebar-container{
    width: 100%;
    height: 100%;
    overflow: hidden;
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
    padding: 0 15px;
    margin-top: 10px;
    width: 100%;
    height: 40vh;
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
    position: relative;
    width: 20%;
    height: 100%;
  }
  .counter{
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background-color: red;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    font-size: 15px;
  }
  .icon .content{
    width: 70%;
    height: 100%;
    font-size: 1.3rem;
  }
  .icon:hover{
    transform: scale(1.01);
    background-color: rgb(149, 163, 177);
    border-top-left-radius:15px;
    border-bottom-left-radius:15px;
    color: #fff;
  }
  .progile-image{
    width: auto;
    height: auto;
  }
  .progile-image img{
    max-height: 100%;
    max-width: 100%;
  }
  
</style>
