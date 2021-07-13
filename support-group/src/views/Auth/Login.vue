<template>
  <div class="login-container">
      <div class="wrapper">
          <div class="logo">
              <img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/logo%2FWhatsApp%20Image%202021-06-04%20at%2014.57.19.jpeg?alt=media&token=6ac440eb-501b-47c0-a1f2-5efe12c0c4b4">
              <h4>ברוכים הבאים לקבוצת תמיכה אונליין</h4>
          </div>
          <div class="fields">
              <div class="field">
                  <p>דוא"ל</p>
                  <InputText type="text" style="width:100%;" v-model="email"/>
              </div>
              <div class="field">
                  <p>סיסמה</p>
                  <input class="password" type="password" style="width:100%;" v-model="password">
              </div>
          </div>
          <div class="btn" style="text-align:center;">
              <Button v-if="!isPending" label="התחבר" class="p-button-secondary"  style="width:60%;" @click="handleSubmit" />
              <Button v-if="isPending" label="טוען..." class="p-button-secondary"  style="width:60%;" />
          </div>
      </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import useLogin from '../../composables/useLogin'
import { useRouter } from 'vue-router';
import { ref } from '@vue/reactivity';
import Swal from 'sweetalert2'

export default {
    components:{InputText,Button},
    setup() {
        const router = useRouter()
        const {error,login,isPending} = useLogin()
        const email = ref('')
        const password=ref('')
        const handleSubmit=async()=>{
           await login(email.value,password.value)
           if(!error.value){
               router.push({name:'Home'})
               email.value=''
               password.value=''
           }else{
               Swal.fire({
                    icon: 'error',
                    title: 'אופס...',
                    text: 'שם המשתמש או הססמה אינם נכונים',
                })
           }
       }
        return {email,password,error,isPending,handleSubmit}
    }
}
</script>

<style scoped>
    .login-container{
        width: 100%;
        height: calc(100vh - 3rem);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .wrapper{
        width: 50%;
        height: 70%;
    }
    .wrapper .logo{
        width: 100%;
        height: 25%;
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
    .fields .field p{
        font-size: 1.3rem;
    }
    /* error text */
    .error {
        color: #da0f41;
        font-size: 14px;
        margin: 16px 0;
    }
</style>