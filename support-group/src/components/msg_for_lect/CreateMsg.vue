<template>
    
  <div class="create_msg_container">
      <div class="header">
        <h3>רשימת הקורסים שלך</h3>
      </div>
      <div class="courses">
        <template v-for="course in courses" :key="course">
            <div class="course">{{course.course_name}}</div>
        </template>
      </div>
      
  </div>
</template>

<script>
import {projectFirestore} from '../../firebase/config'
import store from '../../store'
import { onMounted, ref } from '@vue/runtime-core'

export default {
    setup(){
        const userId = ref(null)
        const courses = ref([])
        onMounted(()=>{
            setTimeout(async() => {
                userId.value = store.getters.getUserProfile.id
                console.log(userId.value);
                await get_your_courses()
            }, 500);
        })

        const get_your_courses = async()=>{
            const docs = await projectFirestore.collection('Courses').where('teacher_id','==',userId.value).get()
            courses.value = docs.docs.map(doc=>doc.data())
            console.log(courses.value);
        }

      
        return{courses}
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
        grid-template-columns:repeat(auto-fill,minmax(250px, 1fr));
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
</style>