<template>
 <div class="settings-container">
     <div class="wrapper">
         <div class="box box-1">
             <h1>פרופיל משתמש</h1>
             <div class="field">
                 <p class="lead">שם משתמש</p>
                 <InputText type="text" placeholder='שם משתמש' v-model="user_details.fullName" style="width:100%;" />
             </div>
             <div class="field">
                 <p class="lead">טלפון נייד</p>
                 <InputText type="text" placeholder='טלפון נייד' v-model="user_details.phoneNumber" style="width:100%;" />
             </div>
             <div class="field">
                 <p class="lead">כתובת</p>
                 <InputText type="text" placeholder='כתובת מלאה' v-model="user_details.address" style="width:100%;" />
             </div>
             <div class="field">
                 <p class="lead">תאריך לידה</p>
                 <small v-if="user_details.birthDay && user_details.birthDay.seconds">{{user_details.birthDay.toDate().toLocaleDateString('he')}}</small>
                 <small v-if="user_details.birthDay && typeof user_details.birthDay==='string'">{{user_details.birthDay}}</small>
                 <input type="date" style="width:100%" v-model="user_details.birthDay"/>
             </div>
             <div class="field">
                 <p class="lead">דוא"ל</p>
                 <InputText type="text" style="width:100%;" v-model="user_details.email" disabled />
             </div>
             <div class="field">
                 <Button label="עדכן פרופיל" class="p-button-success" style="width:100%;" @click="handleUpdateProfile"/>
             </div>
         </div>
         <div class="box box-2">
             <h1>תמונת פרופיל</h1>
            <Avatar  v-if="!user_details.avatar" icon="pi pi-user" class="p-mr-2 avatar" size="xlarge" shape="circle" />
            <img  v-if="user_details.avatar" :src="user_details.avatar" @click="showAvatarModal=true">
             <div class="field">
                 <Button  label="העלה תמונה" class="p-button-success" style="width:100%;" @click="handleUploadImg"/>
                 <input v-show="false" id="upload" type="file" @change="handleChange">
                 <p v-if="fileError" style="color:red;">{{fileError}}</p>
             </div>
         </div>
     </div>
 </div>
</template>

<script>
import {onMounted, ref } from '@vue/runtime-core'
import store from '../store/index'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Swal from 'sweetalert2'
import Avatar from 'primevue/avatar';
import useStorage  from '../composables/useStorage'
import {projectFirestore} from '../firebase/config'
import {showAvatarModal} from '../methods/AvatarModal'
export default {
    components:{InputText,Button,Avatar},
    setup(){

        const {url, filePath, uploadImage } = useStorage()
        const file = ref(null)
        const fileError = ref(null)
        const error = ref('')
        const user_details = ref({})
    
        const handleUpdateProfile = async()=>{
            if(!validation()){
                Swal.fire({
                icon: 'error',
                title: 'אירעה שגיאה',
                text: `${error.value}`,
                })
            }else{
                if(!user_details.value.birthDay.seconds){
                    user_details.value.birthDay = new Date(user_details.value.birthDay)
                }else{
                    user_details.value.birthDay =new Date(user_details.value.birthDay.seconds * 1000)
                }
                await projectFirestore.collection('Users').doc(user_details.value.id)
                .update(user_details.value)

                user_details.value = store.getters.getUserProfile
            }
         


        }

        const validation = ()=>{
            if(isLetters(user_details.value.phoneNumber) || user_details.value.phoneNumber.length!=10){
                error.value ='נא להזין מספר טלפון תקין'
                return false
            }
            if(user_details.value.fullName.length<2){
                error.value = 'נא להזין שם משתמש תקין'
                return false
            }
            return true
        }

        const handleUploadImg = ()=>{
            document.getElementById('upload').click()
        }
        const handleChange = async(e)=>{
            const types = ['image/png','image/jpeg','image/jpg']
            const selected=e.target.files[0]
            console.log(selected);
           
            if(selected && types.includes(selected.type)){
                file.value=selected
                fileError.value = null
                await uploadImage(file.value)
                await projectFirestore.collection('Users').doc(user_details.value.id)
                .set({
                    avatar:url.value,
                    avatar_path:filePath.value
                },{merge:true})
                 user_details.value = store.getters.getUserProfile
            }else{
                file.value=null
                fileError.value = 'נא לבחור תמונה בפורמט jpg, jpeg, png'
            }
        }
        const isLetters=(str)=>{
            const regExp = /[a-zA-Z]/g;
            const testString = str;
            if(regExp.test(testString))return true
            return false
        }
        onMounted(()=>{
            setTimeout(() => {
                user_details.value = store.getters.getUserProfile
            }, 500);
        })

        return{user_details,handleUpdateProfile,handleUploadImg,handleChange,error,fileError,showAvatarModal}
    }
}
</script>

<style scoped>
    .settings-container{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        overflow-y: auto;
    }
    .wrapper{
        width: 95%;
        height: 95%;
        max-height: 95%;  
        display: flex;
    }
    .box{
        width: 100%;
        height:100%;
        border: 2px solid lightgreen;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .box-1{
        margin-left:5px;
       
    }
    .box-2{
      
    }
    .field{
        margin-top: 15px;
        width: 80%;
        height: auto;
    }
    .lead{
        font-size: 1.2rem;
        font-weight: bold;
    }
    input[type="date"] {
    height: 35px;
    border: 0.5px solid lightgrey;
    border-radius: 3px;
    }
    input[type="date"]:hover {
    border: 1.1px solid lightblue;
    }
    input[type="date"]:focus {
    outline: none;
    border: 1.1px solid lightblue;
    }
    .box-2 img{
        width: 25%;
        height: 25%;
        border-radius: 50%;
        cursor: pointer;
    }
    @media screen and (max-width: 600px) {
         .wrapper{
             flex-direction: column;
         }
         .box{
             margin-bottom: 10px;
         }
    }
</style>