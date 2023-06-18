import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useIsDarkStore = defineStore('isDark', () => {
    const isDark = ref(false)

    return {
        isDark
    }
})
