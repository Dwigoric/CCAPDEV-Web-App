// Import packages
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useVoteStore = defineStore('voteCount', () => {
    // This is a map of user votes.
    // The key is the user ID and the value is an array of vote records.
    // Each vote record is an object with a postId and a vote value.
    const votes = reactive({})

    return {
        votes
    }
})
