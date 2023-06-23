<script setup>
import { useSpecificPostStore } from '@/stores/currentPost'

const postStore = useSpecificPostStore()

defineProps({
    user: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    reactions: {
        type: Number,
        required: true
    }
})
</script>

<template>
    <RouterLink
        to="/post"
        class="post"
        @click="
            postStore.setCurrentPost({
                user,
                title,
                body,
                image
            })
        "
    >
        <div class="user">
            <img class="user-image" :src="user['image']" :alt="`${user['username']}'s image`" />
            <span class="user-name">{{ user['username'] }}</span>
        </div>
        <div class="content">
            <p class="title">{{ title }}</p>
            <p class="body">{{ body }}</p>
            <img
                class="post-image"
                v-if="image"
                :src="image"
                :alt="`An image in ${user['username']}'s post`"
            />
        </div>
        <div class="dooters">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                    fill="#888888"
                    d="M11 20V7.825l-5.6 5.6L4 12l8-8l8 8l-1.4 1.425l-5.6-5.6V20h-2Z"
                />
            </svg>
            <div class="count">{{ reactions }}</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                    fill="#888888"
                    d="m12 20l-8-8l1.4-1.425l5.6 5.6V4h2v12.175l5.6-5.6L20 12l-8 8Z"
                />
            </svg>
        </div>
    </RouterLink>
</template>

<style scoped>
.post {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: left;
    width: 100%;
    height: 100%;
    padding: 2rem;
    background-color: var(--color-pale-blue);
    border-radius: 10px;
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
    text-decoration: none;
    color: var(--color-text);
}

[data-theme='light'] .post {
    background-color: var(--color-bright-pink);
    box-shadow: none;
}

[data-theme='light'] .user-image {
    background-color: var(--color-dark-pink);
    border: var(--color-pale-green) solid 3px;
}

[data-theme='light'] .user-name {
    background-color: var(--color-dark-pink);
}

.user {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    width: 100px;
    height: 100%;
    gap: 1rem;
    margin-bottom: 10px;
}

.user-image {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-dark-green);
}

.user-name {
    padding: 0.2rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
}

.content {
    width: 100%;
}

.title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.body {
    width: 100%;
}

.post-image {
    flex-basis: 30rem;
    background-color: var(--color-background-mute);
    border-radius: 10px;
    justify-self: center;
    margin: 20px auto 0;
    max-width: 500px;
}

.dooters {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}

.count {
    margin: auto;
}

svg path:hover {
    fill: orangered;
}
</style>
