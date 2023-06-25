import { reactive } from 'vue'
import { defineStore } from 'pinia'

const comments = reactive([])

export const useCommentsStore = defineStore('comments', () => {
    return {
        comments
    }
})
