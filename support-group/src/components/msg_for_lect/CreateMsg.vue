<template>
    
  <div class="create_msg_container">
      <div class="header">
        <h3>רשימת הקורסים שלך</h3>
      </div>
      <div class="courses">
        <template v-for="course in courses" :key="course">
            <div class="course" @click="handle_course(course)">{{course.course_name}}</div> 
        </template>
      </div>
      <Dialog header="משתתפי הקורס" v-model:visible="show_course_detail" >
         <div class="course-detail">
            <Button @click="handle_send_to_all" v-if="selected_current_course.enrolled.length>0" label="שלח הודעה לכלל משתתפי הקורס" class="p-button-secondary" />
             <table id="customers">
                <tr>
                    <th class="profile">תמונת פרופיל</th>
                    <th>שם מלא</th>
                    <th>דוא"ל</th>
                    <th>טלפון</th>
                    <th>שלח הודעה</th>
                </tr>
                <template v-for="user in selected_current_course.enrolled">
                    <tr>
                        <td class="profile" v-if="user.avatar"><img :src="user.avatar"></td>
                        <td class="profile" v-else="user.avatar"><img src="data:image/png;base64,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"></td>
                        <td>{{user.fullName}}</td>
                        <td>{{user.email}}</td>
                        <td v-if="user.phoneNumber">{{user.phoneNumber}}</td>
                        <td v-else>לא צויין</td>
                        <td class="msg" @click="handle_open_send_msg(user.id)"><img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fletter.png?alt=media&token=f7325470-a86e-4feb-b8b2-be7d927b2913" alt=""></td>
                    </tr>
                    
                </template>   
             </table>
             <div class="user-details-mobile">
                  <template v-for="user in selected_current_course.enrolled">
                      <div class="user-mobile">
                            <div>
                                <p class="lead">שם</p>
                                <p>{{user.fullName}}</p>
                            </div>
                            <div>
                                <p class="lead">דוא"ל</p>
                                <p>{{user.email}}</p>
                            </div>
                            <div>
                                <p class="lead">טלפון</p>
                                <p v-if="user.phoneNumber">{{user.phoneNumber}}</p>
                                <p v-else>לא צויין</p>
                            </div>
                            <div>
                                <div class="msg" @click="handle_open_send_msg(user.id)"><img src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fletter.png?alt=media&token=f7325470-a86e-4feb-b8b2-be7d927b2913" alt=""></div>
                            </div>
                      </div> 
                  </template>   
             </div>
              <h1 v-if="selected_current_course.enrolled.length==0">לקורס אין משתתפים</h1>
         </div> 
      </Dialog>
      <Dialog header="שליחת הודעה" v-model:visible="show_send_msg" >
          <div class="send-msg">
              <div class="field">
                  <p>כותרת ההודעה</p>
                  <InputText v-model="msg_data.title" style="width:100%;" type="text" placeholder="כותרת" />
              </div>
              <div class="field">
                  <p>תוכן ההודעה</p>
                  <Textarea v-model="msg_data.content" style="width:100%;"  rows="5" cols="30" placeholder="תוכן ההודעה" />
              </div>
              <div class="field">
                  <Button @click="handle_send_msg"  style="width:100%;" label="שליחה" icon="pi pi-envelope" iconPos="right" class="p-button-success"/>
              </div>
          </div>
      </Dialog>
  </div>
</template>

<script>
import {projectFirestore} from '../../firebase/config'
import store from '../../store'
import { onMounted, ref } from '@vue/runtime-core'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Swal from 'sweetalert2'



