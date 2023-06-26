<script setup>
import { ref } from 'vue'

// Import components
import PostComment from './PostComment.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCommentsStore } from '../stores/comments'
import { useCurrentCommentStore } from '../stores/currentComment'
import { VTextarea } from 'vuetify/lib/components/index.mjs'

// Define variables
const loggedInStore = useLoggedInStore()
const commentsStore = useCommentsStore()
const currentCommentStore = useCurrentCommentStore()

const newReplyBody = ref('')
const newComment = ref('')

const editFlag = ref(false);
const deleteFlag = ref(false);

// Define functions
function addReply(parentCommentId) {
    if (newReplyBody.value) {
        commentsStore.addComment({
            body: newReplyBody.value,
            parentCommentId,
            user: {
                username: loggedInStore.username,
                image: loggedInStore.image
            }
        })

        newReplyBody.value = ''
    }
}

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    postId: {
        type: Number,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    onclick: {
        type: Function,
        required: false
    }
})

function deleteComment() {
    deleteFlag.value = true;
    const comment = commentsStore.comments.find(cm => cm.id === props.id);
    comment.body = "Comment have been deleted";
}

function editComment() {
    editFlag.value = true;
}

function saveComment() {
    editFlag.value = false ;
    const comment = commentsStore.comments.find(cm => cm.id === props.id);
    comment.body = newComment.value;
}

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
</script>

<template>
    <div class="comment">
        <div class="main-comment" @click="onclick(id)">
            <div class="user">
                <img class="user-image" :src="user['image']" :alt="`${user['username']}'s image`" />
                <div class="user-name">{{ user['username'] }}</div>
            </div>
            <div class="content">
                <p v-if="!editFlag" class="body">{{ body }}</p>
                <p v-else-if="deleteFlag" class="body"> Comment have been deleted </p>
                <VTextarea
                    v-else
                    class="new-reply-input"
                    placeholder="Enter a new comment..."
                    v-model="newComment"
                    />
                    
                <v-btn 
                    v-if="editFlag && !deleteFlag" 
                    
                    @click="saveComment" 
                    icon="mdi-send"
                >
                </v-btn>
            </div>
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
                    <v-btn @click="editComment"> Edit </v-btn>
                    <v-btn @click="deleteComment"> Delete</v-btn>
                </div>
            </div>
        </div>
        
        <VTextarea
            placeholder="Reply to this comment..."
            class="new-reply-input"
            active="true"
            v-if="loggedInStore.username && id === currentCommentStore.currentComment"
            v-model="newReplyBody"
            no-resize=""
            rows="1"
            append-icon="mdi-send"
            @click:append="addReply(id)"
        />
        <div class="replies">
            <PostComment
                v-for="reply in commentsStore.comments.filter(
                    (comment) => comment.parentCommentId === id
                )"
                :key="reply.id"
                :id="reply.id"
                :post-id="postId"
                :user="reply.user"
                :body="reply.body"
                :onclick="onclick"
            >
            </PostComment>
        </div>
        <div>
            
        </div>
    </div>
</template>

<style scoped>
.comment {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    flex-grow: 1;
    width: calc(100% - 3px);
    height: 100%;
    padding: 0.5rem 0 0 0.5rem;
    margin-left: 13px;
    background-color: var(--color-background-soft);
    border-left: var(--color-border) solid 3px;
}

[data-theme='light'] .user-image {
    background-color: var(--color-dark-pink);
    border: var(--color-border) solid 3px;
}

.main-comment {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.main-comment:hover {
    background-color: var(--color-background-mute);
}

.user {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    height: 100%;
}

.user-image {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-background-mute);
}

.user-name {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 0.2rem;
    border-radius: 5px;
    color: var(--color-bright-blue);
}

.body {
    width: 100%;
}

.replies {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    flex-basis: 100%;
    background-color: var(--color-background-soft);
}

.new-reply-input {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
}

svg {
    pointer-events: none;
}

.content {
    display: flex;
    flex-flow: row;
}

/* background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHBhdGggZmlsbD0iIzg4ODg4OCIgZD0iTTE1NiAxMjhhMjggMjggMCAxIDEtMjgtMjhhMjggMjggMCAwIDEgMjggMjhabS0yOC01MmEyOCAyOCAwIDEgMC0yOC0yOGEyOCAyOCAwIDAgMCAyOCAyOFptMCAxMDRhMjggMjggMCAxIDAgMjggMjhhMjggMjggMCAwIDAtMjgtMjhaIi8+PC9zdmc+); */
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
