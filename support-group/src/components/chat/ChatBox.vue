<template>
  <div class="before-click"   @click="openChat" id="chat-bubble">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Circle-icons-chat.svg/1200px-Circle-icons-chat.svg.png" alt="">
  </div>
  <div class="expanded"   id="chat-window">
      <div class="close-chat" @click="closeChat">
          <i class="pi pi-times"></i>
      </div>
      <div class="loading-chat" v-if="initchat">
          <img src="https://i2.wp.com/codemyui.com/wp-content/uploads/2015/06/imessage-typing-indicator-in-css.gif?fit=880%2C440&ssl=1" alt="">
          <p>טוען צ'אט</p>
          <p style="font-size: 1rem;">אנא המתן בבקשה</p>
      </div>
      <div class="welcome-to-chat-user flip-in-hor-bottom" v-if="userAuth && !selectedLang">
          <p style="font-size:1.5rem;">ברוך הבא {{user.fullName}}</p>
          <p>בחר שפה להמשך</p>
          <div class="lang-box">
              <img src="https://cdn.countryflags.com/thumbs/israel/flag-button-square-250.png" alt="" @click="selectLang('he')">
              <img src="https://cdn.countryflags.com/thumbs/russia/flag-button-square-250.png" alt="" @click="selectLang('ru')">
              <img src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-button-square-250.png" alt="">
          </div>
      </div>
      <div class="searching-for-agent flip-in-hor-bottom" v-if="selectedLang && !inChat">
          <img src="https://blogs.akamai.com/se/2019/08/22/Customer_service_Icon.gif" alt="">
          <p v-if="selectedLang == 'he'">מחפש נציג שירות</p>
          <p v-if="selectedLang == 'he'" style="font-size: 1rem;">אנא המתן בבקשה</p>
          <p v-if="selectedLang == 'ru'">Ищем сервисного представителя</p>
          <p v-if="selectedLang == 'ru'" style="font-size: 1rem;">Подождите пожалуйста</p>

          <p v-if="selectedLang == 'he'" style="font-size:0.8rem; margin-top:1rem;" id="chat-request-turn">מיקומך בתור: </p>
          <p v-if="selectedLang == 'ru'" style="font-size:0.8rem; margin-top:1rem;" id="chat-request-turn">Ваша позиция в очереди: </p>

          <p v-if="selectedLang == 'he'" style="font-size:0.8rem; margin-top:1rem;" id="chat-request-code">קוד: </p>
          <p v-if="selectedLang == 'ru'" style="font-size:0.8rem; margin-top:1rem;" id="chat-request-code">Код: </p>

          <Button label="בטל" class="p-button-rounded p-button-danger" style="margin-top: 1rem; width:50%;" @click="closeChatUser"/>
      </div>
      <div class="chat-list" v-if="inChat">
        <div class="chat-header">
              <p>שיחה עם נציג שירות</p>
        </div>
        <div class="chat-msgs">
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
            <InputText type="text" v-model="chatMsg" style="width:70%; height:100%;" />
            <Button label="שלח" style="width:30%; height:100%;" @click="sendChatmsg"/>
        </div>
      </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import store from '../../store';
