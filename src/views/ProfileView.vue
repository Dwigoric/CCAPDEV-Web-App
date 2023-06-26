<script setup>

import { useLoggedInStore } from '../stores/loggedIn';
import { useCachedPostsStore } from '@/stores/cachedPosts'
import NavigationBar from '../components/NavigationBar.vue';
import ThemeSwitch from '../components/ThemeSwitch.vue';
import FeedPost  from '../components/FeedPost.vue';


const login = useLoggedInStore();
//const cachePosts = useCachedPostsStore();
const navbar = NavigationBar;
var {cachedPosts} = useCachedPostsStore();





defineProps({
    user: {
        type: Object, 
        required: true
    },

    image: {
        type: String,
        required: true
    }

})


</script>

<template>
    <navbar/>
    <div class="profile">
        <div class = "prof-bg">
            <img class="bg" src = "https://ik.imagekit.io/ikmedia/backlit.jpg"/>
        </div>
        <div class = "prof-pfp">
            <img class="pfp" :src=login.image :alt="`${[login.username]}'s pfp`"/>
        </div>
        <div class = "username">
            <h2>{{ login.username }}</h2>
        </div>
        <div class="description">
            <h5>User hasn't placed a description of themselves yet.</h5> <!--default description, can be blank if they want-->
        </div>
    </div>

    <input type="button" value="Edit Profile" class="button"/>

    <hr class="solid"/> <!-- supposed to be the divider between profile details (username, pfp, etc.) and posts -->

    


    <div class="post" id="posts">
        <div
            class="feed-element"
            id="left-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            This is the left sidebar.
        </div>
        <FeedPost 
            v-for="posts in cachedPosts.filter(post => post.user.id === login.id)" 
            :key="posts.id"
            :id = "posts.id"
            :title = "posts.title"
            :body = "posts.body"
            :user = "posts.user"
            :image = "posts.image"
            :reactions = "posts.reactions"/>
            <div
            class="feed-element"
            id="right-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            <NewPost v-if="loggedIn.username && cachedPosts.length > 0" :add-post="addPost" />
            <ThemeSwitch />
        </div>    

    </div>

</template>

<style scoped>
    .prof-bg{
        position: absolute;
        top: 48px;
        width: 100%;
        height: 50%
    }

    .bg{
        width: 100vw;
        height: 75%;
        object-fit: cover;
        z-index: 1;
    }

    .prof-pfp{
        position: relative;
        top: 295px;
        left: 5px;
    }

    .pfp{
        border-radius: 50%;
        border: 5px solid;
        border-color: black;
        height: 125px;
        width: 125px;
        background-color: lightyellow;
        z-index: 2;
    }

    .username{
        position: relative;
        top: 195px;
        left: 150px;
        font-size: 25px;
    }

    .description{
        position: relative;
        top: 198px;
        left: 150px;
        font-size: 19px;
    }

    .button{
        position: relative;
        font-family: var(--source-sans);
        font-size: 12px;
        font-weight: 500;
        color: var(--vt-c-black-soft);
        background-color: var(--color-dark-pink);
        border: none;
        border-radius: 20px;
        cursor: pointer;
        top: 355px;
        left: 825px;
        height: 35px;
        width: 100px;
    }

    .button:hover{
        background-color: lightpink;
        color: lightpink;
    }
    

    .solid{
        height: 5px;
        background: #6ad4d9;
        bottom: 200px;
    }
    .post{
        display: flex;
        flex-flow: column nowrap;
        padding: 2rem;
        top: 460px;
        right: 200px;
    }

    #posts {
        flex-flow: column-reverse nowrap;
        flex: 6;
        justify-content: center;
        align-items: center;
        /*background-color: var(--color-background-mute);*/
        gap: 2rem;
    }


    
</style>