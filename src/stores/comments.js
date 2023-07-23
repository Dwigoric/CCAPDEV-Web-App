import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { API_URL } from '../constants'

const comments = reactive([])
const loadedAllComments = ref(false)

export const useCommentsStore = defineStore('comments', () => {
    return {
        comments,
        loadedAllComments,
        addComment
    }
})

function addComment({ postId, body, parentCommentId, user }) {
    comments.push({
        id: 340 + comments.length + 1,
        postId,
        body,
        parentCommentId,
        user,
        deleted: false
    })
}
