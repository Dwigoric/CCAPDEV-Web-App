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
            <div class="header">
                <img class="user-image" :src="user['image']" :alt="`${user['username']}'s image`" />
                <div class="data">
                    <div class="user-name">{{ user['username'] }}</div>
                    <span class="title">{{ title }}</span>
                </div>
            </div>
        </div>
         <div class="content">
            <img
                class="post-image"
                v-if="image"
                :src="image"
                :alt="`An image in ${user['username']}'s post`"
            />
            <p class="body">{{ body }}</p>
        </div>
    </div>
</template>

<style scoped>
.header {
    display : flex;
    flex-direction: row;
}
.post {
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
    border: var(--color-white) solid 3px;
}

[data-theme='light'] .user-name {
    background-color: var(--color-dark-pink);
}

.data {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 20px;
}

.user {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin-right: 20px;
}

.user-image {
	margin-right: 5px;
	border-radius: 50%;
	background-color: #FAFAFA;
	vertical-align: baseline;
	border: 1px solid #EFEFEF;
    width: 100pxpx;
    height: 100px;
    border-radius: 80%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-dark-green);
    vertical-align : baseline;
}

.user-name {
    margin-top: 10px;
    padding: 0.2rem;
    font-size: 1rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
}

.title {
    font-size: 1.5rem;
    font-weight: bold;
}

.body {
    width: 100%;
    text-align: justify;
    padding: 10px;
    font-size: 1rem;
}

.post-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    width: 100%;
    height: auto;
    max-width: fit-content;
    background-color: var(--color-background-mute);
}
</style>
