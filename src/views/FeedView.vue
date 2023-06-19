<script setup>
import { onMounted, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'

document.title = 'Compact Donuts | Feed'

const API_URL = 'https://dummyjson.com'

let posts = ref([])

const getPosts = async () => {
    const params = new URLSearchParams()
    params.set('limit', '0')
    params.set('select', 'id,username,image')

    const { users } = await fetch(`${API_URL}/users?${params}`)
        .then((res) => res.json())
        .catch(console.error)

    posts.value = await fetch(`${API_URL}/posts`)
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
        .catch(console.error)
}

onMounted(getPosts)
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
            <FeedPost v-for="post in posts" :key="post.id" :body="post.body" :user="post.user" />
            <div class="flexboxColumn" id="PostLayout">
                <div class="flexboxRow">
                    <span class="profilePic" id="adachiPfp"></span>
                    <span class="originalPoster"> Adachi &nbsp; </span>
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
}

#left-sidebar {
    flex-flow: row nowrap;
    justify-content: right;
    flex: 2 0;
}

#posts {
    flex-flow: column-reverse nowrap;
    flex: 6;
    justify-content: space-around;
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
    background-color: blue;
}

#adachiPfp {
    background-image: url('../assets/adachi_pfp.png');
}

.originalPoster {
    margin-top: auto;
    margin-bottom: auto;
}
/*Post Layout*/
#PostLayout {
    border: 2px solid;
    border-radius: 25px;
    padding: 1em 1em 1em 1em;
}
</style>
