// Import packages
import { defineStore } from 'pinia'
import { reactive } from 'vue'

// Import logged in store
import { useLoggedInStore } from './loggedIn.js'

export const useVoteStore = defineStore('voteCount', () => {
    // Define store
    const loggedInStore = useLoggedInStore()

    // This is a map of user votes.
    // The key is the user ID and the value is an array of vote records.
    // Each vote record is an object with a postId and a vote value.
    const votes = reactive({})

    const getVoteRecord = (postId) => {
        const userId = loggedInStore.id
        if (!(userId in votes)) votes[userId] = []

        const userVotes = votes[userId]
        return userVotes.find((voteRecord) => voteRecord.postId === postId)
    }

    const upvote = (postId) => {
        // Check if user is logged in
        if (loggedInStore.id === -1) return

        const voteRecord = getVoteRecord(postId)

        if (voteRecord) voteRecord.vote = voteRecord.vote === 1 ? 0 : 1
        else votes[loggedInStore.id].push({ postId, vote: 1 })
    }

    const downvote = (postId) => {
        // Check if user is logged in
        if (loggedInStore.id === -1) return

        const voteRecord = getVoteRecord(postId)

        if (voteRecord) voteRecord.vote = voteRecord.vote === -1 ? 0 : -1
        else votes[loggedInStore.id].push({ postId, vote: -1 })
    }

    const getVoteCount = (postId) => {
        const voteRecord = getVoteRecord(postId)
        if (!voteRecord) return 0

        return voteRecord.vote
    }

    const getTotalVotes = (postId) => {
        let totalVotes = 0

        for (const userId in votes) {
            if (userId === loggedInStore.id) continue

            const voteRecord = votes[userId].find((voteRecord) => voteRecord.postId === postId)
            if (!voteRecord) continue

            totalVotes += voteRecord.vote
        }

        return totalVotes
    }

    return {
        upvote,
        downvote,
        getVoteCount,
        getTotalVotes
    }
})
