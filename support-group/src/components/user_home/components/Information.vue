<template>
  <div class="information">
      <p class="lead header">{{title}}</p>
      <p>
            {{shortText}}
           <span v-if="!read_more" class="short">...</span>
           <span v-if="read_more" class="long">
            {{longText}}
         </span>
      </p>
      
      
      
      <small  id="myBtn" @click="read_more=!read_more">{{btn_name}}</small>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
export default {
    props:['title','shortText','longText'],
    setup() {
        const read_more = ref(false)
        const btnText =ref('קרא יותר')
        const btn_name = ref(computed(()=>{
            if(!read_more.value) return 'קרא יותר >>'
            return 'קרא פחות <<'
        }))

        return{read_more,btnText,btn_name}
    }
}
</script>

<style scoped>
    .information{
        padding: 5px;
        border-radius: 5px;
        width: 100%;
        background-color: lightsteelblue;
        margin-bottom:5px ;
    }
    #more {display: none;}
    small{
        font-weight: bold;
        font-size: 15px;
        cursor: pointer;
    }
    p{
        font-size: 15px;
    }
    .lead{
        font-weight: bold;
        color: mediumorchid;
    }
    span{
        display: inline;
    }
</style>