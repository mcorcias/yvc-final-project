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
            <div class="support-box">
                <p> לשיחת סיוע עם פסיכולוג לחץ על האייקון של הצ'אט בתחתית הדף</p>
                <img class="bounce-top" src="https://firebasestorage.googleapis.com/v0/b/yvc-final-project-f2305.appspot.com/o/icons%2Fdown-chevron.png?alt=media&token=ea767241-c7f9-4591-b491-d00065a99862">
            </div>
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
    .articles{
        grid-area: articles;
        overflow:hidden;
        overflow-y: auto;
    }
    .articles::-webkit-scrollbar {
        width: 0px;
        background: transparent; /* make scrollbar transparent */
    }
    .support{
        grid-area: support;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .support .support-box{
        text-align: center;
        color: #fff;
        width: 97%;
        height: 80%;
        background-color: lightsteelblue;
        -webkit-box-shadow: 1px 1px 13px -5px #000000; 
        box-shadow: 1px 1px 13px -5px #000000;
    }
    .support-box p{
        font-size: 25px;
    }
    .support-box img{
        margin-top:100px;
    }
    .bounce-top {
	-webkit-animation: bounce-top 5s ease-in infinite forwards;
	        animation: bounce-top 5s ease-in infinite forwards;
    }

    @-webkit-keyframes bounce-top {
    0% {
        -webkit-transform: translateY(-45px);
                transform: translateY(-45px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
        opacity: 1;
    }
    24% {
        opacity: 1;
    }
    40% {
        -webkit-transform: translateY(-24px);
                transform: translateY(-24px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    65% {
        -webkit-transform: translateY(-12px);
                transform: translateY(-12px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    82% {
        -webkit-transform: translateY(-6px);
                transform: translateY(-6px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    93% {
        -webkit-transform: translateY(-4px);
                transform: translateY(-4px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    25%,
    55%,
    75%,
    87% {
        -webkit-transform: translateY(0px);
                transform: translateY(0px);
        -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
    }
    100% {
        -webkit-transform: translateY(0px);
                transform: translateY(0px);
        -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        opacity: 1;
    }
    }
    @keyframes bounce-top {
    0% {
        -webkit-transform: translateY(-45px);
                transform: translateY(-45px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
        opacity: 1;
    }
    24% {
        opacity: 1;
    }
    40% {
        -webkit-transform: translateY(-24px);
                transform: translateY(-24px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    65% {
        -webkit-transform: translateY(-12px);
                transform: translateY(-12px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    82% {
        -webkit-transform: translateY(-6px);
                transform: translateY(-6px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    93% {
        -webkit-transform: translateY(-4px);
                transform: translateY(-4px);
        -webkit-animation-timing-function: ease-in;
                animation-timing-function: ease-in;
    }
    25%,
    55%,
    75%,
    87% {
        -webkit-transform: translateY(0px);
                transform: translateY(0px);
        -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
    }
    100% {
        -webkit-transform: translateY(0px);
                transform: translateY(0px);
        -webkit-animation-timing-function: ease-out;
                animation-timing-function: ease-out;
        opacity: 1;
    }
    }

    @media screen and (max-width: 600px) {
        .home-page{
            grid-template-areas:
            'informations informations informations informations'
            'informations informations informations informations'
            'articles articles articles articles'
            'articles articles articles articles';
            grid-auto-rows: 30%;
        }
        .support{
            display: none;
        }
        
    }
  
</style>