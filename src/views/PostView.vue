<script setup>
// Import packages
import { ref, reactive, onMounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import PostSpecific from '../components/PostSpecific.vue'
import PostComment from '../components/PostComment.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
// import { useCommentsStore } from '../stores/comments'
import { useCurrentCommentStore } from '../stores/currentComment'
import { useVoteStore } from '../stores/votes'

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
// const commentsStore = useCommentsStore()
const currentCommentStore = useCurrentCommentStore()
const voteStore = useVoteStore()

document.title = 'Compact Donuts | Post'

const currentPost = reactive({
    id: props.id,
    title: '',
    body: '',
    image: '',
    reactions: 0,
    user: {
        id: '',
        username: '',
        image: ''
    }
})
const newCommentBody = ref('')
const newReplyBody = ref('')
const comments = reactive([])
const isLoadingPost = ref(true)
const isLoadingComments = ref(true)

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

        currentPost.title = post.title
        currentPost.body = post.body
        currentPost.image = post.image
        currentPost.reactions = post.reactions
        currentPost.user.id = post.user.id
        currentPost.user.username = post.user.username
        currentPost.user.image = post.user.image
    } catch (err) {
        console.error(err)
    }

    isLoadingPost.value = false
}

async function fetchComments() {
    // TODO: Fetch comments from API
    // const response = await fetch(`${API_URL}/comments/post/${specificPostStore.currentPostId}`)
    // const data = await response.json()
    //
    // // Define search query for user
    // const userParams = new URLSearchParams()
    // userParams.set('limit', '0')
    // userParams.set('select', 'id,username,image')
    //
    // const userResponse = await fetch(`${API_URL}/users?${userParams}`)
    // const userData = await userResponse.json()
    //
    // comments.push(
    //     ...data.comments.map((comment) => ({
    //         ...comment,
    //         parentCommentId: comment.parentCommentId || null,
    //         user: userData.users.find((user) => user.id === comment.user.id)
    //     }))
    // )

    isLoadingComments.value = false
}

function addComment() {
    if (newCommentBody.value === '') return

    // TODO: Add comment to API
    // commentsStore.addComment({
    //     id: 340 + commentsStore.comments.length + 1,
    //     postId: specificPostStore.currentPostId,
    //     body: newCommentBody.value,
    //     parentCommentId: null,
    //     user: {
    //         id: loggedInStore.id,
    //         username: loggedInStore.username,
    //         image: loggedInStore.image
    //     }
    // })

    // comments.push(commentsStore.comments[commentsStore.comments.length - 1])

    newCommentBody.value = ''
}

function savePost() {}

function deletePost() {}

// Define lifecycle hooks
onMounted(fetchPost)
onMounted(fetchComments)
</script>

<template>
    <ThemeSwitch v-if="useMediaQuery('(min-width: 1024px)').value" />
    <NavigationBar />
    <div id="view">
        <div v-if="isLoadingPost" class="preload">
            <LoaderHeart />
        </div>
        <div v-else-if="currentPost.title === ''" class="preload">
            <img src="@/assets/donut_love.svg" alt="404" id="logo" />
            <h1>Post not found</h1>
            <p>The post you are looking for does not exist.</p>
            <RouterLink to="/feed">
                <span> Back to feed </span>
            </RouterLink>
        </div>
        <div id="post-details" v-else>
            <PostSpecific :post="currentPost" :save-post="savePost" :delete-post="deletePost" />
            <div id="vote">
                <VHover v-slot="{ isHovering, props }">
                    <VBtn
                        class="ma-1 upvote"
                        v-bind="props"
                        :color="
                            isHovering || voteStore.getVoteCount(id) > 0
                                ? 'deep-orange-darken-1'
                                : 'blue-grey-lighten-1'
                        "
                        density="compact"
                        variant="text"
                        icon="mdi-arrow-up-circle-outline"
                        @click="voteStore.upvote(id)"
                    >
                    </VBtn>
                </VHover>
                <span>{{ currentPost.reactions + voteStore.getTotalVotes(currentPost.id) }}</span>
                <VHover v-slot="{ isHovering, props }">
                    <VBtn
                        class="ma-1 downvote"
                        v-bind="props"
                        :color="
                            isHovering || voteStore.getVoteCount(id) < 0
                                ? 'blue-darken-3'
                                : 'blue-grey-lighten-1'
                        "
                        density="compact"
                        variant="text"
                        icon="mdi-arrow-down-circle-outline"
                        @click="voteStore.downvote(id)"
                    >
                    </VBtn>
                </VHover>
            </div>
            <div id="new-comment" v-if="loggedInStore.username">
                <VTextarea
                    placeholder="Add a comment..."
                    id="new-comment-body"
                    active="true"
                    no-resize="true"
                    rows="1"
                    v-model="newCommentBody"
                    append-inner-icon="mdi-send"
                    @click:append-inner="addComment"
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
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    color: var(--color-text);
    resize: none;
}

#vote {
    display: flex;
    align-items: center;
    margin: 10px;
}
</style>
