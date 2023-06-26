import { ref } from 'vue'
import { defineStore } from 'pinia'

const id = ref(-1)
const username = ref('')
const image = ref('')
const bgImage = ref('')
const description = ref('User has not placed a short description yet')

export const useLoggedInStore = defineStore('loggedIn', () => {
    return {
        id,
        username,
        image,
        bgImage,
        description
    }
})
