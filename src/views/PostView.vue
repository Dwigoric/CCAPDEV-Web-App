<script setup>
// Import packages
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import router from '@/router'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import PostSpecific from '../components/PostSpecific.vue'
import PostComment from '../components/PostComment.vue'
import PostSpecificVote from '../components/PostSpecificVote.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useSpecificPostStore } from '@/stores/currentPost'

// Define variables
const API_URL = 'https://dummyjson.com'

const specificPostStore = useSpecificPostStore()

const comments = reactive([])
const isLoading = ref(true)

// Define functions
async function fetchComments() {
    const response = await fetch(`${API_URL}/comments/post/${specificPostStore.currentPost.id}`)
    const data = await response.json()

    // Define search query for user
    const userParams = new URLSearchParams()
    userParams.set('limit', '0')
    userParams.set('select', 'id,username,image')

    const userResponse = await fetch(`${API_URL}/users?${userParams}`)
    const userData = await userResponse.json()

    data.comments.map((comment) => {
        comments.push({
            ...comment,
            user: userData.users.find((user) => user.id === comment.user.id)
        })
    })

    isLoading.value = false
}

// Define lifecycle hooks
onMounted(fetchComments)

onUnmounted(specificPostStore.unsetCurrentPost)

if (specificPostStore.currentPostId === null) {
    router.push({ name: 'feed' })
}
</script>

<template>
    <ThemeSwitch v-if="useMediaQuery('(min-width: 1024px)').value" />
    <NavigationBar />
    <div id="view">
        <div id="post-details">
            <PostSpecific
                :user="specificPostStore.currentPost.user"
                :title="specificPostStore.currentPost.title"
                :body="specificPostStore.currentPost.body"
                :image="specificPostStore.currentPost.image"
            />
            <div id="vote">
                <PostSpecificVote :reactions="specificPostStore.currentPost.reactions" />
            </div>
            <div id="comments">
                <div id="loader-wrapper" v-if="isLoading">
                    <LoaderHeart />
                </div>
                <PostComment
                    v-else
                    v-for="comment in comments"
                    :key="comment.id"
                    :body="comment.body"
                    :user="comment.user"
                />
                <div id="comments-end">You've reached the end.</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#comments {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    flex-basis: 100%;
    background-color: var(--color-background-soft);
}

#view {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    justify-content: center;
    align-self: baseline;
    min-height: calc(100vh - var(--navbar-height));
    margin-top: var(--navbar-height);
}

#post-details {
    flex-basis: 100vw;
    min-height: calc(100vh - var(--navbar-height));
    top: calc(var(--navbar-height));
    background: var(--color-background-soft);
}

@media (min-width: 1024px) {
    #post-details {
        flex-basis: 40vw;
    }
}

#comments-end {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    color: var(--color-bright-blue);
}

#loader-wrapper {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}
</style>
