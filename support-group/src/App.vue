<template>
<div class="app-container">
  <Navbar @toggleSideBar="handleToggleSideBar"/>
  <router-view/>
  <Sidebar v-model:visible="visibleLeft">
	  <div class="sidebar-container">
      <div class="header">
          <Avatar icon="pi pi-user" class="p-mr-2 avatar" size="xlarge" shape="circle" />
          <h4>יבגני קובלסקי</h4>
      </div>
    </div>
  </Sidebar>
</div>


</template>

<script>
import { ref } from 'vue'
import Navbar from '../src/components/navbar/Navbar'
import 'primevue/resources/themes/saga-blue/theme.css'      
import 'primevue/resources/primevue.min.css'                
import 'primeicons/primeicons.css'                           
import Sidebar from 'primevue/sidebar';
import Avatar from 'primevue/avatar';
export default {
  components:{Navbar,Sidebar,Avatar},
  setup(){

    const visibleLeft = ref(false)
    const handleToggleSideBar = ()=>{
      visibleLeft.value =! visibleLeft.value
    }
    return{visibleLeft,handleToggleSideBar}
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
  
</style>
