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
    posts.push({
        ...post,
        user: {
            username: loggedIn.username,
            image: loggedIn.image
        }
    })
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
                :image="post.id % 4 === 0 ? 'https://placekitten.com/400' : ''"
            />
            <!--<div class="flexboxColumn" id="PostLayout">
                <div class="flexboxRow">
                    <span class="profilePic" id="adachiPfp"></span>
                    <span class="originalPoster"> Adachi </span>
                    <span class="originalPoster"> @Cabbage_Man </span>
                </div>
                <div class="postContent" id="adachiPost"></div>
                <div class="flexboxRow" id="updoots">
                    <a>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#888888"
                                d="M11 20V7.825l-5.6 5.6L4 12l8-8l8 8l-1.4 1.425l-5.6-5.6V20h-2Z"
                            />
                        </svg>
                    </a>
                    <div class="count">5</div>
                    <a>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#888888"
                                d="m12 20l-8-8l1.4-1.425l5.6 5.6V4h2v12.175l5.6-5.6L20 12l-8 8Z"
                            />
                        </svg>
                    </a>
                </div>
                <div>
                    Hello, did you know that the deepest part of the ocean is called the Challenger
                    Deep and it 10,935 deep, tallest than Mount Everest and people managed to reach
                    there
                </div>
            </div> -->
            <NewPost v-if="loggedIn.username" :add-post="addPost" />
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
