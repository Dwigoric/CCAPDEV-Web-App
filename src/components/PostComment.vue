<script setup>
import { ref } from 'vue'

// Import components
import PostComment from './PostComment.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCommentsStore } from '../stores/comments'
import { useCurrentCommentStore } from '../stores/currentComment'
import { VTextarea } from 'vuetify/lib/components/index.mjs'

// Define variables
const loggedInStore = useLoggedInStore()
const commentsStore = useCommentsStore()
const currentCommentStore = useCurrentCommentStore()

const newReplyBody = ref('')
const newComment = ref('')

const editFlag = ref(false)

// Define functions
function addReply(parentCommentId) {
    if (newReplyBody.value) {
        commentsStore.addComment({
            body: newReplyBody.value,
            parentCommentId,
            user: {
                id: loggedInStore.id,
                username: loggedInStore.username,
                image: loggedInStore.image
            }
        })

        newReplyBody.value = ''
    }
}

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    postId: {
        type: Number,
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
    onclick: {
        type: Function,
        required: false
    }
})

function deleteComment() {
    const comment = commentsStore.comments.find((cm) => cm.id === props.id)
    comment.deleted = true
}

function editComment() {
    editFlag.value = true
}

function saveComment() {
    if (newComment.value === '') return

    editFlag.value = false
    const comment = commentsStore.comments.find((cm) => cm.id === props.id)
    comment.body = newComment.value
}
</script>

<template>
    <div class="comment">
        <div class="main-comment" @click="onclick(id)">
            <div
                class="existing-comment"
                v-if="!commentsStore.comments.some((cm) => cm.id === id && cm.deleted)"
            >
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
                    <VTextarea
                        v-else
                        class="new-reply-input"
                        v-model="newComment"
                        placeholder="Enter a new comment..."
                        rows="1"
                        no-resize=""
                        append-inner-icon="mdi-send"
                        @click:append-inner="saveComment"
                    />
                </div>
                <VMenu v-if="loggedInStore.id === user.id">
                    <template v-slot:activator="{ props }">
                        <VBtn
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
            <span class="deleted-comment" v-else> This comment has been deleted </span>
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
                v-for="reply in commentsStore.comments.filter(
                    (comment) => comment.parentCommentId === id
                )"
                :key="reply.id"
                :id="reply.id"
                :post-id="postId"
                :user="reply.user"
                :body="reply.body"
                :onclick="onclick"
            >
            </PostComment>
        </div>
        <div></div>
    </div>
</template>

<style scoped>
.comment {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    flex-grow: 1;
    width: calc(100% - 3px);
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
