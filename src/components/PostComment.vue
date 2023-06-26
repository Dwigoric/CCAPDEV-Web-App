<script setup>
import { ref } from 'vue'

// Import components
import PostComment from './PostComment.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCommentsStore } from '../stores/comments'
import { useCurrentCommentStore } from '../stores/currentComment'

// Define variables
const loggedInStore = useLoggedInStore()
const commentsStore = useCommentsStore()
const currentCommentStore = useCurrentCommentStore()

const newReplyBody = ref('')

// Define functions
function addReply(parentCommentId) {
    if (newReplyBody.value) {
        commentsStore.addComment({
            body: newReplyBody.value,
            parentCommentId,
            user: {
                username: loggedInStore.username,
                image: loggedInStore.image
            }
        })

        newReplyBody.value = ''
    }
}

defineProps({
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
</script>

<template>
    <div class="comment">
        <div class="main-comment" @click="onclick(id)">
            <div class="user">
                <img class="user-image" :src="user['image']" :alt="`${user['username']}'s image`" />
                <div class="user-name">{{ user['username'] }}</div>
            </div>
            <div class="content">
                <p class="body">{{ body }}</p>
            </div>
        </div>
        <VTextarea
            placeholder="Reply to this comment..."
            class="new-reply-input"
            active="true"
            v-if="loggedInStore.username && id === currentCommentStore.currentComment"
            v-model="newReplyBody"
            no-resize=""
            rows="1"
            append-icon="mdi-send"
            @click:append="addReply(id)"
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
    cursor: pointer;
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
}

.main-comment:hover {
    background-color: var(--color-background-mute);
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
</style>