export default {
    components:{Dialog,Textarea,InputText,Button},
    setup(){
        const error_msg = ref('')
        const userId = ref(null)
        const current_user_name = ref('')
        const courses = ref([])
        const selected_current_course = ref({})
        const selected_user_id = ref('')
        const show_course_detail = ref(false)
        const show_send_msg = ref(false)
        const msg_data=ref({
            title:'',
            content:'',
            date:new Date(),
            from:'',
            ignored:false,
            seenBy:false
        })
        const handle_course =(course)=>{
            selected_current_course.value = course
            show_course_detail.value = !show_course_detail.value
        }
        const handle_open_send_msg = (userId)=>{
            show_send_msg.value = !show_send_msg.value
            selected_user_id.value = userId
        }
        const handle_send_to_all=()=>{
            show_send_msg.value = !show_send_msg.value
            selected_user_id.value=''
        }
        const handle_send_msg = async()=>{
            if(!validation()){
                Swal.fire({
                    icon: 'error',
                    title: 'שגיאה',
                    text: `${error_msg.value}`,
                })
            }else{
                if(selected_user_id.value){
                    await send_msg_to_db()
                }else{
                    await send_msg_all_to_db()
                }
                Swal.fire({
                    icon: 'success',
                    title: 'הצלחה',
                    text: 'ההודעה נשלחה בהצלחה',
                }).then(res=>{
                    if(res.isConfirmed){
                        show_send_msg.value = false
                        reset_msg_data()
                    }
                })
            }
        }
        const validation = ()=>{
            if(!msg_data.value.title){
                error_msg.value='עליך לכתוב כותרת'
                return false
            }
            if(!msg_data.value.content){
                error_msg.value='עליך לכתוב תוכן'
                return false
            }
            return true
        }
        const reset_msg_data=()=>{
            msg_data.value={
                title:'',
                content:'',
                date:new Date(),
                from:current_user_name.value,
                ignored:false,
                seenBy:false
            }
        }
        const send_msg_to_db=async()=>{
            const doc = projectFirestore.collection('UserMessages').doc('users').collection(selected_user_id.value).doc()
            await doc.set({...msg_data.value,id:doc.id})
        }
        const send_msg_all_to_db=async()=>{
            for (const user of selected_current_course.value.enrolled) {
                 const doc = projectFirestore.collection('UserMessages').doc('users').collection(user.id).doc()
                 await doc.set({...msg_data.value,id:doc.id})
            }
        }
        onMounted(()=>{
            setTimeout(async() => {
                userId.value = store.getters.getUserProfile.id
                current_user_name.value = store.getters.getUserProfile.fullName
                msg_data.value.from = current_user_name.value
                await get_your_courses()
            }, 500);
        })

        const get_your_courses = async()=>{
            const docs = await projectFirestore.collection('Courses').where('teacher_id','==',userId.value).get()
            courses.value = docs.docs.map(doc=>doc.data())
        }

      
        return{
            courses,
            handle_course,
            selected_current_course,
            show_course_detail,
            handle_open_send_msg,
            show_send_msg,
            selected_user_id,
            handle_send_msg,
            msg_data,
            handle_send_to_all
        }
    }
}
</script>

<style scoped>
   
    .create_msg_container{
        padding: 5px;
        width: 100%;
        height: 100%;
    }
    .header{
        width: 100%;
        height: 60px;
        text-align: center;
    }
    .courses{
        width: 100%;
        height: calc(100% - 60px);
        display: grid;
        grid-template-columns:repeat(auto-fill,minmax(300px, 1fr));
        grid-auto-rows: 200px;
        grid-gap: 5px;
    }
    .course{
        background: teal;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        cursor: pointer;
        border-radius: 15px;
    }
    .course:hover{
        transform: scale(1.01);
        background-color: lightseagreen;
    }
    .course-detail{
        width: 80vw;
        height: 70vh;
        overflow:hidden;
        overflow-y: auto;
    }
    .send-msg{
        width: 50vw;
        height: 40vh;
    }

    #customers {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    #customers td, #customers th {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
        max-width:15px;
        vertical-align:middle;  
    }
  
    #customers tr:nth-child(even){background-color: #f2f2f2;}

    #customers tr:hover {background-color: #ddd;}

    #customers th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #04AA6D;
        color: white;
    }
    #customers td img{
        max-width:100%;
        max-height: 100%;
        border-radius: 15px;
    }
    #customers .msg{
        cursor: pointer;
    }
    #customers .msg img{
        border-radius: unset;
    }
    .field{
        width: 100%;
        height: fit-content;
        margin-bottom: 5px;
    }
    .user-details-mobile{
    display: none;
    }
    .lead{
        font-weight: bold;
    }

    @media screen and (max-width: 600px) {
        .course-detail {
            margin-top: 5px;
            width: 80vw;
        }
        table{
            display: none;
        }
        .user-details-mobile{
            display: block;
            margin-top: 5px;
            overflow:hidden;
            overflow-y: auto;
        }
        .user-mobile{
            width: 100%;
            height: fit-content;
            display: grid;
            grid-template-columns: repeat(2,1fr);
            grid-gap: 5px;
            border: 1px solid gray;
            margin-bottom:5px;
        }
        .user-mobile div{
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .send-msg{
            width: 80vw;
        }    
    }
</style>