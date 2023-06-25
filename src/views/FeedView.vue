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
import { useCachedPostsStore } from '@/stores/cachedPosts'
import { useTempPostsStore } from '@/stores/tempPosts'
import { useLoggedInStore } from '@/stores/loggedIn'

// Set document title
document.title = 'Compact Donuts | Feed'

// Define variables
const { cachedPosts, fetchPosts } = useCachedPostsStore()
const { tempPosts } = useTempPostsStore()
const loggedIn = useLoggedInStore()

const getPosts = async (waypointState) => {
    if (waypointState.going !== 'IN') {
        return
    }

    fetchPosts()
}

const addPost = (post) => {
    tempPosts.push({
        ...post,
        id: cachedPosts.length === 0 ? 0 : cachedPosts[cachedPosts.length - 1].id + 1,
        reactions: 0,
        user: {
            username: loggedIn.username,
            image: loggedIn.image
        }
    })
    cachedPosts.push(tempPosts[tempPosts.length - 1])
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
            This is the left sidebar.
        </div>
        <div class="feed-element" id="posts">
            <Waypoint @change="getPosts" v-if="!cachedPosts.length || cachedPosts[0].id !== 1">
                <LoaderHeart />
            </Waypoint>
            <span v-else> You're all caught up! </span>
            <FeedPost
                v-for="post in cachedPosts"
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
            <NewPost v-if="loggedIn.username && cachedPosts.length > 0" :add-post="addPost" />
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
    flex-flow: row nowrap;
    justify-content: right;
    flex: 2 0;
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
    flex-flow: row nowrap;
    justify-content: left;
    flex: 3 0;
    padding: 1rem;
}

svg path:hover {
    fill: orangered;
}
</style>
