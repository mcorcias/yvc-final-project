<template>
  <div class="container">
      <div class="search-bar">
          <span class="p-input-icon-right">
            <i class="pi pi-search" />
            <InputText  type="text" v-model="search" placeholder="חפש קורס" />
         </span>
         <Dropdown class="dropdown" style="width:20%; margin-right:5px;" v-model="filterBySort" :options="sorting_options" placeholder="מיין לפי" />
         <img v-if="isTeacher" class="plus-icon" src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fplus.png?alt=media&token=5492e03a-58e7-4c94-8692-27cb25d0d5fd" @click="showAddCourse=!showAddCourse">
      </div>
      <div class="content">
          <Accordion :multiple="true" style="width:80%;">
              <template v-for="course in sortedCorses" :key="course.course_id">
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
                           <div class="btn" v-else>
                            <Button v-if="!isEnrolled(course.enrolled) && course.enrolled.length<course.capacity" label="הירשם לקורס" class="p-button-success" @click="handleEnroll(course)" />
                            <Button v-if="isEnrolled(course.enrolled)" label="בטל רישום לקורס" class="p-button-danger" @click="handleCancelEnroll(course)" />
                            <Tag v-if="course.enrolled.length==course.capacity" class="p-mr-2" severity="warning" value="הקורס בתפוסה מלאה"></Tag>
                           </div>
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
              <div class="field">
                  <MultiSelect style="width:100%" v-model="course_data.days" :options="days_options" optionLabel="brand" optionValue="value" placeholder="בחר ימים" />
        
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
import MultiSelect from 'primevue/multiselect';
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
    components:{InputText,Accordion,AccordionTab,Button,Tag,Dropdown,Dialog,InputNumber,Textarea,MultiSelect},
    setup(){
        
        const days_options=ref([
			{brand: 'יום א\'', value: 0},
			{brand: 'יום ב\'', value: 1},
			{brand: 'יום ג\'', value: 2},
			{brand: 'יום ד\'', value: 3},
			{brand: 'יום ה\'', value: 4},
			{brand: 'יום ו\'', value: 5},
		])
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
            enrolled_id:[],
            enrolled:[],
            capacity:0,
            start_date:'',
            end_date:'',
            days:[],

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
                    case 'days':
                        if(value.length==0){
                            error_msg.value = 'עליך לבחור ימים שהם מתרחש הקורס בשבוע'
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

        const sortedCorses=ref(computed(()=>{
            if(filterBySort.value=='' || filterBySort.value=='ללא מיון' ) return filterBySearch.value
            if(filterBySort.value=='קורסים פנויים'){
                return filterBySearch.value.filter(course=>{
                    if(course.enrolled.length<course.capacity) return course
                })
            }
            if(filterBySort.value=='קורסים בתפוסה מלאה'){
                return filterBySearch.value.filter(course=>{
                    if(course.enrolled.length==course.capacity) return course
                })
            }
            if(filterBySort.value=='קורסים שלי'){
                return filterBySearch.value.filter(course=>{
                    const index = course.enrolled.findIndex(_user=>_user.id==user.value.id)
                    if(index!=-1){
                        return course
                    }
                })
            }
            if(filterBySort.value=='קורסים שאינני רשום'){
                return filterBySearch.value.filter(course=>{
                    const index = course.enrolled.findIndex(_user=>_user.id==user.value.id)
                    if(index==-1){
                        return course
                    }
                })
            }

        }))

        const filterBySort=ref('')

        const sorting_options=ref([
            "ללא מיון",
            "קורסים פנויים",
            "קורסים בתפוסה מלאה",
            "קורסים שלי",
            "קורסים שאינני רשום"
        ])

        const filterBySearch=ref(computed(()=>{
          if(search.value=='')return courses.value
          return courses.value.filter(course=>{
              if(course.teache_name.includes(search.value))return course
              if(course.course_name.includes(search.value))return course
          })
      }))

        const handleEnroll=async(course)=>{
            console.log(course);
            if(!(await enrolle_validation(course))){
                Swal.fire({
                icon: 'error',
                title:'שגיאה',
                text:error_msg.value,
                })
            }else{
                const index_1 = course.enrolled.findIndex(student=>student.id==user.value.id)
                const index_2 = course.enrolled_id.findIndex(student=>student==user.value)
                if(index_1==-1 && index_2==-1){
                    course.enrolled.push(user.value)
                    course.enrolled_id.push(user.value.id)
                    await projectFirestore.collection('Courses').doc(course.course_id).set({
                        enrolled:course.enrolled,
                        enrolled_id:course.enrolled_id
                    },{merge:true})
                    Swal.fire({
                        icon: 'success',
                        title:'הצלחה',
                        text:  `נרשמת בהצלחה לקורס:${course.course_name}`,
                    })
                }
            }
        }
        const enrolle_validation=async(course)=>{
            const days = course.days
            const s_hours = new Date(course.start_date.seconds * 1000).getHours()<10?'0'+new Date(course.start_date.seconds * 1000).getHours():new Date(course.start_date.seconds * 1000).getHours()
            const s_minutes = new Date(course.start_date.seconds * 1000).getMinutes()<10?'0'+new Date(course.start_date.seconds * 1000).getMinutes():new Date(course.start_date.seconds * 1000).getMinutes()
            const start = s_hours+":"+s_minutes
            const e_hours = new Date(course.end_date.seconds * 1000).getHours()<10?'0'+new Date(course.end_date.seconds * 1000).getHours():new Date(course.end_date.seconds * 1000).getHours()
            const e_minutes = new Date(course.end_date.seconds * 1000).getMinutes()<10?'0'+new Date(course.end_date.seconds * 1000).getMinutes():new Date(course.end_date.seconds * 1000).getMinutes()
            const end = e_hours+":"+e_minutes
            const docs= await my_courses()
            for(const doc of docs){
                if(doc.days.includes(days[0]) || doc.days.includes(days[1])){
                    
                    const _start=doc.start_date.toDate().getHours()+":"+doc.start_date.toDate().getHours()
                    const _end = doc.end_date.toDate().getHours()+":"+doc.end_date.toDate().getHours()
                    if(Date.parse(`01/01/2011 ${end}`) >= Date.parse(`01/01/2011 ${_start}`) ||Date.parse(`01/01/2011 ${start}`)<= Date.parse(`01/01/2011 ${_end}`)){
                        console.log('check');
                        error_msg.value=`כפילות בשעות בקורס ${doc.course_name}`
                        return false
                    }
                }
            }
            return true
        }

        const my_courses=async()=>{
            const docs = await projectFirestore.collection('Courses')
            .where('enrolled_id','array-contains',user.value.id).get()
            return docs.docs.map(doc=>doc.data())
        }

        const handleCancelEnroll = async(course)=>{
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
                    const index_1 = course.enrolled.findIndex(student=>student.id==user.value.id)
                    const index_2 = course.enrolled_id.findIndex(student=>student==user.value.id)
                    console.log(index_1,index_2);
                    console.log(course.enrolled_id);
                    if(index_1!=-1 && index_2!=-1){
                        console.log('check');
                        course.enrolled.splice(index_1,1)
                        course.enrolled_id.splice(index_2,1)
                        console.log('after:',course.enrolled_id);
                        await projectFirestore.collection('Courses').doc(course.course_id).set({
                         enrolled:course.enrolled,
                         enrolled_id:course.enrolled_id
                        },{merge:true})
                    }
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
           snapshot = projectFirestore.collection('Courses').where('start_date','>',startfulldate).onSnapshot(snapshot => {
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
            filterBySort,
            sorting_options,
            sortedCorses,
            isPending,
            isTeacher,
            showAddCourse,
            course_data,
            error_msg,
            isEdit,
            course_id_when_edit,
            days_options
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
</style>