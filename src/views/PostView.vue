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
import NewComment from '../components/NewComment.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useSpecificPostStore } from '../stores/currentPost'
import { useCommentsStore } from '../stores/comments'

// Define variables
const API_URL = 'https://dummyjson.com'

const loggedInStore = useLoggedInStore()
const specificPostStore = useSpecificPostStore()
const commentsStore = useCommentsStore()

const newCommentBody = ref('')
const comments = reactive([])
const isLoading = ref(true)

// Define functions
async function fetchComments() {
    if (specificPostStore.currentPostId <= 150) {
        const response = await fetch(`${API_URL}/comments/post/${specificPostStore.currentPostId}`)
        const data = await response.json()

        // Define search query for user
        const userParams = new URLSearchParams()
        userParams.set('limit', '0')
        userParams.set('select', 'id,username,image')

        const userResponse = await fetch(`${API_URL}/users?${userParams}`)
        const userData = await userResponse.json()

        data.comments.forEach((comment) => {
            comments.push({
                ...comment,
                user: userData.users.find((user) => user.id === comment.user.id),
                replies: []
            })
        })
    }

    comments.push(
        ...commentsStore.comments.filter(
            (comment) => comment.postId === specificPostStore.currentPostId
        )
    )

    isLoading.value = false
}

function addComment() {
    if (newCommentBody.value === '') return

    commentsStore.comments.push({
        id: 340 + commentsStore.comments.length + 1,
        postId: specificPostStore.currentPostId,
        body: newCommentBody.value,
        replies: [],
        user: {
            username: loggedInStore.username,
            image: loggedInStore.image
        }
    })
    newCommentBody.value = ''

    comments.push(commentsStore.comments[commentsStore.comments.length - 1])
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
            <div id="new-comment" v-if="loggedInStore.username">
                <VTextarea
                    placeholder="Add a comment..."
                    id="new-comment-body"
                    active="true"
                    no-resize="true"
                    rows="1"
                    v-model="newCommentBody"
                    @keyup.enter="addComment"
                />
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
                >
                </PostComment>
            </div>
        </div>
    </div>
</template>

<style scoped>
#comments {
    display: flex;
    flex-flow: column-reverse nowrap;
    align-items: flex-start;
    justify-content: center;
    flex-basis: 100%;
    background-color: var(--color-background-soft);
    padding: 0 2rem 1.5rem 0;
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

#loader-wrapper {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

#new-comment {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-soft);
    padding: 1rem;
    border-top: 1px solid var(--color-background);
}

#new-comment-body {
    width: 100%;
    background-color: var(--color-background);
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    color: var(--color-text);
    resize: none;
}

#vote {
    display: flex;
    margin: 10px;
}
</style>
