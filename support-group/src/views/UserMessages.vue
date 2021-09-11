<template>
  <div class="user-messages">
      
    <h1 v-if="messages.length==0">אין הודעות חדשות</h1>
    <img v-if="messages.length==0" src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fsearch.png?alt=media&token=62965cfa-95e6-4049-865c-c968bba73d5d" alt="">
    <Accordion style="width:70%" class="accordion-custom">
        <template v-for="message in messages" :key="message.title">
            <AccordionTab >
                <template #header >
                    <div @click="handleWhenPersonalMsgTabOpen(message)">
                        <i class="pi pi-envelope"></i>
                        <span>{{message.title}}</span>
                        <Tag v-if="message.seenBy" value="נקרא" severity="danger"></Tag>
                        <Tag v-else value="חדש" severity="success"></Tag>
                    </div>
                    
                </template>
                <div class="date_and_delete">
                    <small>נשלחה בתאריך: {{new Date(message.date.seconds * 1000).toLocaleDateString('he')}}</small>
                    <a href="#" style="color:red;" @click="handleDeletePersonalMessage(message)">מחק</a>
                </div>
                <p>{{message.content}}</p>
            </AccordionTab>
        </template>
    </Accordion>
    
  </div>
</template>

<script>
import {projectAuth,projectFirestore} from '../firebase/config'
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Tag from 'primevue/tag';
import { onMounted, ref } from '@vue/runtime-core';
export default {
    components:{Accordion,AccordionTab,Tag},
    setup() {
        
        const messages = ref([])

        const handleWhenPersonalMsgTabOpen=async(message)=>{
            if(message.seenBy==false){
                message.seenBy=true
               await projectFirestore.collection('UserMessages').doc('users').collection(projectAuth.currentUser.uid)
               .doc(message.id).update({
                    seenBy:message.seenBy
                })
                const index = messages.value.findIndex(msg=>msg.id==message.id)
                if(index!=-1){
                    messages.value[index].seenBy =true
                }
            }
        }

        const handleDeletePersonalMessage=async(message)=>{
            console.log(message);
            await projectFirestore.collection('UserMessages').doc('users').collection(projectAuth.currentUser.uid)
               .doc(message.id).update({
                    ignored:true
                })
            const index = messages.value.findIndex(msg=>msg.id==message.id)
                if(index!=-1){
                    messages.value.splice(index,1)
                }
        }

       
        const get_msgs_from_db=async()=>{
             const docs = await projectFirestore.collection('UserMessages').doc('users')
            .collection(projectAuth.currentUser.uid).get()
            messages.value = docs.docs.map(doc=>doc.data())

        }

        onMounted(async ()=>{
            await get_msgs_from_db()
        })

        

        return{messages,handleDeletePersonalMessage,handleWhenPersonalMsgTabOpen}
    }

}
</script>

<style scoped>
    .user-messages{
        font-size: 2rem;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
   .accordion-custom i,.accordion-custom span{
      vertical-align: middle;
   }
   .accordion-custom span{
       margin: 0 .5rem;
   }
   .accordion-custom p {
        line-height: 2.5;
        margin: 0;
        white-space: pre-wrap;
    }
    .date_and_delete{
        width: 30%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    @media screen and (max-width: 600px) {
       .user-messages{
           text-align: center;
       }
       .user-messages img{
           width: 150px;
           height: 150px;
       }
    }
</style>