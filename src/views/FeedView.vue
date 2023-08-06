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
import { useLoggedInStore } from '../stores/loggedIn'
import { useVoteStore } from '../stores/votes'
import router from '../router'

// Set document title
document.title = 'Compact Donuts | Feed'

// Define variables
const cachedPostsStore = useCachedPostsStore()
const { cachedPosts, fetchPosts } = cachedPostsStore
const loggedIn = useLoggedInStore()
const { votes } = useVoteStore()

// Define functions
const getPosts = async (waypointState) => {
    if (waypointState.going !== 'IN') {
        return
    }

    fetchPosts()
}

function editPost(id, { title, body }) {
    const postIndex = cachedPosts.findIndex((post) => post.id === id)
    if (title) cachedPosts[postIndex].title = title
    if (body) cachedPosts[postIndex].body = body
    cachedPosts[postIndex].edited = Date.now()
}

function deletePost(id) {
    const postIndex = cachedPosts.findIndex((post) => post.id === id)
    cachedPosts.splice(postIndex, 1)
}
</script>

<template>
    <NavigationBar :enabled-title="useMediaQuery('(min-width: 1024px)').value" />
    <div id="feed">
        <div
            class="feed-element"
            id="left-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            <span v-if="cachedPosts.length > 0" class="sidebar-header">Top Posts</span>
            <VList lines="two" class="bg-transparent mt-5">
                <VListItem
                    v-for="post in cachedPosts.slice().sort((a, b) => votes[b.id] - votes[a.id])"
                    :key="post.id"
                    :title="`${post.user.username} • ${votes[post.id]}`"
                    :subtitle="post.title"
                    :prepend-avatar="post.user.image"
                    @click="() => router.push({ name: 'post', params: { id: post.id } })"
                >
                    <VListItemTitle>
                        {{ post.user.username }}<VIcon>mdi-circle-small</VIcon>{{ votes[post.id] }}
                    </VListItemTitle>
                    <VListItemSubtitle>
                        {{ post.title }}
                    </VListItemSubtitle>
                </VListItem>
            </VList>
        </div>
        <div class="feed-element" id="posts">
            <Waypoint @change="getPosts" v-if="!cachedPostsStore.loadedAllPosts">
                <LoaderHeart />
            </Waypoint>
            <span class="my-4" v-else> You're all caught up! </span>
            <FeedPost
                v-for="post in cachedPosts"
                :key="post.id"
                :id="post.id"
                :title="post.title"
                :body="post.body"
                :user="post.user"
                :image="post.image"
                :reactions="post.reactions"
                :date="post.date"
                :edited="post.edited"
                :on-edit="editPost"
                :on-delete="deletePost"
            />
            <NewPost v-if="loggedIn.username && !useMediaQuery('(min-width: 1024px)').value" />
        </div>
        <div
            class="feed-element"
            id="right-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            <span v-if="loggedIn.username" class="sidebar-header">Bake a Post!</span>
            <NewPost v-if="loggedIn.username && useMediaQuery('(min-width: 1024px)').value" />
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

@media (min-width: 1024px) {
    .feed-element {
        padding: 2rem;
    }

    #posts {
        gap: 2rem;
    }
}
</style>
