<script setup>
import { ref, defineProps } from 'vue'

const title = ref('')
const body = ref('')

defineProps({
    addPost: {
        type: Function,
        required: true
    }
})
</script>

<template>
    <div id="new-post">
        <input type="text" placeholder="Title" id="new-post-title" v-model="title" />
        <textarea placeholder="Body" id="new-post-body" v-model="body"></textarea>
        <button
            @click="
                () => {
                    addPost({ title, body })
                    title = ''
                    body = ''
                }
            "
            :disabled="!title || !body"
        >
            Bake!
        </button>
    </div>
</template>

<style scoped>
#new-post {
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

[data-theme='light'] #new-post {
    background-color: var(--color-dark-pink);
    box-shadow: none;
}

#new-post-title {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid var(--color-dark-pink);
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-dark-pink);
    background: var(--color-background);
}

[data-theme='light'] #new-post-title {
    border: 1px solid var(--color-pale-green);
    color: var(--color-pale-green);
}

#new-post-body {
    width: 100%;
    height: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid var(--color-dark-pink);
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-dark-pink);
    background: var(--color-background);
    resize: none;
}

[data-theme='light'] #new-post-body {
    border: 1px solid var(--color-pale-green);
    color: var(--color-pale-green);
}

button {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-dark-pink);
    border-radius: 5px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    background: var(--color-dark-pink);
    cursor: pointer;
}

[data-theme='light'] button {
    border: 1px solid var(--color-pale-green);
    color: var(--color-pale-green);
    background-color: var(--color-dark-pink);
}
</style>
