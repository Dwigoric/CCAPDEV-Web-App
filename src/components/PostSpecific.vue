<script setup>
import { ref } from 'vue'
import router from '../router'

import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'
import { useDeletedPostsStore } from '../stores/deletedPosts'
import { useSpecificPostStore } from '../stores/currentPost'

const loggedIn = useLoggedInStore()
const { cachedPosts } = useCachedPostsStore()
const { deletedPosts } = useDeletedPostsStore()
const { currentPost, currentPostId } = useSpecificPostStore()

const newTitle = ref('')
const newBody = ref('')
const editFlag = ref(false)

const editTitleRules = [(v) => !!v || 'Title is required']
const editBodyRules = [(v) => !!v || 'Body is required']

function deletePost() {
    deletedPosts.add(currentPostId)

    router.back()
}

function editPost() {
    editFlag.value = true
}

function savePost() {
    editFlag.value = false

    const cachedPost = cachedPosts.find((p) => p.id === currentPostId)
    cachedPost.title = newTitle.value
    cachedPost.body = newBody.value

    currentPost.title = newTitle.value
    currentPost.body = newBody.value
}
</script>

<template>
    <div class="post">
        <div class="user">
            <img
                class="user-image"
                :src="currentPost.user.image"
                :alt="`${currentPost.user.username}'s image`"
            />
            <span class="user-name">{{ currentPost.user.username }}</span>
            <VMenu v-if="loggedIn.id === currentPost.user.id">
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
        </div>
        <div class="content">
            <p v-if="!editFlag" class="title" id="title">{{ currentPost.title }}</p>
            <VTextField
                v-else
                :rules="editTitleRules"
                v-model="newTitle"
                placeholder="Enter new title..."
            />
            <p v-if="!editFlag" class="body" id="body">{{ currentPost.body }}</p>
            <VTextarea
                v-else
                :rules="editBodyRules"
                v-model="newBody"
                placeholder="What's up?"
                no-resize=""
            />
            <img
                class="post-image"
                v-if="currentPost.image"
                :src="currentPost.image"
                :alt="`An image in ${currentPost.user.username}'s post`"
            />
            <VBtn v-if="editFlag" @click="savePost">Save</VBtn>
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
