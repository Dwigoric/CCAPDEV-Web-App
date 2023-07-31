<script setup>
// Import packages
import { onUnmounted } from 'vue'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useSearchStore } from '../stores/search'

// Define variables
const searchStore = useSearchStore()

document.title = 'Compact Donuts | Search'

onUnmounted(() => {
    searchStore.searchPosts.splice(0, searchStore.searchPosts.length)
})
</script>

<template>
    <NavigationBar />
    <div class="search-view" v-if="!searchStore.fetching && searchStore.searchPosts.length > 0">
        <FeedPost
            class="search-post"
            v-for="post in searchStore.searchPosts"
            :key="post.id"
            :id="post.id"
            :title="post.title"
            :body="post.body"
            :user="post.user"
            :image="post.image"
            :reactions="post.reactions"
        />
    </div>
    <div class="no-result" v-else>
        <LoaderHeart v-if="searchStore.fetching" />
        <span v-else-if="searchStore.searchPosts.length === 0"> No posts found </span>
    </div>
</template>

<style scoped>
.search-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, [col-start] minmax(300px, 2fr));
    grid-auto-rows: 1fr;
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    width: 100%;
    height: 100%;
    padding: 2rem;
    margin-top: 2rem;
    gap: 1rem;
    border-radius: 10px;
    text-decoration: none;
    color: var(--color-text);
}

.search-post {
    place-self: center;
}

.no-result {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    height: calc(100vh - var(--navbar-height));
    width: 100%;
    margin-top: 2rem;
    font-size: 1.5rem;
    color: var(--color-text);
}
</style>
