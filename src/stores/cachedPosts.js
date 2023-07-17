import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { API_URL } from '../constants'

const cachedPosts = reactive([])
const loadedAllPosts = ref(false)

export const useCachedPostsStore = defineStore('cachedPosts', () => {
    return {
        cachedPosts,
        fetchPosts,
        loadedAllPosts
    }
})

async function fetchPosts() {
    const postParams = new URLSearchParams()
    postParams.set('limit', '20')
    postParams.set('last', String(cachedPosts[0] ? cachedPosts[0].date : Date.now()))

    try {
        const { posts, loadedAll } = await fetch(`${API_URL}/posts?${postParams}`).then((res) =>
            res.json()
        )
        console.log(loadedAll)
        cachedPosts.unshift(...posts.reverse())
        loadedAllPosts.value = loadedAll
    } catch (err) {
        console.error(err)
    }
}
