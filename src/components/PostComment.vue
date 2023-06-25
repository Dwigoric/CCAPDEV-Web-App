<script setup>
import PostComment from './PostComment.vue'

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
    },
    replies: {
        type: Array,
        required: false,
        default: () => [
            {
                id: 1,
                user: {
                    id: 1,
                    username: 'CorporalCat',
                    image: 'https://placekitten.com/300'
                },
                body: 'Correct!',
                replies: [
                    {
                        id: 2,
                        user: {
                            id: 2,
                            username: 'AdmiralMeow',
                            image: 'https://placekitten.com/500'
                        },
                        body: 'I disagree very much...',
                        replies: []
                    }
                ]
            },
            {
                id: 3,
                user: {
                    id: 3,
                    username: 'InsightfulPaw',
                    image: 'https://placekitten.com/400'
                },
                body: 'Have you considered the other way around?',
                replies: []
            },
            {
                id: 4,
                user: {
                    id: 4,
                    username: 'meownificent',
                    image: 'https://placekitten.com/600'
                },
                body: 'I think you are absolutely right!',
                replies: [
                    {
                        id: 5,
                        user: {
                            id: 5,
                            username: 'meowwy',
                            image: 'https://placekitten.com/150'
                        },
                        body: 'Definitely!',
                        replies: [
                            {
                                id: 6,
                                user: {
                                    id: 6,
                                    username: 'Catnip',
                                    image: 'https://placekitten.com/250'
                                },
                                body: 'Very much so!',
                                replies: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
})
</script>

<template>
    <div class="comment">
        <div class="main-comment">
            <div class="user">
                <img class="user-image" :src="user['image']" :alt="`${user['username']}'s image`" />
                <div class="user-name">{{ user['username'] }}</div>
            </div>
            <div class="content">
                <p class="body">{{ body }}</p>
            </div>
        </div>
        <div class="replies">
            <PostComment
                v-for="reply in replies"
                :key="reply.id"
                :user="reply.user"
                :body="reply.body"
                :image="reply.image"
                :replies="reply.replies.filter((subreply) => subreply.id !== reply.id)"
            />
        </div>
    </div>
</template>

<style scoped>
.comment {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    flex-grow: 1;
    width: calc(100% - 3px);
    height: 100%;
    padding: 0.5rem 0 0 0.5rem;
    margin-left: 13px;
    background-color: var(--color-background-soft);
    border-left: var(--color-border) solid 3px;
}

[data-theme='light'] .user-image {
    background-color: var(--color-dark-pink);
    border: var(--color-border) solid 3px;
}

.main-comment {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
}

.user {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    height: 100%;
}

.user-image {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-background-mute);
}

.user-name {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 0.2rem;
    border-radius: 5px;
    color: var(--color-bright-blue);
}

.body {
    width: 100%;
}

.replies {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: center;
    flex-basis: 100%;
    background-color: var(--color-background-soft);
}
</style>
