<template>
    <div class="home-page">
        <div class="informations">
            <Information title="סיוע לנשים" shortText="בלה בלה בלה" longText="בלההההההההה בלהההההההההההה בלההההההההההה" />
            <Information title="סיוע לנשים" shortText="בלה בלה בלה" longText="בלההההההההה בלהההההההההההה בלההההההההההה" />
            <Information title="סיוע לזונה" shortText="בלה בלה בלה" longText="בלההההההההה בלהההההההההההה בלההההההההההה" />
            <Information title="סיוע לזונה" shortText="בלה בלה בלה" longText="בלההההההההה בלהההההההההההה בלההההההההההה" />
            <Information title="סיוע לזונה" shortText="בלה בלה בלה" longText="בלההההההההה בלהההההההההההה בלההההההההההה" />
            <Information title="סיוע לזונה" shortText="בלה בלה בלה" longText="בלההההההההה בלהההההההההההה בלההההההההההה" />
            <Information title="סיוע לזונה" shortText="בלה בלה בלה" longText="בלההההההההה בלהההההההההההה בלההההההההההה" />
            
        </div>
        <div class="articles">
            <Articles />
        </div>
        <div class="support">
            
        </div>
    </div>
</template>

<script>
import Information from '../user_home/components/Information.vue'
import Articles from '../user_home/components/Articles.vue'
export default {
    components:{Information,Articles}

}
</script>

<style scoped>
    .home-page{
        padding: 25px;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-areas:
        'informations informations informations support'
        'articles articles articles support';
        grid-auto-columns: 25%;
        grid-auto-rows: 50%;
        grid-gap: 5px;
        }
 
    .informations{
        grid-area: informations;
        overflow:hidden;
        overflow-y: auto;
    }
    .informations::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* make scrollbar transparent */
    }
    .support{
        grid-area: support;
        background-color: lime;
    }
    .articles{
        grid-area: articles;
        overflow:hidden;
        overflow-y: auto;
    }
    .articles::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* make scrollbar transparent */
    }
  
</style>