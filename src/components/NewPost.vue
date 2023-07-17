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

// Define functions
const addPost = async (post) => {
    const result = await fetch(`${API_URL}/posts`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    }).then((res) => res.json())

    if (result.error) {
        console.error(result.message)
        return
    }

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

        // Read the image file
        const reader = new FileReader()
        reader.readAsDataURL(file)
        const _title = title.value
        const _body = body.value
        reader.onload = () => {
            // Add post
            addPost({ userId: loggedIn.id, title: _title, body: _body, image: reader.result })
        }
        reader.onerror = (error) => {
            console.log('Error: ', error)
        }
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
            <VTextField placeholder="Title" v-model="title" />
            <VTextarea
                placeholder="Body"
                id="new-post-body"
                active="true"
                flat="true"
                variant="solo"
                v-model="body"
                no-resize="true"
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
            <VBtn @click="processInput" :disabled="!title || !body" class="Submit"> Bake! </VBtn>
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
