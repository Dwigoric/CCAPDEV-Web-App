<script setup>
defineProps({
    reactions: {
        type: Number,
        required: false,
        default: 0
    }
})
</script>

<template id="post-template">
    <div class>
        <button @click="upvote" :class="{upvoted: upvoted}">&uarr;</button>
        <span class="votes">{{ reactions }}</span>
        <button @click="downvote" :class="{downvoted: downvoted}">&darr;</button>
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

a {
  margin-left: 0.75em;
}
</style>
