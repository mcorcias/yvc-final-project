<template>

    <div class="navbar-container">
        <div class="headlines">
            <ul>
                <li v-if="!login" @click="handleRedirect('Login')">כניסה</li>
                <li v-if="!login" @click="handleRedirect('SignUp')">הרשמה</li>
                <li v-if="login" @click="handleExit()">יציאה</li>

            </ul>
        </div>
        <div class="logo" @click="handleRedirect('Home')">
            <div class="image">
                <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/logo%2FWhatsApp%20Image%202021-06-04%20at%2014.57.19.jpeg?alt=media&token=6ac440eb-501b-47c0-a1f2-5efe12c0c4b4">
            </div>
            <div v-if="login" class="hamburger">
                <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Flist%20(1).png?alt=media&token=b4cd1639-55a0-4d99-b072-2af10e695d39" @click="handleSideBar">
            </div>
        </div>
    </div>
 
</template>
<script>
import Button from 'primevue/button';
import {useRouter} from 'vue-router'
import { ref } from '@vue/reactivity';
import { projectAuth } from '../../firebase/config';
import useLogout from '../../composables/useLogout'
import Swal from 'sweetalert2'
export default {
    components:{Button},
    emits:['toggleSideBar'],
    setup(_,{emit}) {
        const {logout} = useLogout()
        const router = useRouter()
        const login = ref(false)
        const handleSideBar = ()=>{
            emit('toggleSideBar',true)
        }

        const handleRedirect=(name)=>{
            router.push({name})
        }

        const handleExit = ()=>{
            alert_with_conf().then(async res=>{
                if(res.isConfirmed){
                    await logout()
                    router.push({name:'Login'})  
                }
            })
            
        }

        projectAuth.onAuthStateChanged(user=>{
              if(user){
                  login.value = true
              }else{
                  login.value = false
              }
          })

        const alert_with_conf = ()=>{
          return Swal.fire({
                title: 'האם את/ה בטוח/ה שאת/ה רוצה לצאת מהמערכת?',
                icon: 'question',
                iconHtml: '?',
                confirmButtonText: 'כן',
                cancelButtonText: 'לא',
                showCancelButton: true,
                showCloseButton: true
            })
        }
        return {handleSideBar,handleRedirect,handleExit,login}
    }
}
</script>

<style scoped>
    .navbar-container{
        width: 100%;
        height: 3rem; 
        display: flex;
        border-bottom: 1px solid lightgray;
    }
    .headlines{
        width: 20%;
        height: 100%;
    }
    ul{
        display: flex;
        width: 100%;
        height: 100%;
        list-style-type: none;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
    }
    ul li{
        text-decoration-style: none;
        font-size:1.5rem;
    }
    ul li:hover{
        color: darkorange;
    }
    .logo{
        display: flex;
        width: 80%;
        padding: 0 1rem;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        cursor: pointer;
    }
    .logo .image{
        width: 40%;
        display: flex;
        justify-content: center;
    }
    .logo .hamburger{
        display: flex;
        justify-content: flex-end;
        width: 40%;
    }
    .logo .hamburger img{
        cursor: pointer;
    }
    .logo .hamburger img:hover{
        transform: scale(1.2);
    }
    .logo .image img{
        width: 3rem;
        border-radius:50% ;
    }

    @media screen and (max-width: 600px) {
        .headlines{
            width: 60%;
        }
        .headlines ul li{
            justify-content: space-between;
        }
        .logo{
            width: 40%;
        }
        .logo .image{
            width: 20%;
            display: none;
        }
        .hamburger{
            width: 20%;
        }
    }
</style>