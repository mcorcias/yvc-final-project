<template>
  <div class="container">
      <div class="search-bar">
          <span class="p-input-icon-right">
            <i class="pi pi-search" />
            <InputText  type="text" v-model="search" placeholder="חפש קורס" />
         </span>
      </div>
      <div class="content">
          <Accordion :multiple="true" style="width:80%;">
              <template v-for="course in filterBySearch " :key="course.course_id">
                  <AccordionTab>
                        <template #header>
                            <span style="color:green;">{{course.course_name}}, מרצה: {{course.teache_name}} - <span style="color:red;">{{course.enrolled.length}}</span>/{{course.capacity}}</span>
                       </template>
                       <div class="dates">
                        <small style="color:red; font-weight:bold;">
                             תחילת הקורס:{{course.start_date.toDate().toLocaleDateString('he')}}, {{course.start_date.toDate().toLocaleTimeString('he')}}, יום:{{weekDay(course.start_date.toDate())}}
                        </small>
                        <small style="color:red; font-weight:bold;">סיום הקורס:{{course.end_date.toDate().toLocaleDateString('he')}}, {{course.end_date.toDate().toLocaleTimeString('he')}}, יום:{{weekDay(course.end_date.toDate())}}</small>
                       </div>
                       <div class="course-content">
                           <p>{{course.course_content}}</p>
                           <div class="btn" v-if="course.teacher_id == user.id">
                               <Button label="ערוך קורס" class="p-button-secondary" @click="handleEditCourse(course)"/>
                               <Tag v-if="course.enrolled.length==course.capacity" class="p-mr-2" severity="warning" value="הקורס בתפוסה מלאה"></Tag>
                               <Button label="מחק קורס" class="p-button-danger" @click="handleDeleteCourse(course.course_id)"/>
                           </div>
                       </div>
                       <div class="students-list">
                            <h3>רשומים לקורס</h3>
                            <template v-for="student in course.enrolled" :key="student.id">
                                <div class="student">
                                    <div class="full-name">
                                        <p>{{student.fullName}}</p>
                                    </div>
                                    <div class="email">
                                        <p>{{student.email}}</p>
                                    </div>
                                    <div class="date">
                                        <p>נרשם בתאריך</p>
                                        <p>{{new Date(student.createdAt.seconds * 1000).toLocaleDateString('he')}}</p>
                                    </div>
                                    <div class="phone">
                                        <p>{{student.phoneNumber}}</p>
                                    </div>
                                </div>
                            </template>
                       </div>
                 </AccordionTab>
              </template>
        </Accordion>
      </div>

      <Dialog position="top" header="הוספת קורס חדש" v-model:visible="showAddCourse" >
          <div class="add-course">
              <div class="field">
                <div>
                    <p>שם הקורס</p>
                    <InputText v-model="course_data.course_name" style="width:100%" type="text"  />
                </div>
                <div>
                    <p>כמות נרשמים</p>
                    <InputNumber v-model="course_data.capacity" showButtons mode="decimal" :min="0" :max="100"  />
                </div>
              </div>
              <div class="field">
                <div>
                    <p>תאריך ושעת תחילת הקורס</p>
                    <input type="datetime-local" v-model="course_data.start_date">
                </div>
                <div>
                    <p>תאריך ושעת סיום הקורס</p>
                    <input type="datetime-local" v-model="course_data.end_date">
                </div>
              </div>
              <p>תיאור הקורס</p>
              <Textarea v-model="course_data.course_content" style="width:100%;"  rows="5" cols="30" />
              <Button v-if="!isEdit" style="width:100%" label="צור קורס" class="p-button-success" @click="handleCreateCourse" />
              <Button v-if="isEdit" style="width:100%" label="עדכן קורס" class="p-button-success" @click="handleCreateCourse" />
          </div>
    </Dialog>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import InputNumber from 'primevue/inputnumber';
import Swal from 'sweetalert2'
import { ref } from '@vue/reactivity';
import {projectFirestore,firebase} from '../firebase/config'
import { computed, onMounted, onUnmounted } from '@vue/runtime-core';
import store from '../store';

