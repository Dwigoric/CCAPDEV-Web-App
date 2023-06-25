import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVoteStore = defineStore('count', () => {
  const count = ref(0)
  var isUpvoted = false;
  var isDownvoted = false;

const upvote = () => {
  if(isUpvoted == false) {
    if(isDownvoted == true) {
      isDownvoted = false;
      count.value++;
    }
    count.value++;
    isUpvoted = true;
  }
  else {
    isUpvoted = false;
    count.value--;
  }
}

const downvote = () => {
  if(isDownvoted == false) {
    if(isUpvoted == true) {
      isUpvoted = false;
      count.value--;
    }
    count.value--;
    isDownvoted = true;
  }
  else {
    isDownvoted = false;
    count.value++;
  }
}


return {
  count,
  upvote,
  downvote
}
})