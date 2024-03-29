<script setup>
// Import packages
import { ref } from 'vue'
import router from '../router'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'
import { useMediaQuery } from '@vueuse/core'

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
        deleted: {
            type: Boolean,
            required: false,
            default: false
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

const newTitle = ref(props.post.title)
const newBody = ref(props.post.body)
const editFlag = ref(false)
const form = ref(null)

// Define form rules
const editTitleRules = [(v) => !!v || 'Title is required']
const editBodyRules = [(v) => !!v || 'Body is required']

// Define functions

function deleteCurrentPost() {
    props.deletePost(props.post.id)

    cachedPosts.splice(
        cachedPosts.findIndex((p) => p.id === props.post.id),
        1
    )

    router.push({ name: 'feed' })
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

    props.savePost({ title: newTitle.value, body: newBody.value })
}
</script>

<template>
    <div class="post">
        <div class="user">
            <VAvatar class="user-image">
                <VImg
                    v-if="!post.deleted"
                    :src="post.user.image"
                    :alt="`${post.user.username}'s image`"
                    @click="
                        router.push({ name: 'profile', params: { username: post.user.username } })
                    "
                />
                <VIcon v-else>mdi-account-remove</VIcon>
            </VAvatar>
            <span class="user-name">{{ post.user.username }}</span>
            <VMenu v-if="loggedIn.id === post.user.id">
                <template v-slot:activator="{ props }">
                    <VBtn
                        v-bind="props"
                        size="large"
                        density="compact"
                        variant="text"
                        icon="mdi-dots-vertical"
                        class="ml-5"
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
            <VSpacer></VSpacer>
            <VBtn
                v-if="useMediaQuery('(min-width: 1024px)').value"
                variant="text"
                size="large"
                density="compact"
                @click="router.push({ name: 'feed' })"
            >
                Go Back
                <VIcon>mdi-arrow-left-circle</VIcon>
            </VBtn>
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
    max-width: 100vw;
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
    cursor: pointer;
}

.user-name {
    margin-left: 10px;
    padding: 0.2rem;
    font-size: 1rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
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
    white-space: pre-wrap;
}

.post-image {
    flex-basis: 30rem;
    background-color: transparent;
    border-radius: 10px;
    justify-self: center;
    margin: 20px auto 0;
    max-width: min(100%, 500px);
}
</style>
