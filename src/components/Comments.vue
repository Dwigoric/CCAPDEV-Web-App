<script setup>

defineProps({
    user: {
        type: Object,
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
                <div class="user-name">{{ user['username'] }}</div>
        </div>
        <div class="content">
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
    justify-content: left;
    width: 100%;
    height: 100%;
    padding: 1rem;
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
    border: var(--color-white) solid 3px;
}

[data-theme='light'] .user-name {
    background-color: var(--color-dark-pink);
}

.user {
    width: 100px;
    height: 100%;
    margin-right: 20px;
    padding-bottom: 20px;
}

.user-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-white);
}

.user-name {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
    text-align: center;
    padding: 0.2rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
}

.body {
    width: 100%;
}

.post-image {
    margin-top: 20px;
    flex-basis: 100%;
    height: auto;
    max-width: 100%;
    background-color: var(--color-background-mute);
    border-radius: 10px;
}
.flexboxRow {
    display: flex;
    flex-direction: row;
    margin: auto;
}

</style>
