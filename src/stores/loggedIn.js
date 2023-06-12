import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoggedInStore = defineStore('loggedIn', () => {
    const username = ref('')
    const password = ref('')

    return {
        username,
        password
    }
})