export default {
    components:{InputText,Accordion,AccordionTab,Button,Tag,Dropdown,Dialog,InputNumber,Textarea},
    setup(){
        
        const isEdit = ref(false)
        const course_id_when_edit = ref('')
        const handleEditCourse=(course)=>{
            console.log(course.start_date.toDate());
            course_data.value = {...course}
            course_data.value.start_date  =  convertDateToString(course.start_date.toDate())
            course_data.value.end_date  =  convertDateToString(course.end_date.toDate())
            course_data.value.createdAt  =  course.createdAt.toDate()
            course_data.value.capacity = Number(course.capacity)
            course_id_when_edit.value = course.course_id
            isEdit.value = true
            showAddCourse.value = true
        }
        const error_msg=ref('')
        const course_data=ref({
            createdAt:new Date(),
            course_name:'',
            teache_name:'',
            teacher_id:'',
            enrolled:[],
            capacity:0,
            start_date:'',
            end_date:'',
            course_content:'',
        })

        const validation = ()=>{
            for (const [key, value] of Object.entries(course_data.value)) {
                switch (key) {
                    case 'course_name':
                        if(!value){
                            error_msg.value = 'נא למלא שם קורס'
                            return false
                        }
                        break;
                    case 'capacity':
                        if(value==0){
                            error_msg.value = 'עליך למלא כמות נרשמים'
                            return false
                        }
                        break;
                    case 'start_date':
                        if(!value){
                            error_msg.value = 'עליך למלא תאריך ושעת תחילת הקורס'
                            return false
                        }
                        break;
                    case 'end_date':
                        if(!value){
                            error_msg.value = 'עליך למלא תאריך ושעת סיום הקורס'
                            return false
                        }
                        break;
                    case 'course_content':
                        if(!value){
                            error_msg.value = 'עליך לרשום תיאור לקורס'
                            return false
                        }
                        break;
                    default:
                        break;
                }
            }
            return true
        }
        const handleCreateCourse=async()=>{
            if(!validation()){
                Swal.fire({
                icon: 'error',
                title:'שגיאה',
                text:error_msg.value,
                })
                return
            }else{
                course_data.value.start_date=new Date(course_data.value.start_date)
                course_data.value.end_date=new Date(course_data.value.end_date)
                course_data.value.teache_name = user.value.fullName
                course_data.value.teacher_id = user.value.id
                console.log(course_data.value);
                if(!isEdit.value){
                    await create_new_course_in_db()
                }else{
                    await update_course_in_db(course_id_when_edit.value)
                }
                showAddCourse.value=false
                Swal.fire({
                    icon: 'success',
                    title:'הצלחה',
                    text:`הקורס ${course_data.value.course_name} נוצר הצלחה`,
                })
                reset_course_data()
            }
        }

        const handleDeleteCourse=(id)=>{
            Swal.fire({
                title: 'האם אתה בטוח שברצונך למחוק קורס זה?',
                icon: 'question',
                iconHtml: '?',
                confirmButtonText: 'כן',
                cancelButtonText: 'לא',
                showCancelButton: true,
                showCloseButton: true
            }).then(async res=>{
                if(res.isConfirmed){
                    await projectFirestore.collection('Courses').doc(id).delete()
                }
            })
        }
       
        const showAddCourse = ref(false)
        const isTeacher = ref(false)
        const search=ref('')
        const courses = ref([])
        const user = ref()
        const isPending = ref(false)

       


        const filterBySearch=ref(computed(()=>{
          if(search.value=='')return courses.value
          return courses.value.filter(course=>{
              if(course.teache_name.includes(search.value))return course
              if(course.course_name.includes(search.value))return course
          })
      }))

        const handleEnroll=async(courseId,courseName)=>{
            const docs = await projectFirestore.collection('Courses').doc(courseId).get()
            const current_enrolled_arr =  docs.data().enrolled.map(user=>user)
            console.log(current_enrolled_arr);
            current_enrolled_arr.push(user.value)
            await projectFirestore.collection('Courses').doc(courseId).set({
                enrolled:current_enrolled_arr
            },{merge:true})
            Swal.fire({
                icon: 'success',
                title:'הצלחה',
                text:  `נרשמת בהצלחה לקורס:${courseName}`,
            })
        }
        const handleCancelEnroll = async(courseId)=>{
            Swal.fire({
                title: '?האם אתה בטוח שאתה רוצה לבטל קורס זה?',
                icon: 'question',
                iconHtml: '?',
                confirmButtonText:'כן',
                cancelButtonText: 'לא',
                showCancelButton: true,
                showCloseButton: true
            }).then(async res=>{
                if(res.isConfirmed){
                    const docs = await projectFirestore.collection('Courses').doc(courseId).get()
                    let current_enrolled_arr =  docs.data().enrolled.map(user=>user)
                    current_enrolled_arr = current_enrolled_arr.filter(_user=>_user.id!=user.value.id)
                    
                    await projectFirestore.collection('Courses').doc(courseId).set({
                        enrolled:current_enrolled_arr
                    },{merge:true})
                }
            })
        }
      
        //בדיקה אם המשתמש רשום לקורס
        const isEnrolled = (enrolled)=>{
            const index = enrolled.findIndex(_user=>_user.id==user.value.id)
            if(index!=-1)return true
            return false
        }
        //helper
        const weekDay=(date)=>{
            const d = date
            const weekday = new Array(7);
            weekday[0] = "ראשון";
            weekday[1] = "שני";
            weekday[2] = "שלישי";
            weekday[3] = "רביעי";
            weekday[4] = "חמישי";
            weekday[5] = "שישי";
            weekday[6] = "שבת";

            const n = weekday[d.getDay()];
            return n
        }

        const create_new_course_in_db=async()=>{
            const doc = projectFirestore.collection('Courses').doc()
            await doc.set({...course_data.value,course_id:doc.id})
        }

        const update_course_in_db=async(course_id)=>{
             await projectFirestore.collection('Courses').doc(course_id)
             .set(course_data.value,{merge:true})
        }

        const reset_course_data=()=>{
            course_data.value={
                createdAt:new Date(),
                course_name:'',
                teache_name:'',
                teacher_id:'',
                enrolled:[],
                capacity:0,
                start_date:'',
                end_date:'',
                course_content:'',
            }
        }

        const convertDateToString=(date)=>{
            const date_string = date.toISOString().split('T')[0]
            let hour = date.getHours()
            if(hour<10)hour="0"+hour
            let min = date.getMinutes()
            if(min<10)min="0"+min
            console.log(date_string+"T"+hour+":"+min);
            return date_string+"T"+hour+":"+min
        }

        let snapshot
        const getCorsesFromDb=()=>{
           var startfulldate = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));
           snapshot = projectFirestore.collection('Courses').where('teacher_id','==',user.value.id)
           .where('start_date','<',startfulldate).onSnapshot(snapshot => {
               snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        courses.value.push(change.doc.data())
                    }
                    if (change.type === "modified") {
                        const index = courses.value.findIndex(course=>course.course_id==change.doc.data().course_id)
                        if(index!=-1){
                            courses.value[index]=change.doc.data()
                        }
                    }
                    if (change.type === "removed") {
                        const index = courses.value.findIndex(course=>course.course_id==change.doc.data().course_id)
                        if(index!=-1){
                            courses.value.splice(index,1)
                        }
                    }
               }) 
            })

        }
        onMounted(()=>{
            setTimeout(() => {
                user.value = store.getters.getUserProfile
                if(user.value.role =='teacher'){
                    isTeacher.value = true
                }
                getCorsesFromDb()
            }, 500);
           
        })

        onUnmounted(()=>{
            if(snapshot){
                snapshot()
            }
        })

        return {
            isEnrolled,
            handleEnroll,
            handleCancelEnroll,
            weekDay,
            handleCreateCourse,
            handleEditCourse,
            handleDeleteCourse,
            search,
            courses,
            user,
            filterBySearch,
            isPending,
            isTeacher,
            showAddCourse,
            course_data,
            error_msg,
            isEdit,
            course_id_when_edit
        }
    }
}
</script>

