<script setup>
import { ref } from 'vue'
import router from '../router'
import moment from 'moment'

// Import components
import PostComment from './PostComment.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCommentsStore } from '../stores/comments'
import { useCurrentCommentStore } from '../stores/currentComment'
import { VTextarea } from 'vuetify/lib/components/index.mjs'

// Import constants
import { API_URL } from '../constants'

// Define variables
const loggedInStore = useLoggedInStore()
const { comments, addComment } = useCommentsStore()
const currentCommentStore = useCurrentCommentStore()

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    edited: {
        type: Number,
        required: false
    },
    onclick: {
        type: Function,
        required: false
    }
})

const newReplyBody = ref('')
const newComment = ref(props.body)
const editFlag = ref(false)

// Define form rules
const commentRules = [(v) => v.length <= 500 || 'Comment must be less than 500 characters']

// Define functions
function addReply(pCommentId) {
    addComment({
        postId: props.postId,
        body: newReplyBody.value,
        parentCommentId: pCommentId
    })

    // Reset form
    newReplyBody.value = ''
}

async function deleteComment() {
    try {
        const { token } = window.$cookies.get('credentials')

        const result = await fetch(`${API_URL}/comments/${props.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => res.json())

        if (result.error) {
            console.error(result.error)
            return
        }

        const comment = comments.find((cm) => cm.id === props.id)
        comment.deleted = true
        comment.body = '[deleted]'
        comment.user = null
    } catch (err) {
        console.error(err)
    }
}

function editComment() {
    editFlag.value = true
}

async function saveComment() {
    editFlag.value = false

    if (newComment.value === '' || newComment.value === props.body) return

    const { token } = window.$cookies.get('credentials')

    try {
        const result = await fetch(`${API_URL}/comments/${props.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                body: newComment.value
            })
        }).then((res) => res.json())

        if (result.error) {
            console.error(result.message)
        }
    } catch (err) {
        console.error(err)
    }
    const comment = comments.find((cm) => cm.id === props.id)
    comment.body = newComment.value
    comment.edited = Date.now()
}
</script>

<template>
    <div class="comment ml-4">
        <div class="main-comment" @click="onclick(id)">
            <div class="existing-comment" v-if="!comments.some((cm) => cm.id === id && cm.deleted)">
                <div class="header mx-3 mt-2">
                    <img
                        class="user-image"
                        :src="user['image']"
                        :alt="`${user['username']}'s image`"
                        @click="
                            router.push({ name: 'profile', params: { username: user['username'] } })
                        "
                    />
                    <span class="user-name">{{ user['username'] }}</span>
                    <span class="time-span ml-2">
                        <VIcon size="x-small"> mdi-clock </VIcon>
                        {{ moment(date).fromNow() }}
                        <VTooltip activator="parent" location="top">
                            created at {{ moment(date) }}
                        </VTooltip>
                        <span class="time-span"> </span>
                    </span>
                    <span v-if="edited" class="time-span ml-2">
                        <VIcon size="x-small"> mdi-pencil </VIcon>
                        {{ moment(edited).fromNow() }}
                        <VTooltip activator="parent" location="top">
                            edited at {{ moment(edited) }}
                        </VTooltip>
                    </span>
                </div>
                <div class="content mx-3 mt-1 mb-2">
                    <p v-if="!editFlag" class="body">{{ body }}</p>
                    <VTextarea
                        v-else
                        class="new-reply-input"
                        variant="solo-filled"
                        auto-grow="auto-grow"
                        v-model="newComment"
                        placeholder="Enter a new comment..."
                        :rules="commentRules"
                        rows="1"
                        cols="50"
                        no-resize="no-resize"
                        append-inner-icon="mdi-send"
                        @click:append-inner="saveComment"
                    />
                </div>
            </div>
            <span class="deleted-comment" v-else> This comment has been deleted </span>
            <VMenu v-if="user && loggedInStore.id === user.id">
                <template v-slot:activator="{ props }">
                    <VBtn
                        class="ml-3 mr-2"
                        v-bind="props"
                        size="large"
                        density="compact"
                        variant="text"
                        icon="mdi-dots-vertical"
                    >
                    </VBtn>
                </template>
                <VList>
                    <VListItem @click="editComment">
                        <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>
                    <VListItem @click="deleteComment">
                        <VListItemTitle>Delete</VListItemTitle>
                    </VListItem>
                </VList>
            </VMenu>
        </div>
        <VExpandTransition>
            <VSpacer
                class="reply-input-spacer"
                v-if="loggedInStore.username && id === currentCommentStore.currentComment"
            ></VSpacer>
        </VExpandTransition>
        <VExpandTransition>
            <VTextarea
                placeholder="Reply to this comment..."
                class="new-reply-input px-3"
                active="true"
                variant="solo-filled"
                auto-grow="auto-grow"
                clearable="clearable"
                v-if="loggedInStore.username && id === currentCommentStore.currentComment"
                v-model="newReplyBody"
                no-resize=""
                :rules="commentRules"
                rows="1"
                append-inner-icon="mdi-send"
                @click:append-inner="addReply(id)"
                prepend-inner-icon="mdi-menu-up"
                @click:prepend-inner="currentCommentStore.setCurrentComment(null)"
            />
        </VExpandTransition>
        <div class="replies">
            <PostComment
                v-for="reply in comments.filter((comment) => comment.parentCommentId === id)"
                :key="reply.id"
                :id="reply.id"
                :post-id="postId"
                :user="reply.user"
                :body="reply.body"
                :date="reply.date"
                :edited="reply.edited"
                :onclick="onclick"
            >
            </PostComment>
        </div>
    </div>
</template>

<style scoped>
.comment {
    display: flex;
    flex: 1 0 auto;
    flex-flow: column nowrap;
    align-self: stretch;
    justify-content: flex-start;
    height: 100%;
    background-color: var(--color-background-soft);
    border-left: var(--color-border) solid 3px;
}

[data-theme='light'] .user-image {
    background-color: var(--color-dark-pink);
    border: var(--color-bright-blue) solid 3px;
}

.main-comment {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    cursor: pointer;
    max-width: 100vw;
}

.main-comment:hover {
    background-color: var(--color-background-mute);
}

.existing-comment {
    display: flex;
    flex: 1 1 auto;
    flex-flow: column nowrap;
    align-items: flex-start;
}

.deleted-comment {
    padding-left: 0.5rem;
}

.time-span {
    display: flex;
    flex: 0 0 auto;
    flex-flow: row nowrap;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    font-size: 0.8rem;
    gap: 0.2rem;
}

.header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    height: 100%;
}

.user-image {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-background-mute);
    cursor: pointer;
}

.user-name {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 0.2rem;
    border-radius: 5px;
    color: var(--color-bright-blue);
}

.body {
    width: 100%;
    overflow-wrap: anywhere;
}

.replies {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    flex-basis: 100%;
    background-color: var(--color-background-soft);
}

.reply-input-spacer {
    height: 0.5rem;
}

.new-reply-input {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
}

svg {
    pointer-events: none;
}

.content {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}
</style>
