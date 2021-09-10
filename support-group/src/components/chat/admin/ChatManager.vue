<template>
    <div class="chat-manage-container">
         <div class="chat-room" v-if="inChat">
            <div class="top-bar" @click="inChat = !inChat">
            <i class="pi pi-times"></i>
            </div>
            <div class="chat" v-if="chatRoomData">
            <div class="chat-header">
                <p>קוד שיחה: {{chatRoomData.uid}}</p>
            </div>
            <div class="chat-list">
                <template v-for="(msg, i) in chatRoomData.chats" :key="i">
                <div class="chat-line-service" v-if="msg.role == 'service'">
                    <p style="margin-left:10px; font-size:0.7rem;">{{msg.time}}</p>
                    <p style="font-weight:bold; margin-left:10px;">{{msg.said}}</p>
                    <p>{{msg.msg}}</p>
                </div>
                <div class="chat-line-client" v-if="msg.role == 'client'">
                    <p style="margin-left:10px; font-size:0.7rem;">{{msg.time}}</p>
                    <p style="font-weight:bold; margin-left:10px;">{{msg.said}}</p>
                    <p>{{msg.msg}}</p>
                </div>
                </template>
            </div>
            <div class="chat-input">
                <InputText type="text" v-model="chatMsg" style="width:90%; height:100%;" />
                <Button label="שלח" style="width:10%; height:100%;" @click="sendChatmsg"/>
            </div>
            </div>
        </div>
        <div class="pending-chats">
            <div class="title"><p>צ'טים בהמתנה לנציג שירות</p></div>
            <div class="pending-chats-list">
            <div class="empty" v-if="pending_chats.length == 0">
                <p>לא קיימות שיחות חדשות</p>
            </div>
            <template v-if="pending_chats.length > 0">
                <template v-for="request in pending_chats" :key="request.docId">
                <div class="request-line">
                    <div class="start-chat">
                    <Button icon="pi pi-comments" class="p-button-rounded p-button-info" style="margin-left: 10px;" @click="openChatRoom(request)"/>
                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger" style="margin-left: 10px;" @click="cancelChat(request)" v-if="!request.status.includes('canceled')"/>
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deleteChat(request)" v-if="request.status.includes('canceled')"/>
                    </div>
                    <p>{{request.date}}</p>
                    <p>{{request.userPending}}</p>
                    <p>{{request.lang}}</p>
                    <p>{{request.docId}}</p>
                    <p>{{request.status}}</p>
                </div>
                </template>
            </template>
            </div>
        </div>
    </div>
 
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import {projectFirestore, FireStore} from '../../../firebase/config'
import store from '../../../store';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
export default {
  components:{InputText,Button},
  setup(){
    
    const user = ref(computed(() => {
        return store.getters.getUserProfile
    }))
    const inChat = ref(false);
    const pending_chats  =ref([]);
    const chatRoomData = ref(null);
    const chatMsg = ref('');
    const listenToPendingRequests = () => {
      projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(eachChange => {
          let type = eachChange.type
          let doc = eachChange.doc
          let docId = doc.id
          let data = doc.data()
          if(type == 'added'){
            console.log('Request Was Added!');
            pending_chats.value.push(data);
          }
          if(type == 'removed'){
            console.log('Request Was Removed!');
            const removedIndex = pending_chats.value.findIndex(request => request.docId == docId);
            pending_chats.value.splice(removedIndex, 1);
          }
          if(type == 'modified'){
            console.log('Request Was Changed!');
            const changedIndex = pending_chats.value.findIndex(request => request.docId == docId);
            pending_chats.value[changedIndex] = data;
          }
          sortPendingRequests();
        })
      })
    }
    const sortPendingRequests = () => {
      pending_chats.value = pending_chats.value.sort((chatA, chatB) => {
        if(chatA.date > chatB.date){return -1}
        if(chatA.date < chatB.date){return 1}
      })
    }
    const cancelChat = (request) => {
      console.log(request);
      projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').doc(request.docId).set({
        status: 'canceled - by service',
        dateCanceled: new Date().toLocaleString('he')
        }, {merge:true})
    }
    const deleteChat = (request) => {
      projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').doc(request.docId).delete();
      projectFirestore.collection('Chat').doc('ChatRooms').collection('OpenRooms').doc(request.docId + 'chatRoom').delete();
    }
    const listenToChatMsgs = (chatRoomUid) =>{
      projectFirestore.collection('Chat').doc('ChatRooms').collection('OpenRooms').doc(chatRoomUid).onSnapshot(snapshot => {
        console.log(snapshot.data());
        if(snapshot.data()){
          chatRoomData.value = snapshot.data();
          chatRoomData.value.uid = snapshot.id;
        }
      })
    }
    const openChatRoom = (request) => {
      projectFirestore.collection('Chat').doc('ChatRooms').collection('OpenRooms').doc(request.docId + 'chatRoom').get().then((doc) => {
        if(!doc.exists){
          projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').doc(request.docId).set({
            chatRoom: request.docId + 'chatRoom',
            status: 'in chat'
          }, {merge:true})
          .then(() => {
            projectFirestore.collection('Chat').doc('ChatRooms').collection('OpenRooms').doc(request.docId + 'chatRoom').set({
              agent: user.value.fullName,
              userPending: request.userPending,
              chats:[{said: 'מערכת', msg: "הנך מחובר לנציג שירות"}]
            })
          }).then(() => {
            inChat.value = true;
            listenToChatMsgs(request.docId + 'chatRoom')
          })
        }else{
          inChat.value = true;
          listenToChatMsgs(request.docId + 'chatRoom')
        }
      })
    }
    const sendChatmsg = () =>{
      projectFirestore.collection('Chat').doc('ChatRooms').collection('OpenRooms').doc(chatRoomData.value.uid).update({
          chats: FireStore.FieldValue.arrayUnion({
          said: user.value.fullName,
          msg: chatMsg.value,
          role: 'service',
          time: new Date().toLocaleTimeString('he')
        })
      }).then(() => {
        chatMsg.value = '';
      })
    }
    onMounted(() => {
      listenToPendingRequests();
    })
    return{
      pending_chats, deleteChat,openChatRoom, cancelChat, inChat, chatRoomData,
      chatMsg, sendChatmsg
    }
  }
}
</script>

