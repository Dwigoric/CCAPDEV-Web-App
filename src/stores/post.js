import { ref } from 'vue'
import { defineStore } from 'pinia'
const id = ref('')
const title = ref('')
const body = ref('')
const user = ref('')

export const useSpecificPostStore = defineStore('post', () => {

    return {
        id, 
        title, 
        body, 
        user,
        setCurrentPost
    }
})

function setCurrentPost (post){
    console.log(post)
}
