import { reactive } from 'vue'
import { defineStore } from 'pinia'

const comments = reactive([])

export const useCommentsStore = defineStore('comments', () => {
    return {
        comments,
        addComment
    }
})

function addComment({ postId, body, parentCommentId, user }) {
    comments.push({
        id: 340 + comments.length + 1,
        postId,
        body,
        parentCommentId,
        user
    })
}
