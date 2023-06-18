import { defineStore } from 'pinia'

const API_URL = 'https://dummyjson.com/'

export const pinia = defineStore('posts', async () => {
    const params = new URLSearchParams()
    params.set('select', 'id,username,image')

    const { users } = await fetch(`${API_URL}/users?${params}`)
        .then((res) => res.json())
        .catch(console.error)

    const posts = await fetch(`${API_URL}/posts`)
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
        .catch(console.error)

    return {
        posts
    }
})
