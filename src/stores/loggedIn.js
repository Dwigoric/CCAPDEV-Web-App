import { ref } from 'vue'
import { defineStore } from 'pinia'

const id = ref('')
const username = ref('')
const image = ref('')
const bgImage = ref('')

export const useLoggedInStore = defineStore('loggedIn', () => {
    return {
        id,
        username,
        image,
        bgImage
    }
})
