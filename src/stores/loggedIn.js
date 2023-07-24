import { ref } from 'vue'
import { defineStore } from 'pinia'

import { API_URL } from '../constants'

export const useLoggedInStore = defineStore('loggedIn', () => {
    const id = ref('')
    const username = ref('')
    const image = ref('')
    const description = ref('User has not placed a short description yet')

    return {
        id,
        username,
        image,
        description,
        async fetchUser() {
            const response = await fetch(`${API_URL}/users/${id.value}`)
            const { user } = await response.json()

            username.value = user.username
            image.value = user.image
            description.value = user.description
        }
    }
})
