// Import packages
import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

// Import constants
import { API_URL } from '../constants'

const searchPosts = reactive([])
const fetching = ref(false)

export const useSearchStore = defineStore('search', () => {
    return {
        search,
        searchPosts,
        fetching
    }
})

async function search(query) {
    // Define search query for post search
    const searchParams = new URLSearchParams()
    searchParams.set('q', encodeURIComponent(query))
    // TODO: Add pagination

    // Fetch posts
    const { posts, error, message } = await fetch(`${API_URL}/posts/search?${searchParams}`).then(
        (res) => res.json()
    )

    // Handle error
    if (error) {
        console.error(message)
        fetching.value = false
        return
    }

    // Set posts
    searchPosts.splice(0, searchPosts.length, ...posts)

    // Set fetching to false
    fetching.value = false
}