<style scoped>
    .container{
        padding: 1.2rem;
        width: 100vw;
        height: calc(100vh - 3rem);
        
    }
    .search-bar{
        width: 100%;
        height: 10%;
        display: flex;
        align-items: center;
    }
    .content{
        width: 100%;
        height: calc(100% - 10%);
        overflow: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .dates{
        display: flex;
        justify-content: space-around;
    }
    .course-content{
        width: 100%;
        height: auto;
        margin-top: 15px;
        
    }
    .btn{
        margin-top:15px;
        display: flex;
        justify-content: space-between;
    }
    .dropdown > ul{
        background-color: chartreuse;
    }
    .search-bar .plus-icon{
        width:40px;
        margin-right:5px;
        cursor: pointer;
    }
    .search-bar .plus-icon:hover{
        transform: scale(1.1);

    }
    .add-course{
        width: 40vw;
        height: 50vh;
    }
    .field{
        width: 100%;
        height: auto;
        margin-bottom:5px;
        display: flex;
    }
    .field div{
        width: 50%;
        height: 100%;
        margin-right: 2px;
    }
    input[type="datetime-local"] {
    height: 35px;
    width:100%;
    border: 0.5px solid lightgrey;
    border-radius: 3px;
    }
    input[type="datetime-local"]:hover {
    border: 1.1px solid lightblue;
    }
    input[type="datetime-local"]:focus {
    outline: none;
    border: 1.1px solid lightblue;
    }
    .students-list{
        margin-top: 10px;
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .students-list .student{
        display: flex;
        width: 100%;
        height: 10%;
    }
    .student div{
        width: 25%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
       
    }
</style>