<script setup>
// Import packages
import { useMediaQuery } from '@vueuse/core'
import { Waypoint } from 'vue-waypoint'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import NewPost from '../components/NewPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

// Import stores
import { useCachedPostsStore } from '../stores/cachedPosts'
import { useDeletedPostsStore } from '../stores/deletedPosts'
import { useLoggedInStore } from '../stores/loggedIn'
import { useVoteStore } from '../stores/votes'
import router from '../router'

// Set document title
document.title = 'Compact Donuts | Feed'

// Define variables
const cachedPostsStore = useCachedPostsStore()
const { cachedPosts, fetchPosts } = cachedPostsStore
const { deletedPosts } = useDeletedPostsStore()
const loggedIn = useLoggedInStore()
const voteStore = useVoteStore()

const getPosts = async (waypointState) => {
    if (waypointState.going !== 'IN') {
        return
    }

    fetchPosts()
}
</script>

<template>
    <NavigationBar />
    <div id="feed">
        <div
            class="feed-element"
            id="left-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            <span v-if="cachedPosts.length > 0" class="sidebar-header">Top Posts</span>
            <VList lines="two" class="bg-transparent mt-5">
                <VListItem
                    v-for="post in cachedPosts
                        .filter((p) => !deletedPosts.has(p.id))
                        .slice()
                        .sort(
                            (a, b) =>
                                b.reactions +
                                voteStore.getTotalVotes(b.id) -
                                (a.reactions + voteStore.getTotalVotes(a.id))
                        )"
                    :key="post.id"
                    :title="`${post.user.username} • ${
                        post.reactions + voteStore.getTotalVotes(post.id)
                    }`"
                    :subtitle="post.title"
                    :prepend-avatar="post.user.image"
                    @click="() => router.push({ name: 'post', params: { id: post.id } })"
                >
                </VListItem>
            </VList>
        </div>
        <div class="feed-element" id="posts">
            <Waypoint @change="getPosts" v-if="!cachedPostsStore.loadedAllPosts">
                <LoaderHeart />
            </Waypoint>
            <span v-else> You're all caught up! </span>
            <FeedPost
                v-for="post in cachedPosts.filter((p) => !deletedPosts.has(p.id))"
                :key="post.id"
                :id="post.id"
                :title="post.title"
                :body="post.body"
                :user="post.user"
                :image="post.image"
                :reactions="post.reactions"
            />
        </div>
        <div
            class="feed-element"
            id="right-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            <span v-if="loggedIn.username" class="sidebar-header">Bake a Post!</span>
            <NewPost v-if="loggedIn.username" />
            <ThemeSwitch />
        </div>
    </div>
</template>

<style scoped>
#feed {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    align-self: baseline;
    min-height: calc(100vh - var(--navbar-height));
    margin-top: var(--navbar-height);
}

.feed-element {
    display: flex;
    flex-grow: 1;
    padding: 2rem;
}

#left-sidebar,
#right-sidebar {
    background-color: var(--color-background);
    position: sticky;
    height: calc(100vh - var(--navbar-height));
    align-self: flex-start;
    top: var(--navbar-height);
    bottom: 0;
}

#left-sidebar {
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    flex: 2 0;
}

.sidebar-header {
    align-self: center;
    font-size: 1.5rem;
    font-weight: 600;
    background: linear-gradient(90deg, var(--color-dark-pink) 0%, var(--color-bright-blue) 100%);
    background-clip: text;
    -webkit-background-clip: text;
}

#posts {
    flex-flow: column-reverse nowrap;
    flex: 6;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-mute);
    gap: 2rem;
}

#right-sidebar {
    flex-flow: column nowrap;
    align-items: center;
    flex: 3 0;
    padding: 1rem;
}

svg path:hover {
    fill: orangered;
}
</style>
