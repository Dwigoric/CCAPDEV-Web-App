import { reactive } from 'vue'
import { defineStore } from 'pinia'

const deletedPosts = reactive(new Set())

export const useDeletedPostsStore = defineStore('deletedPosts', () => {
    return {
        deletedPosts
    }
})
