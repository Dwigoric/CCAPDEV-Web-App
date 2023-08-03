<script setup>
// Import packages
import { ref } from 'vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'

// Import constants
import { API_URL } from '../constants'

// Define variables
const loggedIn = useLoggedInStore()
const { cachedPosts } = useCachedPostsStore()
const title = ref('')
const body = ref('')
const files = ref([])
const inputImage = ref(null)
const processing = ref(false)

// Define form rules
const titleRules = [
    (v) => !!v || 'Title cannot be empty'
]
const bodyRules = [
    (v) => !!v || 'Body cannot be empty'
]

// Define functions
const addPost = async (post) => {
    processing.value = true

    const payload = new FormData()
    payload.append('title', post.title)
    payload.append('body', post.body)
    if (post.image) {
        payload.append('image', post.image)
    }

    const { token } = window.$cookies.get('credentials')

    const result = await fetch(`${API_URL}/posts`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: payload
    }).then((res) => res.json())

    if (result.error) {
        console.error(result.message)
        processing.value = false
        return
    }

    processing.value = false
    // Add post to cached posts
    cachedPosts.push(result.post)
}

// Preprocess input
const processInput = () => {
    if (!inputImage.value || !inputImage.value.files || !inputImage.value.files.length) {
        addPost({ userId: loggedIn.id, title: title.value, body: body.value, image: null })
    } else {
        // Retrieve image input file
        const file = inputImage.value.files[0]
        addPost({ userId: loggedIn.id, title: title.value, body: body.value, image: file })
    }

    // Reset form
    title.value = ''
    body.value = ''
    files.value = []
}
</script>

<template>
    <VContainer>
        <VForm>
            <VTextField placeholder="Title" v-model="title" :rules="titleRules" />
            <VTextarea
                placeholder="Body"
                id="new-post-body"
                active="true"
                flat="true"
                variant="solo"
                v-model="body"
                no-resize="true"
                :rules="bodyRules"
            />
            <VFileInput
                label="Insert image"
                variant="outlined"
                clearable="clearable"
                accept="image/*"
                v-model="files"
                prepend-icon="mdi-camera"
                ref="inputImage"
            ></VFileInput>
            <VBtn
                @click="processInput"
                :disabled="!title || !body"
                :loading="processing"
                class="Submit"
            >
                Bake!
            </VBtn>
        </VForm>
    </VContainer>
</template>

<style scoped>
.v-form {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 2rem;
    background: var(--color-pale-green);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
}

[data-theme='light'] .v-form {
    background-color: var(--color-dark-pink);
    box-shadow: none;
}

.v-text-field {
    width: 100%;
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: 700;
}

.v-textarea {
    width: 100%;
    border-radius: 5px;
    border: none;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-dark-pink);
    outline: none;
}

.v-file-input {
    width: 100%;
}

.v-btn {
    align-self: center;
    padding: 0.5rem;
    border-radius: 5px;
    font-weight: 700;
    color: var(--color-text);
    background: var(--color-dark-pink);
    cursor: pointer;
}

[data-theme='light'] .v-btn {
    background-color: var(--color-bright-blue);
    color: white;
}
</style>
