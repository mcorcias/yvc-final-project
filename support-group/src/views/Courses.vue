<template>
  <div class="container">
      <div class="search-bar">
          <span class="p-input-icon-right">
            <i class="pi pi-search" />
            <InputText  type="text" v-model="search" placeholder="חפש קורס" />
         </span>
         <Dropdown class="dropdown" style="width:20%; margin-right:5px;" v-model="filterBySort" :options="sorting_options" placeholder="מיין לפי" />
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
                           <div class="btn">
                            <Button v-if="!isEnrolled(course.enrolled) && course.enrolled.length<course.capacity" label="הירשם לקורס" class="p-button-success" @click="handleEnroll(course.course_id,course.course_name)" />
                            <Button v-if="isEnrolled(course.enrolled)" label="בטל רישום לקורס" class="p-button-danger" @click="handleCancelEnroll(course.course_id,course.course_name)" />
                            <Tag v-if="course.enrolled.length==course.capacity" class="p-mr-2" severity="warning" value="הקורס בתפוסה מלאה"></Tag>
                           </div>
                       </div>
                 </AccordionTab>
              </template>
        </Accordion>
      </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Swal from 'sweetalert2'
import { ref } from '@vue/reactivity';
import {projectFirestore} from '../firebase/config'
import { computed, onMounted } from '@vue/runtime-core';
import store from '../store';

export default {
    components:{InputText,Accordion,AccordionTab,Button,Tag,Dropdown},
    setup(){
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
        const getCorsesFromDb=()=>{
            projectFirestore.collection('Courses').onSnapshot(snapshot => {
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

        onMounted(()=>{
            setTimeout(() => {
                user.value = store.getters.getUserProfile
                getCorsesFromDb()
            }, 500);
           
        })

        return {
            isEnrolled,
            handleEnroll,
            handleCancelEnroll,
            weekDay,
            search,
            courses,user,
            filterBySearch,
            filterBySort,
            sorting_options,
            sortedCorses,
            isPending,
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
</style>