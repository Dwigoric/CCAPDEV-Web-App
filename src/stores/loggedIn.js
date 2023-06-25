import { ref } from 'vue'
import { defineStore } from 'pinia'

const username = ref('')
const image = ref('')

export const useLoggedInStore = defineStore('loggedIn', () => {
    return {
        username,
        image
    }
})
