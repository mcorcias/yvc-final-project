<template>

    <div class="navbar-container">
        <div class="headlines">
            <ul>
                <li @click="handleRedirect('Login')">כניסה</li>
                <li>הרשמה</li>
            </ul>
        </div>
        <div class="logo">
            <div class="image">
                <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/logo%2FWhatsApp%20Image%202021-06-04%20at%2014.57.19.jpeg?alt=media&token=6ac440eb-501b-47c0-a1f2-5efe12c0c4b4">
            </div>
            <div class="hamburger">
                <i class="pi pi-align-justify" @click="handleSideBar"></i>
            </div>
        </div>
    </div>
 
</template>

<script>
import Button from 'primevue/button';
import {useRouter} from 'vue-router'
export default {
    components:{Button},
    emits:['toggleSideBar'],
    setup(_,{emit}) {
        const router = useRouter()
        const handleSideBar = ()=>{
            emit('toggleSideBar',true)
        }

        const handleRedirect=(name)=>{
            router.push({name})
        }
        return {handleSideBar,handleRedirect}
    }
}
</script>

<style>
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
    .logo .hamburger i{
        font-size: 2.5rem;
        color: black;
        cursor: pointer;
    }
    .logo .hamburger i:hover{
        color: darkorange;
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