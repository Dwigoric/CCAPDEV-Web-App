import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'https://dummyjson.com'

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
    // Define search query for user
    const userParams = new URLSearchParams()
    userParams.set('limit', '0')
    userParams.set('select', 'id,username,image')

    const { users } = await fetch(`${API_URL}/users?${userParams}`)
        .then((res) => res.json())
        .catch(console.error)

    // Define search query for post search
    const searchParams = new URLSearchParams()
    searchParams.set('q', encodeURIComponent(query))
    searchParams.set('limit', '0')

    // Fetch posts
    const response = await fetch(`${API_URL}/posts/search?${searchParams}`)

    const posts = (await response.json()).posts.map((post) => {
        const user = users.find((user) => user.id === post['userId'])
        return {
            ...post,
            user
        }
    })

    // Set posts
    searchPosts.splice(0, searchPosts.length, ...posts)

    // Set fetching to false
    fetching.value = false
}
