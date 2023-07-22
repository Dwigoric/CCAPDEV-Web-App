<script setup>
// Import packages
import { reactive, ref, onMounted } from 'vue'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'

// Import constants
import { API_URL } from '../constants'

// Define variables
document.title = 'Compact Donuts | Profile'

const props = defineProps({
    username: {
        type: String,
        required: true
    }
})

const currentUser = reactive({
    id: '',
    username: '',
    description: '',
    image: ''
})

const login = useLoggedInStore()

const userPosts = reactive([])
const loading = ref(true)
const editing = ref(false)

// Define functions
async function fetchUser() {
    const { user } = await fetch(`${API_URL}/users/username/${props.username}`).then((res) =>
        res.json()
    )

    currentUser.id = user.id
    currentUser.username = user.username
    currentUser.description = user.description
    currentUser.image = user.image

    return fetchPosts()
}

async function fetchPosts() {
    // Process posts
    const { posts } = await fetch(`${API_URL}/posts/user/${currentUser.id}`).then((res) =>
        res.json()
    )
    userPosts.push(...posts)

    loading.value = false
}

onMounted(fetchUser)
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
                    <VImg :src="currentUser.image" alt="Profile image" :aspect-ratio="1" />
                </VAvatar>
                <span v-if="!editing" id="username" class="rounded-pill pa-1 px-3">{{
                    currentUser.username
                }}</span>
                <VTextField
                    v-else
                    v-model="currentUser.username"
                    label="New username"
                    variant="outlined"
                    class="w-100"
                />
            </div>
            <div id="user-description">
                <span v-if="!editing">
                    {{ currentUser.description }}
                </span>
                <VTextarea
                    v-else
                    v-model="currentUser.description"
                    label="New description"
                    variant="outlined"
                    no-resize=""
                    rows="1"
                />
            </div>
        </div>
        <VBtn
            v-if="login.username === username"
            id="edit-btn"
            class="rounded-pill"
            @click="editing = !editing"
        >
            Edit Profile
        </VBtn>
    </div>

    <div id="posts">
        <Waypoint v-if="loading">
            <LoaderHeart />
        </Waypoint>
        <FeedPost
            v-else
            v-for="post in userPosts"
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
