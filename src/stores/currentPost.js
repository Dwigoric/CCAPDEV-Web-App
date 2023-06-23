import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

const currentPost = reactive({})
const currentPostId = ref(null)

export const useSpecificPostStore = defineStore('post', () => {
    return {
        currentPost,
        currentPostId,
        setCurrentPost,
        unsetCurrentPost
    }
})

function setCurrentPost(post) {
    currentPost.image = ''
    Object.assign(currentPost, post)
    currentPostId.value = post.id
}

function unsetCurrentPost() {
    currentPost.image = ''
    Object.assign(currentPost, {})
    currentPostId.value = null
}
