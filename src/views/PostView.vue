<script setup>
// Import packages
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import router from '../router'
import moment from 'moment'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import PostSpecific from '../components/PostSpecific.vue'
import PostComment from '../components/PostComment.vue'
import LoaderHeart from '../components/LoaderHeart.vue'
import PostVote from '../components/PostVote.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCommentsStore } from '../stores/comments'
import { useCurrentCommentStore } from '../stores/currentComment'

// Import constants
import { API_URL } from '../constants'

// Define props
const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

// Define variables
const loggedInStore = useLoggedInStore()
const { comments, addComment, clearComments } = useCommentsStore()
const currentCommentStore = useCurrentCommentStore()

document.title = 'Compact Donuts | Post'

const currentPost = reactive({
    id: props.id,
    title: '',
    body: '',
    image: '',
    reactions: 0,
    date: null,
    edited: null,
    user: {
        id: '',
        username: '',
        image: ''
    }
})
const newCommentBody = ref('')
const newReplyBody = ref('')
const isLoadingPost = ref(true)
const isLoadingComments = ref(true)

// Define form rules
const commentRules = [(v) => v.length <= 500 || 'Comment must be less than 500 characters']

// Define functions
async function fetchPost() {
    try {
        const { post, error } = await fetch(`${API_URL}/posts/${props.id}`).then((res) =>
            res.json()
        )

        if (error) {
            isLoadingPost.value = false
            return
        }

        Object.assign(currentPost, post)
    } catch (err) {
        console.error(err)
    }

    isLoadingPost.value = false
}

async function fetchComments() {
    try {
        const { comments: fetchedComments } = await fetch(`${API_URL}/comments/${props.id}`).then(
            (res) => res.json()
        )
        comments.splice(0, comments.length, ...fetchedComments) // Replace the comments with the fetched comments
    } catch (error) {
        console.error(`Error occurred while fetching comments for post with ID ${props.id}:`, error)
        comments.splice(0, comments.length) // Clear the comments array in case of an error or no comments found
    }

    isLoadingComments.value = false
}

// Preprocess input
const processComment = () => {
    addComment({
        postId: props.id,
        body: newCommentBody.value,
        parentCommentId: null
    })

    // Reset form
    newCommentBody.value = ''
}

async function savePost({ title, body }) {
    const newPostData = {}
    let willEdit = false

    if (title !== props.title) {
        currentPost.title = title
        newPostData.title = title
        willEdit = true
    }
    if (body !== props.body) {
        currentPost.body = body
        newPostData.body = body
        willEdit = true
    }

    if (!willEdit) return

    currentPost.edited = Date.now()

    try {
        const { token } = window.$cookies.get('credentials')

        const result = await fetch(`${API_URL}/posts/${currentPost.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newPostData)
        }).then((res) => res.json())

        if (result.error) {
            console.error(result.error)
        }
    } catch (err) {
        console.error(err)
    }
}

async function deletePost() {
    try {
        const { token } = window.$cookies.get('credentials')

        const result = await fetch(`${API_URL}/posts/${currentPost.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => res.json())

        if (result.error) {
            console.error(result.error)
        }
    } catch (err) {
        console.error(err)
    }

    return router.push({ name: 'feed' })
}

// Define lifecycle hooks
onMounted(fetchPost)
onMounted(fetchComments)
onUnmounted(clearComments)
watch(
    () => props.id,
    () => {
        isLoadingPost.value = true
        isLoadingComments.value = true
        clearComments()
        fetchPost()
        fetchComments()
    }
)
</script>

<template>
    <ThemeSwitch v-if="useMediaQuery('(min-width: 1024px)').value" />
    <NavigationBar title-custom-text="Back to Feed" />
    <div id="view">
        <div v-if="isLoadingPost" class="preload">
            <LoaderHeart />
        </div>
        <div v-else-if="currentPost.title === ''" class="preload">
            <img src="@/assets/donut_love.svg" alt="404" id="logo" />
            <h1>404</h1>
            <h2>Post not found</h2>
            <p>The post you are looking for does not exist.</p>
            <RouterLink to="/feed">
                <span> Back to feed </span>
            </RouterLink>
        </div>
        <div id="post-details" v-else>
            <PostSpecific :post="currentPost" :save-post="savePost" :delete-post="deletePost" />
            <div id="post-info">
                <PostVote :id="id" />
                <VSpacer></VSpacer>
                <span v-if="currentPost.edited" class="time-span ml-5">
                    <VIcon size="x-small"> mdi-pencil </VIcon>
                    edited {{ moment(currentPost.edited).fromNow() }}
                    <VTooltip activator="parent" location="top">
                        edited at {{ moment(currentPost.edited) }}
                    </VTooltip>
                </span>
                <span class="time-span ml-2 mr-3">
                    <VIcon size="x-small"> mdi-clock </VIcon>
                    posted {{ moment(currentPost.date).fromNow() }}
                    <VTooltip activator="parent" location="top">
                        posted at {{ moment(currentPost.date) }}
                    </VTooltip>
                </span>
            </div>
            <div id="new-comment" v-if="loggedInStore.username">
                <VTextarea
                    placeholder="Add a comment..."
                    id="new-comment-body"
                    active="true"
                    no-resize="no-resize"
                    variant="solo-filled"
                    auto-grow="auto-grow"
                    clearable="clearable"
                    :rules="commentRules"
                    rows="1"
                    v-model="newCommentBody"
                    append-inner-icon="mdi-send"
                    @click:append-inner="processComment"
                />
            </div>
            <div id="comments">
                <div id="loader-wrapper" v-if="isLoadingComments">
                    <LoaderHeart />
                </div>
                <PostComment
                    v-else
                    v-for="comment in comments.filter(
                        (_comment) => _comment.parentCommentId === null
                    )"
                    :key="comment.id"
                    :id="comment.id"
                    :post-id="id"
                    :body="comment.body"
                    :user="comment.user"
                    :depth="0"
                    :date="comment.date"
                    :edited="comment.edited"
                    :onclick="
                        (parentId) => {
                            currentCommentStore.setCurrentComment(parentId)
                            newReplyBody = ''
                        }
                    "
                >
                </PostComment>
            </div>
        </div>
    </div>
</template>

<style scoped>
.preload {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

#logo {
    width: 30rem;
    height: 30rem;
}

#comments {
    display: flex;
    flex: 1 1 auto;
    flex-flow: column-reverse nowrap;
    align-items: stretch;
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
    max-width: 100vw;
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

#post-info {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0.5rem;
    background: linear-gradient(
        to bottom,
        var(--color-pale-blue) 0%,
        var(--color-background-soft) 100%
    );
}

[data-theme='light'] #post-info {
    background: linear-gradient(
        to bottom,
        var(--color-bright-pink) 0%,
        var(--color-background-soft) 100%
    );
}

.time-span {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    font-size: 0.8rem;
    color: var(--color-text);
    gap: 0.3rem;
}

#new-comment {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-soft);
    padding: 1rem;
}

#new-comment-body {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    color: var(--color-text);
    resize: none;
}
</style>