<style scoped>
.chat-manage-container{
    width: 100%;
    height: 100%;
}
.pending-chats{
  padding: 10px;
  width:100%;
  height: 100%;


  overflow: hidden;
}
.pending-chats .title{
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
}
.pending-chats .empty{
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.pending-chats-list{
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 2rem;
  padding-top: 0;
}
.request-line{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 3px;
  margin-top: 1rem;
}
.chat-room{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80vw;
  height: 70vh;
  transform: translate(-50%, -50%);
  background-color: white;
  z-index: 10000;
  border-radius: 10px;
}
.top-bar{
  position: absolute;
  width: 30px;
  height: 30px;
  left: 5px;
  top: 5px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.chat{
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.171);
}
.chat-line-service{
  width: 100%;
  padding: 5px;
  background-color: rgb(223, 221, 221);
  display: flex;
  margin-bottom: 10px;
}
.chat-line-client{
  width: 100%;
  padding: 5px;
  background-color: rgba(97, 231, 255, 0.712);
  display: flex;
  margin-bottom: 10px;
  flex-wrap: wrap;
  overflow: hidden;
}
.chat-list{
  position: relative;
  margin-top: 1rem;
  padding: 10px;
  width: 100%;
  height: 80%;
  overflow-y: auto;
}
.chat-input{
  position: relative;
  width: 100%;
  height: 15%;
  display: flex;
}
.chat-header{
  width: 100%;
  padding: 5px;
}
</style>