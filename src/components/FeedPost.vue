<script setup>
// Import packages
import { ref } from 'vue'
import moment from 'moment'
import router from '../router'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'

// Import constants
import { API_URL } from '../constants'
import PostVote from './PostVote.vue'

// Define form rules
const editTitleRules = [(v) => !!v || 'Title is required']
const editBodyRules = [(v) => !!v || 'Body is required']

// Define variables
const loggedIn = useLoggedInStore()
const { cachedPosts } = useCachedPostsStore()
const editFlag = ref(false)
const form = ref(null)

const props = defineProps({
    id: {
        type: String,
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
    },
    edited: {
        type: Date,
        required: false,
        default: false
    }
})

const newTitle = ref(props.title)
const newBody = ref(props.body)

async function deletePost() {
    try {
        const response = await fetch(`${API_URL}/posts/${props.id}`, {
            method: 'DELETE'
        }).then((res) => res.json())

        if (response.error) {
            console.error(response.error)
        }
    } catch (error) {
        console.error(error)
    }

    const postIndex = cachedPosts.findIndex((post) => post.id === props.id)
    cachedPosts.splice(postIndex, 1)
}

function editPost() {
    editFlag.value = true
}

async function savePost() {
    const { valid } = await form.value.validate()
    if (!valid) return

    editFlag.value = false

    const post = cachedPosts.find((post) => post.id === props.id)
    post.title = newTitle.value
    post.body = newBody.value
    post.edited = Date.now()

    try {
        const response = await fetch(`${API_URL}/posts/${props.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle.value,
                body: newBody.value
            })
        }).then((res) => res.json())

        if (response.error) {
            console.error(response.error)
        }
    } catch (error) {
        console.error(error)
    }
}

function goToPost() {
    // Perform the navigation to the post route based on 'this.id'
    router.push(`/post/${props.id}`)
}
</script>

<template>
    <div class="post" id="post_id">
        <div class="user">
            <RouterLink :to="`/profile/${user['username']}`">
                <VAvatar class="user-image">
                    <VImg :src="user['image']" :alt="`${user['username']}'s image`" />
                </VAvatar>
            </RouterLink>
            <span class="user-name">{{ user['username'] }}</span>
            <VMenu v-if="loggedIn.id === user.id">
                <template v-slot:activator="{ props }">
                    <VBtn
                        v-bind="props"
                        size="large"
                        density="compact"
                        variant="text"
                        icon="mdi-dots-vertical"
                    >
                    </VBtn>
                </template>
                <VList>
                    <VListItem @click="editPost">
                        <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>
                    <VListItem @click="deletePost">
                        <VListItemTitle>Delete</VListItemTitle>
                    </VListItem>
                </VList>
            </VMenu>
            <div v-if="edited">
                <VIcon size="x-small"> mdi-pencil </VIcon>
                <span class="edit-span">edited {{ moment(edited).fromNow() }}</span>
            </div>
        </div>
        <div class="content" @click="goToPost">
            <p v-if="!editFlag" class="title" id="title">{{ title }}</p>
            <p v-if="!editFlag" class="body" id="body">{{ body }}</p>
            <VForm @submit.prevent ref="form">
                <VTextField
                    v-if="editFlag"
                    v-model="newTitle"
                    :rules="editTitleRules"
                    validate-on="input lazy"
                    placeholder="Enter new title..."
                />
                <VTextarea
                    v-if="editFlag"
                    v-model="newBody"
                    :rules="editBodyRules"
                    validate-on="input lazy"
                    placeholder="What's up?"
                    no-resize=""
                />
                <VBtn type="submit" v-if="editFlag" @click="savePost">Save</VBtn>
            </VForm>
            <img
                v-if="image"
                class="post-image"
                :src="image"
                :alt="`An image in ${user['username']}'s post`"
            />
        </div>
        <div class="post-footer">
            <PostVote :id="id" style="z-index: 2; position: absolute" />
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
    width: 100%;
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

.edit-span {
    font-size: 0.8rem;
    color: var(--color-text);
    margin-left: 10px;
}

.content {
    width: 100%;
    margin-bottom: 2.5rem;
    text-decoration: none;
    color: var(--color-text);
    cursor: pointer;
}

.title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.body {
    width: 100%;
    white-space: pre-wrap;
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

.content {
    color: var(--color-text);
    text-decoration: none;
}

svg path:hover {
    fill: var(--color-dark-pink);
}

svg {
    pointer-events: none;
}
</style>
