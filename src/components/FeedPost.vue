<script setup>
// Import stores
import { useSpecificPostStore } from '../stores/currentPost'
import { useVoteStore } from '../stores/votes'
import { useCachedPostsStore } from '../stores/cachedPosts'
import { ref } from 'vue';

// Define variables
const voteStore = useVoteStore()

// Define variables
const { cachedPosts } = useCachedPostsStore()
const postStore = useSpecificPostStore()
const editFlag = ref(false);

const newTitle = ref('')
const newBody = ref('')

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    reactions: {
        type: Number,
        required: false,
        default: 0
    }
})

/* toggle between hiding and showing the dropdown content */
function openDropdown() {
     document.getElementById("Dropdownlist").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
     if (!event.target.matches('.dropbutton')) {
          var dropdowns = document.getElementsByClassName("dropdown-content");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
               if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                    }
               }
          }
}

function setPost() {
    postStore.setCurrentPost({
        id: props.id,
        user: props.user,
        title: props.title,
        body: props.body,
        image: props.image,
        reactions: props.reactions
    })
}

function deletePost() {
    cachedPosts.splice(cachedPosts.findIndex(post => post.id === props.id), 1)
}

function editPost() {
     editFlag.value = true;
}

function savePost() {
    editFlag.value = false;

    const post = cachedPosts.find(post => post.id === props.id);
    post.title = newTitle.value
    post.body = newBody.value
}


</script>

<template>
    <div class="post" id="post_id">
        <div class="user">
            <img class="user-image" :src="user['image']" :alt="`${user['username']}'s image`" />
            <span class="user-name">{{ user['username'] }}</span>
            <div class="dropdown">
                <v-btn
                    @click="openDropdown()"
                    class="dropbutton"
                    size="large"
                    density="compact"
                    variant="text"
                    icon="mdi-dots-vertical"
                >
                </v-btn>
                <div id="Dropdownlist" class="dropdown-content">
                    <v-btn @click="editPost"> Edit </v-btn>
                    <v-btn @click="deletePost"> Delete</v-btn>
                </div>
            </div> 
        </div>
        <div class="content">
            <p v-if="!editFlag" class="title" id="title">{{ title }}</p>
            <VTextField
                v-else
                v-model="newTitle"
                placeholder="Enter new title..."
            />
            <p v-if="!editFlag" class="body" id="body">{{ body }}</p>
            <VTextarea
                v-else
                v-model="newBody"
                placeholder="What's up?"
                no-resize
            />
            <img
                v-if="image && !editFlag"
                class="post-image"
                :src="image"
                :alt="`An image in ${user['username']}'s post`"
            />
            <button v-if="editFlag" class="savebutton" @click="savePost" > Save </button>
        </div>

        <div class="post-footer">
            <VHover v-slot="{ isHovering, props }">
                <VBtn
                    class="ma-1 upvote"
                    v-bind="props"
                    :color="
                        isHovering || voteStore.getVoteCount(id) > 0
                            ? 'deep-orange-darken-1'
                            : 'blue-grey-lighten-1'
                    "
                    density="compact"
                    variant="text"
                    icon="mdi-arrow-up-circle-outline"
                    @click="voteStore.upvote(id)"
                >
                </VBtn>
            </VHover>
            <span>{{ reactions + voteStore.getTotalVotes(id) }}</span>
            <VHover v-slot="{ isHovering, props }">
                <VBtn
                    class="ma-1 downvote"
                    v-bind="props"
                    :color="
                        isHovering || voteStore.getVoteCount(id) < 0
                            ? 'blue-darken-3'
                            : 'blue-grey-lighten-1'
                    "
                    density="compact"
                    variant="text"
                    icon="mdi-arrow-down-circle-outline"
                    @click="voteStore.downvote(id)"
                >
                </VBtn>
            </VHover>
            <VBtn
                to="/post"
                @click="setPost"
                class="comment-icon ma-1 ml-2"
                density="compact"
                variant="text"
                color="teal-darken-2"
                icon="mdi-comment-text-multiple-outline"
            >
            </VBtn>
        </div>
    </div>
</template>

<style scoped>
.post {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: left;
    width: 100%;
    height: 100%;
    padding: 2rem;
    background-color: var(--color-pale-blue);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
    position: relative;
}

[data-theme='light'] .post {
    background-color: var(--color-bright-pink);
    box-shadow: none;
}

[data-theme='light'] .user-image {
    background-color: var(--color-dark-pink);
    border: var(--color-pale-green) solid 3px;
}

[data-theme='light'] .user-name {
    background-color: var(--color-dark-pink);
}

.user {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 100px;
    gap: 1rem;
    margin-bottom: 10px;
}

.user-image {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-dark-green);
}

.user-name {
    padding: 0.2rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
}

.content {
    width: 100%;
    margin-bottom: 2.5rem;
    text-decoration: none;
    color: var(--color-text);
}

.title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.body {
    width: 100%;
}

.post-image {
    flex-basis: 30rem;
    background-color: transparent;
    border-radius: 10px;
    justify-self: center;
    margin: 20px auto 0;
    max-width: 300px;
}

@media (min-width: 1024px) {
    .post-image {
        max-width: 500px;
    }
}

.post-footer {
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    bottom: 2rem;
}

.content,
.comment-icon {
    color: var(--color-text);
    text-decoration: none;
}

svg path:hover {
    fill: var(--color-dark-pink);
}


svg {
    pointer-events: none;
}

.dropbutton {
  background-color: rgba(0, 0, 0, 0);
  background-size: 100%;
  width: auto;
  color: var(--color-text);
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbutton:hover {
    
    background-size: 100%;
}

/* The container location */
.dropdown {
  margin-left: auto;
}
/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}
/* Links inside the dropdown */
.dropdown-content button {
  background-color: var(--color-dark-green);
  color: var(--color-text);
  width: 100%;
  text-decoration: none;
  padding: 12px 16px;
  display: block;
  text-align: left;
}

/* Change color of dropdown links on hover */
.dropdown-content button:hover {background-color: var(--color-background-mute)}

/* Show the dropdown menu*/
.dropdown:hover .dropdown-content {
  display: block;
}

.savebutton {
    background-color: var(--color-dark-green);
    padding: 0.2em;
    margin-top: 1em;

}

.savebutton:hover {
    background-color: var(--color-background-mute);
}
</style>
