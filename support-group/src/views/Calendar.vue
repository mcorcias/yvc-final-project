<template>
    <div class="calendar-container">
        <div class="calendar">
            <FullCalendar :options="calendarOptions"/>
        </div>
    </div>
</template>

<script>
import '@fullcalendar/core/vdom' 
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import InteractionPlugin  from '@fullcalendar/interaction'
import illLocale from '@fullcalendar/core/locales/he';
import TimeGridPlugin from '@fullcalendar/timegrid'
import ListPlugin from '@fullcalendar/list'
import {projectFirestore} from '../firebase/config'
import store from '../store'
export default {
    components:{FullCalendar},
    data(){
        return{
             user:[],
             calendarOptions: {
                plugins: [ dayGridPlugin, InteractionPlugin ,TimeGridPlugin,ListPlugin ],
                initialView: 'dayGridMonth',
                dateClick: this.handleDateClick,
                locales: [illLocale],
                events: [],
                headerToolbar: {
                    left: 'prev,today,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                height:600,
                allDaySlot: false,
                hiddenDays: [],
                businessHours: [],
                slotMinTime: "07:00",
                slotMaxTime: "20:00",
                eventClick: this.handleEventClick,
                slotDuration:"00:30"
            },
        }
    },
    methods:{
        convert_to_date_string(date_iso_format){
            const date = date_iso_format.split('T')[0]
            const time = date_iso_format.split('T')[1].split(':')
            const hour = time[0]+":"+time[1]
            return date+"T"+hour
        },
        async scan_courses_by_user(){
            const docs = await projectFirestore.collection('Courses')
            .where('enrolled_id','array-contains',this.user.id).get()
            docs.docs.map(doc=>doc.data()).forEach((doc)=>{
                console.log(doc);
                const start_date = this.convert_to_date_string(this.local_date_time(doc.start_date.seconds)) 
                const end_date = this.convert_to_date_string(this.local_date_time(doc.end_date.seconds)) 
                const days = doc.days
                const course_name = doc.course_name
                this.calendarOptions.events.push(...this.range(start_date,end_date,days,course_name)) 
            })
        },
        async scan_courses_by_teacher(){
            const docs = await projectFirestore.collection('Courses')
            .where('teacher_id','==',this.user.id).get()
            docs.docs.map(doc=>doc.data()).forEach((doc)=>{
                console.log(doc);
                const start_date = this.convert_to_date_string(this.local_date_time(doc.start_date.seconds)) 
                const end_date = this.convert_to_date_string(this.local_date_time(doc.end_date.seconds)) 
                const days = doc.days
                const course_name = doc.course_name
                this.calendarOptions.events.push(...this.range(start_date,end_date,days,course_name)) 
            })
        },
        range(start,end,days,course_name){
        const start_date = start.split('T')[0]
        const start_time=start.split('T')[1]
        const end_time=end.split('T')[1]
        const arr=[]
        if(days.includes(new Date(start).getDay())){
            arr.push({
                start,
                end:start.split('T')[0]+'T'+end_time,
                title:course_name
            })
        }
        let _start=start_date
        while(this.nextDay(_start).toLocaleDateString('he')!==this.nextDay(end).toLocaleDateString('he')){
            _start = this.nextDay(_start)
            if(days.includes(_start.getDay())){
                arr.push({
                start:_start.toISOString().split('T')[0]+'T'+start_time,
                end:_start.toISOString().split('T')[0]+'T'+end_time,
                title:course_name
                })
            }
        }
        return arr
        },
        nextDay(dateStr){
            var today = new Date(dateStr);
            var nextDay = new Date(today);
            nextDay.setDate(today.getDate()+1);
            return nextDay;
        },
        local_date_time(seconds){
            var tzoffset = (new Date(seconds * 1000)).getTimezoneOffset() * 60000;
            var localISOTime = (new Date((seconds * 1000) - tzoffset)).toISOString().slice(0, -1);
            return localISOTime
        }
    },
    mounted(){
        setTimeout(async() => {
            
            this.user = store.getters.getUserProfile
            if(this.user.role=='user'){
                await this.scan_courses_by_user()
            }
            if(this.user.role=='teacher'){
                await this.scan_courses_by_teacher()
            }
            console.log('events:',this.calendarOptions.events); 
        }, 500);
    }

}
</script>

<style scoped>
    .calendar-container{
        width: 100%;
        height: calc(100vh - 3rem);
        display: flex;
        flex-direction: column;
        align-items: center;
 
    }
    .calendar{
        margin-top: 25px;
        width: 50%;
    }
</style>