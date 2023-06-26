<script setup>
import { storeToRefs } from 'pinia'
import { useVoteStore } from '../stores/vote'

const VoteStore = useVoteStore()
const { upvote, downvote } = VoteStore
const { count } = storeToRefs(VoteStore)

defineProps({
    reactions: {
        type: Number,
        required: false,
        default: 0
    }
})
</script>

<template>
    <div id="placeholder">
        <div v-if="count == 1" class="voted"> 
            <button @click="upvote">&uarr;</button>
        </div>
        <div v-if="count < 1" class="notvoted"> 
            <button @click="upvote">&uarr;</button>
        </div>
        
        <div class="votes">{{ count + reactions }}</div>

        <div v-if="count == -1" class="voted">
            <button @click="downvote">&darr;</button>
        </div>
        <div v-if="count > -1" class="notvoted">
            <button @click="downvote">&darr;</button>
        </div>
    </div>
</template>

<style scoped>

#placeholder {
    display: flex;
}

.notvoted {
    display: flex;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
}
    
.button {
    &:hover {
        cursor: pointer;
    }

    &:focus {
        background-color: #9494ff;
    }

    &:visited {
        background-color: #9494ff;
        color: white;
    }
}

.votes {
    display: flex;
    justify-content: center;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    text-align: center;
    height: 1.5rem;
    width: 1.5em;
}

[data-theme='light'] .voted {
    display: flex;
    justify-content: center;
    background-color: #ff8b60;
    color: white;
    width: 1.5rem;
    height: 1.5rem;
}

.voted {
    display: flex;
    justify-content: center;
    background-color: #9494ff;
    color: white;
    width: 1.5rem;
    height: 1.5rem;
}
</style>
