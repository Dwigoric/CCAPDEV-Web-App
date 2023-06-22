<script setup>
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'
import { Waypoint } from 'vue-waypoint'

document.title = 'Compact Donuts | Feed'

const API_URL = 'https://dummyjson.com'

const loadedAllPosts = ref(false)
let skip = 130
const limit = 20

const posts = ref([])

const getPosts = async (waypointState) => {
    if (loadedAllPosts.value || waypointState.going !== 'IN') {
        return
    }

    const userParams = new URLSearchParams()
    userParams.set('limit', '0')
    userParams.set('select', 'id,username,image')

    const { users } = await fetch(`${API_URL}/users?${userParams}`)
        .then((res) => res.json())
        .catch(console.error)

    const postParams = new URLSearchParams()
    postParams.set('skip', String(skip))
    postParams.set('limit', String(limit))

    skip -= limit

    posts.value = [
        ...(await fetch(`${API_URL}/posts?${postParams}`)
            .then((res) => res.json())
            .then((res) =>
                res['posts'].map((post) => {
                    const user = users.find((user) => user.id === post['userId'])
                    return {
                        ...post,
                        user
                    }
                })
            )
            .catch(console.error)),
        ...posts.value
    ]

    if (posts.value.length >= 150) {
        loadedAllPosts.value = true
    }
}
</script>

<template>
    <NavigationBar />
    <div id="feed">
        <div
            class="feed-element"
            id="left-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            This is the left sidebar.
        </div>
        <div class="feed-element" id="posts">
            <Waypoint @change="getPosts" v-if="!loadedAllPosts">
                <LoaderHeart />
            </Waypoint>
            <span v-else> You're all caught up! </span>
            <FeedPost
                v-for="post in posts"
                :key="post.id"
                :title="post.title"
                :body="post.body"
                :user="post.user"
                image="https://placekitten.com/500"
            />
            <div class="flexboxColumn" id="PostLayout">
                <div class="flexboxRow">
                    <span class="profilePic" id="adachiPfp"></span>
                    <span class="originalPoster"> Adachi </span>
                    <span class="originalPoster"> @Cabbage_Man </span>
                </div>
                <div class="postContent" id="adachiPost"></div>
            </div>
        </div>
        <div
            class="feed-element"
            id="right-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            This is the right sidebar.
            <ThemeSwitch />
        </div>
    </div>
</template>

<style scoped>
#feed {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    align-self: baseline;
    min-height: calc(100vh - var(--navbar-height));
    margin-top: var(--navbar-height);
}

.feed-element {
    display: flex;
    flex-grow: 1;
    padding: 40px;
}

#left-sidebar,
#right-sidebar {
    background-color: var(--color-background);
    position: sticky;
    height: calc(100vh - var(--navbar-height));
    align-self: flex-start;
    top: var(--navbar-height);
    bottom: 0;
}

#left-sidebar {
    flex-flow: row nowrap;
    justify-content: right;
    flex: 2 0;
}

#posts {
    flex-flow: column-reverse nowrap;
    flex: 6;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-background-mute);
    gap: 2rem;
}

#right-sidebar {
    flex-flow: row nowrap;
    justify-content: left;
    flex: 3 0;
}
/* Flex Box for the class*/
.flexboxColumn {
    display: flex;
    flex-direction: column;
    background-color: var(--color-pale-blue);
}

.flexboxRow {
    display: flex;
    flex-direction: row;
    margin-bottom: 1em;
    
}

/* CSS FOR THE POST */
.postContent {
    background-color: brown;
    background-size: 100%;
    background-repeat: no-repeat;
    border-radius: 2%;
}
/* ID for the anime man post image */
#adachiPost {
    background-image: url('../assets/adachi_true.jpg');
    height: 383px;
    width: 414px;
}
/* Profile CSS */
.profilePic {
    margin-left: 1em;
    margin-right: 1em;
    width: 50px;
    height: 50px;
    background-size: 100%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-dark-green);
    border-radius: 50%;
}

#adachiPfp {
    background-image: url('../assets/adachi_pfp.png');
}

.originalPoster {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 1em;
}
/*Post Layout*/
#PostLayout {
    border: 2px solid;
    border-radius: 25px;
    padding: 1em 1em 1em 1em;
}
</style>
