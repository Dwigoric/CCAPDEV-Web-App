import { reactive } from 'vue'
import { defineStore } from 'pinia'

const tempPosts = reactive([])

export const useTempPostsStore = defineStore('tempPosts', () => {
    return {
        tempPosts
    }
})
