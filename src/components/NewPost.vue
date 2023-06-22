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
        <button @click="addPost({ title, body })">Bake!</button>
    </div>
</template>

<style scoped>
#new-post {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
    background-color: var(--color-pale-green);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
}

[data-theme='light'] #new-post {
    background-color: var(--color-dark-pink);
    box-shadow: none;
}
</style>
