import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoggedInStore = defineStore('loggedIn', () => {
    const id = ref('')
    const username = ref('')
    const image = ref('')
    const bgImage = ref('')
    const description = ref('User has not placed a short description yet')

    return {
        id,
        username,
        image,
        bgImage,
        description
    }
})
