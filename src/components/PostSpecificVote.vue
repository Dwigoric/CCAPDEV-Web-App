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
        <button id="up" @click="upvote" class="upvoted">&uarr;</button>
        <span class="votes">{{ count + reactions }}</span>
        <button id="down" @click="downvote" class="downvoted">&darr;</button>
    </div>
</template>

<style>
.button {
  &:hover {
    cursor: pointer;
  }
  
  &:focus {
    background-color: #9494FF;
  }

  &:visited {
    background-color: #9494FF;
    color: white;
  }
}

.votes {
  display: inline-block;
  text-align: center;
  width: 1.5em;
}

.upvoted:focus {
  background-color: #FF8B60;
  color: white;
}

.downvoted:focus {
  background-color: #9494FF;
  color: white;
}
</style>
