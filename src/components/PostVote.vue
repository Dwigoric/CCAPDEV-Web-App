<script setup>
import { onMounted, ref } from 'vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useVoteStore } from '../stores/votes'

// Import constants
import { API_URL } from '../constants'

// Define variables
const { id: userId } = useLoggedInStore()
const { votes } = useVoteStore()

const vote = ref(0)
const reactions = ref(0)

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})
// Define functions
async function callAPI() {
    try {
        const { token } = window.$cookies.get('credentials')

        const { error, message } = await fetch(`${API_URL}/votes/${props.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                vote: vote.value
            })
        }).then((res) => res.json())

        if (error) {
            console.error(message)
        }
    } catch (error) {
        console.error(error)
    }
}

function upvote() {
    if (!userId) return

    if (vote.value > 0) {
        vote.value = 0
        reactions.value -= 1
    } else if (vote.value < 0) {
        vote.value = 1
        reactions.value += 2
    } else {
        vote.value = 1
        reactions.value += 1
    }

    votes[props.id] = reactions.value

    callAPI()
}

function downvote() {
    if (!userId) return

    if (vote.value < 0) {
        vote.value = 0
        reactions.value += 1
    } else if (vote.value > 0) {
        vote.value = -1
        reactions.value -= 2
    } else {
        vote.value = -1
        reactions.value -= 1
    }

    votes[props.id] = reactions.value

    callAPI()
}

async function callVoteNum() {
    const params = new URLSearchParams()
    params.set('userId', userId)

    const {
        error,
        message,
        reactions: postReactions,
        userVote
    } = await fetch(`${API_URL}/votes/${props.id}?${params}`).then((res) => res.json())

    reactions.value = postReactions
    vote.value = userVote

    // Store vote in store
    votes[props.id] = postReactions

    if (error) {
        console.error(message)
    }
}

onMounted(callVoteNum)
</script>

<template>
    <VHover v-slot="{ isHovering, props }">
        <VBtn
            class="ma-1 upvote"
            v-bind="props"
            :color="isHovering || vote > 0 ? 'deep-orange-darken-1' : 'blue-grey-lighten-1'"
            density="compact"
            variant="text"
            icon="mdi-arrow-up-circle-outline"
            @click="upvote(id)"
        >
        </VBtn>
    </VHover>
    <span class="reaction-number">{{ reactions }}</span>
    <VHover v-slot="{ isHovering, props }">
        <VBtn
            class="ma-1 downvote"
            v-bind="props"
            :color="isHovering || vote < 0 ? 'blue-darken-3' : 'blue-grey-lighten-1'"
            density="compact"
            variant="text"
            icon="mdi-arrow-down-circle-outline"
            @click="downvote(id)"
        >
        </VBtn>
    </VHover>
</template>

<style scoped>
.reaction-number {
    justify-self: center;
}
</style>
