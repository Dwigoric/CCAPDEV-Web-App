<script setup>
import { ref } from 'vue'
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
const form = ref(null)

// Define form rules
const commentRules = [
    (v) => !!v || 'Comment is required',
    (v) => v.length <= 500 || 'Comment must be less than 500 characters'
]

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

        const result = await fetch(`${API_URL}/comments/${props.postId}/${props.id}`, {
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
    const { valid } = await form.value.validate()
    if (!valid) return

    if (newComment.value === '') return

    const { token } = window.$cookies.get('credentials')

    try {
        const result = await fetch(`${API_URL}/comments/${props.postId}/${props.id}`, {
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
    editFlag.value = false
    const comment = comments.find((cm) => cm.id === props.id)
    comment.body = newComment.value
    comment.edited = Date.now()
}
</script>

<template>
    <div class="comment">
        <div class="main-comment" @click="onclick(id)">
            <div class="existing-comment" v-if="!comments.some((cm) => cm.id === id && cm.deleted)">
                <div class="user">
                    <img
                        class="user-image"
                        :src="user['image']"
                        :alt="`${user['username']}'s image`"
                    />
                    <div class="user-name">{{ user['username'] }}</div>
                </div>
                <div class="content">
                    <p v-if="!editFlag" class="body">{{ body }}</p>
                    <VForm v-else ref="form">
                        <VTextarea
                            class="new-reply-input"
                            v-model="newComment"
                            :rules="commentRules"
                            placeholder="Enter a new comment..."
                            rows="1"
                            no-resize=""
                            append-inner-icon="mdi-send"
                            @click:append-inner="saveComment"
                        />
                    </VForm>
                </div>
                <VMenu v-if="loggedInStore.id === user.id">
                    <template v-slot:activator="{ props }">
                        <VBtn
                            class="ml-5"
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
                <div v-if="edited" class="ml-9">
                    <VIcon size="x-small"> mdi-pencil </VIcon>
                    <span class="time-span">edited {{ moment(edited).fromNow() }}</span>
                </div>
            </div>
            <span class="deleted-comment" v-else> This comment has been deleted </span>
            <span class="created-timestamp">
                <VIcon size="x-small"> mdi-clock </VIcon>
                <span class="time-span">
                    {{ moment(date).fromNow() }}
                    <VTooltip activator="parent" location="top">{{ moment(date) }}</VTooltip>
                </span>
            </span>
        </div>
        <VTextarea
            placeholder="Reply to this comment..."
            class="new-reply-input"
            active="true"
            v-if="loggedInStore.username && id === currentCommentStore.currentComment"
            v-model="newReplyBody"
            no-resize=""
            rows="1"
            append-inner-icon="mdi-send"
            @click:append-inner="addReply(id)"
        />
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
    padding: 0.5rem 0 0 0.5rem;
    margin-left: 13px;
    background-color: var(--color-background-soft);
    border-left: var(--color-border) solid 3px;
}

[data-theme='light'] .user-image {
    background-color: var(--color-dark-pink);
    border: var(--color-border) solid 3px;
}

.main-comment {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.main-comment:hover {
    background-color: var(--color-background-mute);
}

.existing-comment {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

.deleted-comment {
    padding-left: 0.5rem;
}

.time-span {
    font-size: 0.8rem;
    color: var(--color-text);
    margin-left: 10px;
}

.created-timestamp {
    display: flex;
    flex: 1;
    flex-flow: row nowrap;
    align-items: center;
    height: 100%;
    margin-right: 0.5rem;
    justify-content: flex-end;
}

.user {
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
}

.replies {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    flex-basis: 100%;
    background-color: var(--color-background-soft);
}

.new-reply-input {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
}

svg {
    pointer-events: none;
}

.content {
    display: flex;
    flex-flow: row;
}
</style>
