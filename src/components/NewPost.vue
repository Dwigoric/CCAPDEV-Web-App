<script setup>
// Import packages
import { ref } from 'vue'

// Define variables
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
                v-model="filename"
                prepend-icon="mdi-camera"
                ref="inputImage"
            ></VFileInput>
            <VBtn
                @click="processInput(this.$refs.inputImage)"
                :disabled="!title || !body"
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
