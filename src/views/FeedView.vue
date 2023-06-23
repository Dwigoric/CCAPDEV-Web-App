<script setup>
// Import packages
import { ref, reactive } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { Waypoint } from 'vue-waypoint'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import NewPost from '../components/NewPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useTempPostsStore } from '@/stores/tempPosts'
import { useLoggedInStore } from '@/stores/loggedIn'

// Set document title
document.title = 'Compact Donuts | Feed'

// Define variables
const API_URL = 'https://dummyjson.com'

const { tempPosts } = useTempPostsStore()
const loggedIn = useLoggedInStore()

const posts = reactive([])
posts.push(...tempPosts)

const loadedAllPosts = ref(false)
let skip = 130
const limit = 20

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

    posts.unshift(
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
            .catch(console.error))
    )

    if (posts.length >= 150) {
        loadedAllPosts.value = true
    }
}

const addPost = (post) => {
    tempPosts.push({
        ...post,
        user: {
            username: loggedIn.username,
            image: loggedIn.image
        }
    })
    posts.push(tempPosts[tempPosts.length - 1])
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
                :image="post.id % 4 === 0 ? 'https://placekitten.com/1000' : ''"
            />
            <NewPost v-if="loggedIn.username && posts.length > 0" :add-post="addPost" />
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
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-mute);
    gap: 2rem;
}

#right-sidebar {
    flex-flow: row nowrap;
    justify-content: left;
    flex: 3 0;
}

svg path:hover {
    fill: orangered;
}
</style>
