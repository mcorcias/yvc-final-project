<template>
   <div class="signup-container">
       <div class="wrapper">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/logo%2FWhatsApp%20Image%202021-06-04%20at%2014.57.19.jpeg?alt=media&token=6ac440eb-501b-47c0-a1f2-5efe12c0c4b4">
              <h4>ברוכים הבאים לקבוצת תמיכה אונליין</h4>
              <h3>טופס הרשמה</h3>
          </div>
          <div class="fields">
              <div class="field">
                  <p>שם מלא</p>
                  <InputText type="text" style="width:100%;" v-model="values.fullName"/>
              </div>
              <div class="field">
                  <p>דוא"ל</p>
                  <InputText type="text" style="width:100%;" v-model="values.email"/>
              </div>
              <div class="field">
                  <p>סיסמה</p>
                  <input class="password" type="password" style="width:100%;" v-model="values.password">
              </div>
              <div class="field">
                  <p>אימות סיסמה</p>
                  <input class="password" type="password" style="width:100%;" v-model="values.password_conf">
              </div>
          </div>
          <div class="btn" style="text-align:center;">
              <Button v-if="!isPending" label="הירשם" class="p-button-secondary"  style="width:60%;" @click="handleSubmit"/>
              <Button v-if="isPending" label="טוען..." class="p-button-secondary"  style="width:60%;" />
          </div>
      </div>
   </div>
</template>

<script>
import useSignup from '@/composables/useSignup'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { ref } from '@vue/reactivity';
import {projectFirestore,projectAuth} from '../../firebase/config'
import Swal from 'sweetalert2'
import Avatar from 'primevue/avatar';
export default {
    components:{InputText,Button},
    setup(){
        const router = useRouter()
        const { error, signup, isPending } = useSignup()
        const errorMsg = ref('')
        const values = ref({
            fullName:'',
            email:'',
            password:'',
            password_conf:'',
            role:'user',
            createdAt:new Date(),
            birthDay:'',
            address:'',
            phoneNumber:'',
            avatar:'',
        })

        const validation = ()=>{
            for (var key in values.value) {
                if (key == "fullName") {
                    if (values.value[key].length <2) {
                        errorMsg.value = "נא למלא שם משתמש תקין";
                        return false;
                    }
                }
                if (key == "email") {
                    if (!values.value[key].includes('@')) {
                        errorMsg.value = "נא למלא מספר  כתובת מייל תקינה";
                        return false;
                    }
                }
                if (key == "password") {
                    if (values.value[key].length <6) {
                        errorMsg.value = "נא למלא סיסמה בת 6 תווים לפחות";
                        return false;
                    }
                }
                if (key == "password_conf") {
                    if (values.value[key] != values.value.password) {
                        errorMsg.value = "אימות סיסמה נכשל - סיסמאות אינן זהות";
                        return false;
                    }
                }
            }

            return true
        }
        const handleSubmit = async()=>{
            if(!validation()){
              alert('error','אופס...',errorMsg.value)
            }else{
                await signup(values.value.email, values.value.password)
                if(error.value){
                    alert('error','כשל בהרשמה','משתמש זה כבר רשום')
                }else{
                    delete values.value.password
                    delete values.value.password_conf
                    await store_data_in_db(values.value,projectAuth.currentUser.uid)
                    alert('success',`ברוך הבא ${values.value.fullName}`,'נרשת בהצלחה למערכת')
                    .then(()=>{
                        router.push({name:'Home'})
                    })
                }
            }
        }
        const alert = (icon,title,text)=>{
             return Swal.fire({
                    icon,
                    title,
                    text,
              })
        }
        const store_data_in_db = async(data,id)=>{
            const doc = projectFirestore.collection('Users').doc(id)
            await doc.set({...data,id})
        }

        return{values,error,signup,isPending,handleSubmit,errorMsg}
    }
}
</script>

<style scoped>
    .signup-container{
        width: 100%;
        height: calc(100vh - 3rem);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .wrapper{
        width: 50%;
        height: 90%;
    }
    .wrapper .logo{
        width: 100%;
        height: 30%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid lightgray;
    }
    .wrapper .logo img{
        width: 100px;
        border-radius: 50%;
    }
     .fields{
        margin-top:25px;
        width: 100%;
        height: auto;
    }
    .fields .field{
        width: inherit;
        margin-bottom:15px;
    }
    .fields .field p{
        font-size: 1.3rem;
    }
    .fields .field .password{
        height: 39px;
        border: 1px solid #ced4da ;
        border-radius: 3px;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s
    }
    .fields .field .password:focus{
        outline: none;
        border: 2px solid #75bef8;
        box-shadow: 0 0 4px 1pt #75bef8;
    }
    /* error text */
    .error {
        color: #da0f41;
        font-size: 14px;
        margin: 16px 0;
    }
</style>