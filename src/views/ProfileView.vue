<script setup>
// Import packages
import { reactive, ref } from 'vue'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'

// Define variables
const API_URL = 'https://dummyjson.com'

const login = useLoggedInStore()

const userPosts = reactive([])
const loading = ref(true)
const editing = ref(false)

// Define functions
async function fetchPosts() {
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

async function getPosts() {
    if (login.id <= 100) return fetchPosts()

    const { cachedPosts } = useCachedPostsStore()

    userPosts.push(...cachedPosts.filter((post) => post.user.id === login.id))

    loading.value = false
}

getPosts()
</script>

<template>
    <NavigationBar />
    <div id="header">
        <VImg
            src="https://ik.imagekit.io/ikmedia/backlit.jpg"
            alt="Background image"
            id="bg-image"
            height="150"
            :aspect-ratio="1"
            cover=""
        />
        <div id="user-panel">
            <div id="user-data">
                <VAvatar
                    size="150"
                    class="mb-3"
                    variant="tonal"
                    :style="{ cursor: editing ? 'pointer' : 'default' }"
                >
                    <VImg :src="login.image" alt="Profile image" :aspect-ratio="1" />
                </VAvatar>
                <span v-if="!editing" id="username" class="rounded-pill pa-1 px-3">{{
                    login.username
                }}</span>
                <VTextField
                    v-else
                    v-model="login.username"
                    label="New username"
                    variant="outlined"
                    class="w-100"
                />
            </div>
            <div id="user-description">
                <span v-if="!editing">
                    {{ login.description }}
                </span>
                <VTextarea
                    v-else
                    v-model="login.description"
                    label="New description"
                    variant="outlined"
                    no-resize=""
                    rows="1"
                />
            </div>
        </div>
        <VBtn id="edit-btn" class="rounded-pill" @click="editing = !editing"> Edit Profile </VBtn>
    </div>

    <div id="posts">
        <Waypoint v-if="loading">
            <LoaderHeart />
        </Waypoint>
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
        <ThemeSwitch />
    </div>
</template>

<style scoped>
#header {
    height: 35vh;
    width: 100vw;
}

#bg-image {
    position: relative;
    top: var(--navbar-height);
    left: 0;
    z-index: -1;
}

#user-panel {
    display: flex;
    position: absolute;
    top: calc(var(--navbar-height) + 3vh);
    left: 10vw;
    width: 100vw;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
}

#user-data {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

#username {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-text);
    background: var(--color-background-soft);
}

#user-description {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 12vh 0 0 1rem;
    width: 50vw;
}

#edit-btn {
    position: absolute;
    top: calc(var(--navbar-height) + 15vh);
    right: 1vw;
    transform: translateX(-50%);
    width: 150px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;
}

#posts {
    display: flex;
    flex-flow: column-reverse nowrap;
    justify-content: center;
    align-items: center;
    padding: 2rem 10vw;
    width: 100%;
    gap: 2rem;
}
</style>
