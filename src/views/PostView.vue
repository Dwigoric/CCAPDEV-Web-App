<script setup>
// Import packages
import { useMediaQuery } from '@vueuse/core'
import { onUnmounted } from 'vue'
import router from '@/router'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import PostSpecific from '../components/PostSpecific.vue'
import Comments from '../components/PostComments.vue'

// Import stores
import { useSpecificPostStore } from '@/stores/currentPost'

const { currentPost, currentPostId, unsetCurrentPost } = useSpecificPostStore()

const tempUser1 = {
    username: 'legitCrammer',
    image: 'https://media.istockphoto.com/id/1158030230/photo/portrait-of-a-cute-little-duckling-closeup-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=ipLksGRzH5Sj6ER0c1MTWn4K_EgEHHKP__1ezNc_WoM='
}

const tempUser2 = {
    username: 'NoobMaster69',
    image: 'https://blogtimenow.com/wp-content/uploads/2014/06/hide-facebook-profile-picture-notification.jpg'
}
const tempUser3 = {
    username: 'Barbie',
    image: 'https://i.pinimg.com/474x/81/73/ff/8173ff1430a9bd44f0b0cf49bdb9bcde.jpg'
}

onUnmounted(unsetCurrentPost)

if (currentPostId === null) {
    router.push({ name: 'feed' })
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
        <div>
            <div class="feed-element" id="posts">
                <PostSpecific
                    :user="currentPost.user"
                    :title="currentPost.title"
                    :body="currentPost.body"
                    :image="currentPost.image"
                />
            </div>
            <div id="CommentStart">
                <h1 style="color: white">Comments</h1>
                <div class="CommentHandle">
                    <div class="comments">
                        <Comments :user="tempUser3" body="Wow! So Motivational!" />
                    </div>
                    <div class="comments">
                        <Comments :user="tempUser2" body="Tara Kopi, Sleep is for the weak" />
                    </div>
                    <div class="comments">
                        <Comments :user="tempUser1" body="That's me. Fr FR FR" />
                    </div>
                </div>
            </div>
        </div>
        <div
            class="feed-element"
            id="right-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            This is the right sidebar.
            <ThemeSwitch />
        </div>
    </div>
</template>

<style scoped>
.comments {
    padding: 10px;
    display: flex;
}
.CommentHandle {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    padding: 1rem;
    background-color: var(--color-pale-blue);
    border-radius: 10px;
}

#CommentStart {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
    background-color: var(--color-pale-blue);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
}

#feed {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
    background-color: var(--color-pale-blue);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
}

.feed-element {
    display: flex;
    flex-grow: 1;
    padding: 40px;
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
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-mute);
    gap: 2rem;
}

#right-sidebar {
    flex-flow: row nowrap;
    justify-content: left;
    flex: 3 0;
}
/* Flex Box for the class*/
.flexboxColumn {
    display: flex;
    flex-direction: column;
    background-color: var(--color-pale-blue);
}

.flexboxRow {
    display: flex;
    flex-direction: row;
    margin-bottom: 1em;
}
</style>