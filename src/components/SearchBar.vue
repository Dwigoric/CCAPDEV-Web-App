<script setup>
// Import packages
import { ref } from 'vue'
import router from '../router'

// Import stores
import { useSearchStore } from '../stores/search'

// Define variables
const query = ref('')
const searchStore = useSearchStore()

// Process search
const processSearch = () => {
    searchStore.searchPosts.splice(0, searchStore.searchPosts.length)
    searchStore.search(query.value)
    searchStore.fetching = true
    router.push({ name: 'search' })
}
</script>

<template>
    <input
        type="text"
        placeholder="Search..."
        v-model="query"
        class="search-bar"
        @keyup.enter="processSearch"
    />
</template>

<style scoped>
input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    appearance: none;
    padding: 0 1rem;
    outline: none;
}
</style>
