<script setup>
// Import packages
import { useMediaQuery } from '@vueuse/core'
import { onMounted, reactive, ref } from 'vue'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'
import { useDeletedPostsStore } from '../stores/deletedPosts'

// Define variables
const API_URL = 'https://dummyjson.com'

const login = useLoggedInStore()
const { deletedPosts } = useDeletedPostsStore()

const userPosts = reactive([])
const loading = ref(true)

// Define functions
const fetchPosts = async () => {
    // Get list of users
    const userParams = new URLSearchParams()
    userParams.set('select', 'id,username,image')

    const user = await fetch(`${API_URL}/users/${login.id}?${userParams}`)
        .then((res) => res.json())
        .catch(console.error)

    // Process posts
    const postParams = new URLSearchParams()
    postParams.set('limit', '0')

    const response = await fetch(`${API_URL}/posts/user/${login.id}?${postParams}`)
    const { posts } = await response.json()
    userPosts.push(
        ...posts.map((post) => ({
            ...post,
            user
        }))
    )

    loading.value = false
}

const getPosts = async () => {
    if (login.id <= 100) return fetchPosts()

    const { cachedPosts } = useCachedPostsStore()

    userPosts.push(...cachedPosts.filter((post) => post.user.id === login.id))

    loading.value = false
}

onMounted(getPosts)
</script>

<template>
    <NavigationBar />
    <div class="profile">
        <div class="prof-bg">
            <img class="bg" src="https://ik.imagekit.io/ikmedia/backlit.jpg" />
        </div>
        <div class="prof-pfp">
            <img class="pfp" :src="login.image" :alt="`${[login.username]}'s pfp`" />
        </div>
        <div class="username">
            <h2>{{ login.username }}</h2>
        </div>
        <div class="description">
            <h5>{{ login.description }}</h5>
            <!--default description, can be blank if they want-->
        </div>
    </div>

    <!---<input type="button" value="Edit Profile" class="button" @click=""/>-->
    <VBtn to="/editprofile" class="button"> Edit Profile </VBtn>

    <hr class="solid" />
    <!-- supposed to be the divider between profile details (username, pfp, etc.) and posts -->

    <div class="post" id="posts">
        <div
            class="feed-element"
            id="left-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            This is the left sidebar.
        </div>
        <LoaderHeart v-if="loading" />
        <FeedPost
            v-else
            v-for="post in userPosts.filter((p) => !deletedPosts.has(p.id))"
            :key="post.id"
            :id="post.id"
            :title="post.title"
            :body="post.body"
            :user="post.user"
            :image="post.image"
            :reactions="post.reactions"
        />
        <div
            class="feed-element"
            id="right-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            <ThemeSwitch />
        </div>
    </div>
</template>

<style scoped>
.prof-bg {
    position: absolute;
    top: 48px;
    width: 100%;
    height: 50%;
}

.bg {
    width: 100vw;
    height: 75%;
    object-fit: cover;
    z-index: 1;
}

.prof-pfp {
    position: relative;
    top: 295px;
    left: 5px;
}

.pfp {
    border-radius: 50%;
    border: black 5px solid;
    height: 125px;
    width: 125px;
    background-color: lightyellow;
    z-index: 2;
}

.username {
    position: relative;
    top: 195px;
    left: 150px;
    font-size: 25px;
}

.description {
    position: relative;
    top: 198px;
    left: 150px;
    font-size: 19px;
}

.button {
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

.button:hover {
    background-color: lightpink;
    color: lightpink;
}

.solid {
    height: 5px;
    background: #6ad4d9;
    bottom: 200px;
}
.post {
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
