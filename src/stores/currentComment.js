import { ref } from 'vue'
import { defineStore } from 'pinia'

const currentComment = ref(null)

export const useCurrentCommentStore = defineStore('currentComment', () => {
    return {
        currentComment,
        setCurrentComment
    }
})

export function setCurrentComment(comment) {
    currentComment.value = comment
}
