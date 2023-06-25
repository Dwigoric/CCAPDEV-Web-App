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

onUnmounted(() => {
    searchStore.searchPosts.splice(0, searchStore.searchPosts.length)
})
</script>

<template>
    <NavigationBar />
    <div class="search-view">
        <LoaderHeart v-if="searchStore.fetching" />
        <span v-else-if="searchStore.searchPosts.length === 0"> No posts found </span>
        <FeedPost
            class="search-post"
            v-for="post in searchStore.searchPosts"
            :key="post.id"
            :title="post.title"
            :body="post.body"
            :user="post.user"
            :image="post.image"
            :reactions="post.reactions"
        />
    </div>
</template>

<style scoped>
.search-view {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
    margin-top: 2rem;
    gap: 1rem;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
    text-decoration: none;
    color: var(--color-text);
}

.search-post {
    flex-basis: 18vw;
}
</style>
