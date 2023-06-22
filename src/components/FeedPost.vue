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
    <RouterLink to="/post" class="post">
        <div class="flexboxRow">
            <div class="flexboxColumn">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="#888888" d="M11 20V7.825l-5.6 5.6L4 12l8-8l8 8l-1.4 1.425l-5.6-5.6V20h-2Z"/></svg>
                <div class="count"> 0</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path fill="#888888" d="m12 20l-8-8l1.4-1.425l5.6 5.6V4h2v12.175l5.6-5.6L20 12l-8 8Z"/></svg>
            </div>
            <div class="user">
                <img class="user-image" :src="user['image']" :alt="`${user['username']}'s image`" />
                <span class="user-name">{{ user['username'] }}</span>
            </div>
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
    </RouterLink>
</template>

<style scoped>
.post {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: left;
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
    flex-basis: 100%;
    height: 400px;
    background-color: var(--color-background-mute);
    border-radius: 10px;
}
.flexboxRow {
    display: flex;
    flex-direction: row;
    margin: auto;
}

.flexboxColumn {
    display: flex;
    flex-direction: column;
    margin: auto 15px auto 0;
}

.count {
    margin: auto;
}

svg path:hover {
    fill:orangered
}
</style>