<script setup>
// Import packages
import { onUnmounted } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import router from '@/router'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import PostSpecific from '../components/PostSpecific.vue'
import PostComment from '../components/PostComment.vue'
import PostSpecificVote from '../components/PostSpecificVote.vue'

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
    <ThemeSwitch v-if="useMediaQuery('(min-width: 1024px)').value" />
    <NavigationBar />
    <div id="view">
        <div id="post-details">
            <PostSpecific
                :user="currentPost.user"
                :title="currentPost.title"
                :body="currentPost.body"
                :image="currentPost.image"
            />
            <div id="vote">
                <PostSpecificVote :reactions="currentPost.reactions" />
            </div>
            <div id="comments">
                <div class="comment">
                    <PostComment :user="tempUser3" body="Wow! So Motivational!" />
                </div>
                <div class="comment">
                    <PostComment :user="tempUser2" body="Tara Kopi, Sleep is for the weak" />
                </div>
                <div class="comment">
                    <PostComment :user="tempUser1" body="That's me. Fr FR FR" />
                </div>
                <div id="comments-end">You've reached the end.</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.comment {
    display: flex;
    background: var(--color-background-soft);
    width: 100%;
    flex-grow: 1;
}

#comments {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    flex-basis: 100%;
    background-color: var(--color-background-soft);
}

#view {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    justify-content: center;
    align-self: baseline;
    min-height: calc(100vh - var(--navbar-height));
    margin-top: var(--navbar-height);
}

#post-details {
    flex-basis: 100vw;
    min-height: calc(100vh - var(--navbar-height));
    top: calc(var(--navbar-height));
    background: var(--color-background-soft);
}

@media (min-width: 1024px) {
    #post-details {
        flex-basis: 40vw;
    }
}

#comments-end {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    color: var(--color-bright-blue);
}
</style>
