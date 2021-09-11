<template>
    <div class="calendar-container">
        <div class="calendar">
            <FullCalendar :options="calendarOptions"/>
        </div>
        <Dialog header="פרטי האירוע" v-model:visible="show_event_detail" >
            <div class="event-details">
                <div class="field">
                    <h4>שם הקורס:</h4>
                    <p>{{selected_event.title}}</p>
                </div>
                <div class="field">
                    <h4>שעת התחלה:</h4>
                    <p>{{new Date(selected_event.start).toLocaleTimeString('he').split(':')[0]}}:{{new Date(selected_event.start).toLocaleTimeString('he').split(':')[1]}}</p>
                </div>
                <div class="field">
                    <h4>שעת סיום:</h4>
                    <p>{{new Date(selected_event.end).toLocaleTimeString('he').split(':')[0]}}:{{new Date(selected_event.end).toLocaleTimeString('he').split(':')[1]}}</p>
                </div>
                <div class="field">
                    <h4>שם המרצה:</h4>
                    <p>{{selected_event.groupId}}</p>
                </div>
            </div>
        </Dialog>
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
import Dialog from 'primevue/dialog';
import {projectFirestore} from '../firebase/config'
import store from '../store'
export default {
    components:{FullCalendar,Dialog},
    data(){
        return{
             selected_event:{},
             show_event_detail:false,
             user:[],
             calendarOptions: {
                plugins: [ dayGridPlugin, InteractionPlugin ,TimeGridPlugin,ListPlugin ],
                initialView: 'dayGridMonth',
                dateClick: this.handleDateClick,
                locales: [illLocale],
                events: [],
                eventClick: this.handleEventClick,
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
                const teacher_name = doc.teache_name
                this.calendarOptions.events.push(...this.range(start_date,end_date,days,course_name,teacher_name)) 
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
        range(start,end,days,course_name,teacher_name){
        const start_date = start.split('T')[0]
        const start_time=start.split('T')[1]
        const end_time=end.split('T')[1]
        const arr=[]
        if(days.includes(new Date(start).getDay())){
            arr.push({
                start,
                end:start.split('T')[0]+'T'+end_time,
                title:course_name,
                groupId:teacher_name
            })
        }
        let _start=start_date
        while(this.nextDay(_start).toLocaleDateString('he')!==this.nextDay(end).toLocaleDateString('he')){
            _start = this.nextDay(_start)
            if(days.includes(_start.getDay())){
                arr.push({
                    start:_start.toISOString().split('T')[0]+'T'+start_time,
                    end:_start.toISOString().split('T')[0]+'T'+end_time,
                    title:course_name,
                    groupId:teacher_name
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
        },
        handleEventClick(e){
            this.selected_event = e.event
            this.show_event_detail = !this.show_event_detail
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
    ::v-deep(.fc .fc-view-harness .fc-event){
        cursor: pointer;
    }
    .calendar-container{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .calendar{
        margin-top: 25px;
        width: 50%;
    }
    .event-details{
        width: 300px;
        height: 200px;

    }
    .event-details .field{
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;
        margin-bottom:15px;
    }
    .event-details .field h4{
        margin-left: 5px;
    }

    @media screen and (max-width: 600px) {
         .calendar{
            padding: 5px;
            width: 100%;
            height: 100%;
            font-size: .7rem;
        }    
    }
</style>