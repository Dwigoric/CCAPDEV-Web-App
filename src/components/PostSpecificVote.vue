<script setup>
import { storeToRefs } from 'pinia';
import { useVoteStore } from '../stores/vote'

const VoteStore = useVoteStore();
const { upvote, downvote } = VoteStore;
const { count } = storeToRefs(VoteStore);

defineProps({
    reactions: {
        type: Number,
        required: false,
        default: 0
    }
})
</script>

<template>
    <div>
        <button @click="upvote" :class="upvoted">&uarr;</button>
        <span class="votes">{{ count + reactions }}</span>
        <button @click="downvote" :class="downvoted">&darr;</button>
    </div>
</template>

<style>
button {
  &:hover {
    cursor: pointer;
  }
  
  &:focus {
    outline: none;
  }
}

.votes {
  display: inline-block;
  text-align: center;
  width: 1.5em;
}

.upvoted {
  background-color: #FF8B60;
  color: white;
}

.downvoted {
  background-color: #9494FF;
  color: white;
}
</style>
