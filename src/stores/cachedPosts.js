import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

const API_URL = 'https://dummyjson.com'

const cachedPosts = reactive([])
const skip = ref(130)
const limit = 20
const loadedAllPosts = ref(false)

export const useCachedPostsStore = defineStore('cachedPosts', () => {
    return {
        cachedPosts,
        fetchPosts,
        loadedAllPosts
    }
})

async function fetchPosts() {
    if (loadedAllPosts.value) return

    const userParams = new URLSearchParams()
    userParams.set('limit', '0')
    userParams.set('select', 'id,username,image')

    const { users } = await fetch(`${API_URL}/users?${userParams}`)
        .then((res) => res.json())
        .catch(console.error)

    const postParams = new URLSearchParams()
    postParams.set('skip', String(skip.value))
    postParams.set('limit', String(limit))

    skip.value -= limit

    cachedPosts.unshift(
        ...(await fetch(`${API_URL}/posts?${postParams}`)
            .then((res) => res.json())
            .then((res) =>
                res['posts'].map((post) => {
                    const user = users.find((user) => user.id === post['userId'])
                    return {
                        ...post,
                        user
                    }
                })
            )
            .catch(console.error))
    )

    if (cachedPosts.length >= 150) {
        loadedAllPosts.value = true
    }
}
