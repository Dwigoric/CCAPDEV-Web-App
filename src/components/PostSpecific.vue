<script setup>
// Import packages
import { ref } from 'vue'
import router from '../router'
import moment from 'moment'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'
import { useDeletedPostsStore } from '../stores/deletedPosts'

// Define props
const props = defineProps({
    post: {
        type: Object,
        required: true,
        id: {
            type: String,
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
        edited: {
            type: Number,
            required: false,
            default: null
        },
        user: {
            type: Object,
            required: true,
            image: {
                type: String,
                required: false
            }
        }
    },
    savePost: {
        type: Function,
        required: true
    },
    deletePost: {
        type: Function,
        required: true
    }
})

// Define variables
const loggedIn = useLoggedInStore()
const { cachedPosts } = useCachedPostsStore()
const { deletedPosts } = useDeletedPostsStore()

const newTitle = ref(props.post.title)
const newBody = ref(props.post.body)
const editFlag = ref(false)
const form = ref(null)

// Define form rules
const editTitleRules = [(v) => !!v || 'Title is required']
const editBodyRules = [(v) => !!v || 'Body is required']

// Define functions

function deleteCurrentPost() {
    // TODO: Delete post from API
    deletedPosts.add(props.id)

    router.back()
}

function editPost() {
    editFlag.value = true
}

async function saveCurrentPost() {
    const { valid } = await form.value.validate()
    if (!valid) return

    editFlag.value = false

    const cachedPost = cachedPosts.find((p) => p.id === props.post.id)
    if (cachedPost) {
        cachedPost.title = newTitle.value
        cachedPost.body = newBody.value
        cachedPost.edited = Date.now()
    }

    props.savePost(newTitle.value, newBody.value)
}
</script>

<template>
    <div class="post">
        <div class="user">
            <img class="user-image" :src="post.user.image" :alt="`${post.user.username}'s image`" />
            <span class="user-name">{{ post.user.username }}</span>
            <VMenu v-if="loggedIn.id === post.user.id">
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
                    <VListItem @click="deleteCurrentPost">
                        <VListItemTitle>Delete</VListItemTitle>
                    </VListItem>
                </VList>
            </VMenu>
            <div v-if="post.edited">
                <VIcon size="x-small"> mdi-pencil </VIcon>
                <span class="edit-span">edited {{ moment(post.edited).fromNow() }}</span>
            </div>
        </div>
        <div class="content">
            <p v-if="!editFlag" class="title" id="title">{{ post.title }}</p>
            <p v-if="!editFlag" class="body" id="body">{{ post.body }}</p>
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
                <VBtn type="submit" v-if="editFlag" @click="saveCurrentPost">Save</VBtn>
            </VForm>
            <img
                class="post-image"
                v-if="post.image"
                :src="post.image"
                :alt="`An image in ${props.post.user.username}'s post`"
            />
        </div>
    </div>
</template>

<style scoped>
.post {
    padding: 1rem 2rem 2rem 2rem;
    background-color: var(--color-pale-blue);
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
}

[data-theme='light'] .post {
    background-color: var(--color-dark-pink);
    box-shadow: none;
}

[data-theme='light'] .user-image {
    background-color: var(--color-bright-pink);
    border: var(--vt-c-white) solid 3px;
}

[data-theme='light'] .user-name {
    background-color: var(--color-bright-pink);
}

.user {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
}

.user-image {
    margin-right: 5px;
    vertical-align: baseline;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-dark-green);
}

.user-name {
    margin-top: 10px;
    margin-left: 10px;
    padding: 0.2rem;
    font-size: 1rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
}

.edit-span {
    font-size: 0.8rem;
    color: var(--color-text);
    margin-left: 10px;
}

.title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 10px;
}

.body {
    text-align: justify;
    font-size: 1rem;
}

.post-image {
    display: block;
    margin-top: 25px;
    margin-left: auto;
    margin-right: auto;
    height: auto;
    max-width: 500px;
    background-color: transparent;
    border-radius: 10px;
}
</style>
