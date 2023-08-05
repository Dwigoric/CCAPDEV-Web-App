<script setup>
// Import packages
import { onUnmounted } from 'vue'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'

// Import stores
import { useSearchStore } from '../stores/search'

// Define variables
const searchStore = useSearchStore()

document.title = 'Compact Donuts | Search'

// Define functions
function editPost(id, { title, body }) {
    const postIndex = searchStore.searchPosts.findIndex((post) => post.id === id)
    searchStore.searchPosts[postIndex].title = title
    searchStore.searchPosts[postIndex].body = body
    searchStore.searchPosts[postIndex].edited = new Date()
}

function deletePost(id) {
    const postIndex = searchStore.searchPosts.findIndex((post) => post.id === id)
    searchStore.searchPosts.splice(postIndex, 1)
}

// Define lifecycle hooks
onUnmounted(() => {
    searchStore.searchPosts.splice(0, searchStore.searchPosts.length)
})
</script>

<template>
    <NavigationBar title-custom-text="Back to Feed" />
    <ThemeSwitch />
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
            :date="post.date"
            :on-edit="editPost"
            :on-delete="deletePost"
        />
    </div>
    <div class="no-result" v-else>
        <LoaderHeart v-if="searchStore.fetching" />
        <span v-else-if="searchStore.searchPosts.length === 0"> No posts found </span>
    </div>
</template>

<style scoped>
.search-view {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
    margin-top: var(--navbar-height);
    border-radius: 10px;
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

@media (min-width: 1024px) {
    .search-view {
        padding: 2rem 20vw;
        gap: 1.5rem;
    }
}
</style>
