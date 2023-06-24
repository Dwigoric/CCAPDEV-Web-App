<script setup>
// Import packages
import { ref } from 'vue'

// Import stores
import { useIsDarkStore } from '../stores/is-dark'

// Define variables
const { isDark } = useIsDarkStore()

const title = ref('')
const body = ref('')
const filename = ref([])

const props = defineProps({
    addPost: {
        type: Function,
        required: true
    }
})

// Preprocess input
const processInput = (ref) => {
    if (!ref.files.length) {
        props.addPost({ title: title.value, body: body.value, image: null })
    } else {
        // Retrieve image input file
        const file = ref.files[0]

        // Read the image file
        const reader = new FileReader()
        reader.readAsDataURL(file)
        const _title = title.value
        const _body = body.value
        reader.onload = () => {
            // Add post
            props.addPost({ title: _title, body: _body, image: reader.result })
        }
        reader.onerror = (error) => {
            console.log('Error: ', error)
        }
    }

    // Reset form
    title.value = ''
    body.value = ''
    filename.value = []
    ref.reset()
}
</script>

<template>
    <VForm>
        <VTextField
            type="text"
            placeholder="Title"
            v-model="title"
            :theme="isDark ? 'dark' : 'light'"
        />
        <VTextarea
            placeholder="Body"
            id="new-post-body"
            v-model="body"
            :no-resize="true"
            :theme="isDark ? 'dark' : 'light'"
        ></VTextarea>
        <VFileInput
            label="Insert image"
            variant="outlined"
            clearable="clearable"
            accept="image/*"
            v-model="filename"
            prepend-icon="mdi-camera"
            ref="inputImage"
        ></VFileInput>
        <VBtn
            @click="processInput(this.$refs.inputImage)"
            :disabled="!title || !body"
            :theme="isDark ? 'dark' : 'light'"
        >
            Bake!
        </VBtn>
    </VForm>
</template>

<style scoped>
.v-form {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
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
    color: var(--color-dark-pink);
}

.v-textarea {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-dark-pink);
    resize: none;
}

.v-file-input {
    width: 100%;
}

.v-icon {
    color: var(--color-dark-pink);
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
}
</style>
