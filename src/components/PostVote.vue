<script setup>
import { onMounted, ref } from 'vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'

// Import constants
import { API_URL } from '../constants'

// Define variables
const { id: userId } = useLoggedInStore()

const vote = ref(0)

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    reactions: {
        type: Number,
        required: true
    }
})
// Define functions
async function callAPI() {
    try {
        const { error, message } = await fetch(`${API_URL}/votes/${props.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postId: props.id,
                userId,
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
    } else {
        vote.value = 1
    }

    callAPI()
}

function downvote() {
    if (!userId) return

    if (vote.value < 0) {
        vote.value = 0
    } else {
        vote.value = -1
    }

    callAPI()
}

async function callVoteNum() {
    const params = new URLSearchParams()
    params.set('userId', userId)

    const { error, message, reactions } = await fetch(
        `${API_URL}/votes/${props.id}?${params}`
    ).then((res) => res.json())

    vote.value = reactions

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
    <span>{{ reactions + vote }}</span>
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

<style scoped></style>
