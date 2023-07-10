<script setup>
// Import packages
import { ref } from 'vue'

// Import stores
import { useTempPostsStore } from '../stores/tempPosts'
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'

// Define variables
const { tempPosts } = useTempPostsStore()
const loggedIn = useLoggedInStore()
const { cachedPosts } = useCachedPostsStore()
const title = ref('')
const body = ref('')
const files = ref([])
const inputImage = ref(null)

// Define functions
const addPost = (post) => {
    tempPosts.push({
        ...post,
        id: cachedPosts.length === 0 ? 0 : cachedPosts[cachedPosts.length - 1].id + 1,
        reactions: 0,
        user: {
            id: loggedIn.id,
            username: loggedIn.username,
            image: loggedIn.image
        }
    })
    cachedPosts.push(tempPosts[tempPosts.length - 1])
}

// Preprocess input
const processInput = () => {
    if (!inputImage.value || !inputImage.value.files || !inputImage.value.files.length) {
        addPost({ title: title.value, body: body.value, image: null })
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
            addPost({ title: _title, body: _body, image: reader.result })
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