import {projectFirestore, FireStore} from '../../firebase/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
export default {
components:{InputText,Button},
setup(){
    const initchat = ref(true)
    const userAuth = ref(false)
    const selectedLang = ref(null);
    const chatRef = ref(null);
    const inChat = ref(false);
    const chatRoomData = ref([]);
    const chatMsg = ref('');
    const user = ref(computed(() => {
        return store.getters.getUserProfile
    }))
    const openChat = () =>{
        console.log('Start Chatting :)');
        const chatBubble = document.getElementById('chat-bubble');
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.add('flip-in-hor-bottom')
        chatWindow.classList.remove('flip-out-hor-top')
        chatBubble.style.display = 'none';
        chatWindow.style.display = 'flex';
        loadchat();
    }
    const closeChat = () =>{
        console.log('Stopped Chatting :(');
        const chatBubble = document.getElementById('chat-bubble');
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('flip-in-hor-bottom')
        chatWindow.classList.add('flip-out-hor-top')
        chatBubble.style.display = 'flex';
        setTimeout(() => {
            if(inChat.value){
                closeChatUser();
            }
            chatWindow.style.display = 'none';
            initchat.value = true;
            userAuth.value = false;
            selectedLang.value = null;
            chatRef.value = null;
            inChat.value = false;
        }, 500); 
    }
    const closeChatUser = () =>{
        if(chatRef){
            projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').doc(chatRef.value).set({
               status: 'canceled - by user',
               dateCanceled: new Date().toLocaleString('he')
            }, {merge:true})
        }
    }
    const loadchat = () => {
        if(user){
            setTimeout(() => {
                initchat.value = false;
                userAuth.value = true;
            }, 2000);
        }
        else{
            setTimeout(() => {
                initchat.value = false;
                userAuth.value = false;
            }, 2000);
        }
    }
    const selectLang = (lang) => {
        selectedLang.value = lang;
        console.log('Selected: Hebrew');
        searchForAgent();
    }
    const searchForAgent = () =>{
        const ref = projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').doc()
        ref.set({
            userPending: user.value.fullName,
            date: new Date().toLocaleString('he'),
            status: 'pending',
            lang: selectedLang.value,
            docId: ref.id
        }).then(() => {
            document.getElementById('chat-request-code').innerText += ref.id
            projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').get().then((docs) => {
                document.getElementById('chat-request-turn').innerText += docs.size
                chatRef.value = ref.id;
                waitForAgentResponse();
            })
        })
    }
    const waitForAgentResponse = () => {
        projectFirestore.collection('Chat').doc('Pending').collection('PendingRequests').doc(chatRef.value).onSnapshot(snapshot => {
            if(snapshot.data()){
                if(snapshot.data().chatRoom){
                    console.log('ChatRoom Opened!');
                    setTimeout(() => {
                        inChat.value = true;
                        listenToChatMsgs();
                    }, 1500);
                }
                if(snapshot.data().status.includes('canceled')){
                    closeChat();
                }
            }
            else{
                closeChat();
            }
        }) 
    }
    const listenToChatMsgs = () =>{
      projectFirestore.collection('Chat').doc('ChatRooms').collection('OpenRooms').doc(chatRef.value + 'chatRoom').onSnapshot(snapshot => {
        console.log(snapshot.data());
        if(snapshot.data()){
          chatRoomData.value = snapshot.data();
          chatRoomData.value.uid = snapshot.id;
        }
      })
    }
    const sendChatmsg = () =>{
      projectFirestore.collection('Chat').doc('ChatRooms').collection('OpenRooms').doc(chatRoomData.value.uid).update({
        chats: FireStore.FieldValue.arrayUnion({
          said: user.value.fullName,
          msg: chatMsg.value,
          role: 'client',
          time: new Date().toLocaleTimeString('he')
        })
      }).then(() => {
        chatMsg.value = '';
      })
    }
    return{
        openChat,
        closeChat,
        initchat,
        userAuth,
        user,
        selectLang,
        selectedLang,
        inChat,
        closeChatUser, chatRoomData, chatMsg, sendChatmsg
    }
}
}
</script>

<style scoped>
.before-click{
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: pink;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 10000;
    box-shadow: 0 0 0 3px #f5f5f5b4;
    transition: left 2s
}
.before-click.when-shop-cart-open{
   left: 25rem;
}
.before-click img{
    width: 100%;
    height: auto;
    cursor: pointer;
}
.expanded{
    position: absolute;
    left: 2rem;
    bottom: 2rem;
    border-radius: 10px;
    display: none;
    width: 25vw;
    height: 60vh;
    background-color: white;
    z-index: 1000;
    padding: 5px;
    box-shadow: 0 0 5px 1px #66646449;
    overflow: hidden;
}
.close-chat{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 2;
    cursor: pointer;
}
.loading-chat{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: black;
    flex-direction: column;
}
.loading-chat img{
    width: 100%;
    height: auto;
}
.welcome-to-chat-user{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.lang-box{
    margin-top: 4rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
}
.lang-box img{
    margin-top: 1rem;
    width: 40%;
    height: auto;
    cursor: pointer;
}
.searching-for-agent{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: black;
    flex-direction: column;
    text-align: center;
}
.searching-for-agent img{
    width: 100%;
    height: auto;
}
.chat-list{
    position: relative;
    width: 100%;
    height: 100%;
}
.chat-msgs{
    position: relative;
    width: 100%;
    height: 80%;
    overflow-y: auto;
    padding: 3px;
}
.chat-header{
    width: 100%;
    text-align: center;
}
.chat-line-service{
  width: 100%;
  padding: 5px;
  background-color: rgb(223, 221, 221);
  display: flex;
  margin-bottom: 10px;
  flex-wrap: wrap;
  overflow: hidden;
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
.chat-input{
  position: relative;
  width: 100%;
  height: 15%;
  display: flex;
}
.flip-in-hor-bottom {
	-webkit-animation: flip-in-hor-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: flip-in-hor-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
.flip-out-hor-top {
	-webkit-animation: flip-out-hor-top 0.45s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	        animation: flip-out-hor-top 0.45s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
@-webkit-keyframes flip-in-hor-bottom {
  0% {
    -webkit-transform: rotateX(80deg);
            transform: rotateX(80deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotateX(0);
            transform: rotateX(0);
    opacity: 1;
  }
}
@keyframes flip-in-hor-bottom {
  0% {
    -webkit-transform: rotateX(80deg);
            transform: rotateX(80deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: rotateX(0);
            transform: rotateX(0);
    opacity: 1;
  }
}
@-webkit-keyframes flip-out-hor-top {
  0% {
    -webkit-transform: rotateX(0);
            transform: rotateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotateX(70deg);
            transform: rotateX(70deg);
    opacity: 0;
  }
}
@keyframes flip-out-hor-top {
  0% {
    -webkit-transform: rotateX(0);
            transform: rotateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotateX(70deg);
            transform: rotateX(70deg);
    opacity: 0;
  }
}
</style>