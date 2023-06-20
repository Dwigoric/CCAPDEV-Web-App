<script setup>
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
    }
})
</script>

<template>
    <div class="post">
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
    </div>
</template>

<style scoped>
.post {
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
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100%;
    margin-right: 20px;
}

.user-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-dark-green);
}

.user-name {
    margin-top: 10px;
    padding: 0.2rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
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
    margin-top: 20px;
    width: 100%;
    height: 300px;
    background-color: var(--color-background-mute);
}
</style>
