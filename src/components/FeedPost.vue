<script setup>
// Import packages
import { ref } from 'vue'
import moment from 'moment'
import router from '../router'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'

// Import constants
import { API_URL } from '../constants'
import PostVote from './PostVote.vue'

// Define form rules
const editTitleRules = [(v) => !!v || 'Title is required']
const editBodyRules = [(v) => !!v || 'Body is required']

// Define variables
const loggedIn = useLoggedInStore()
const editFlag = ref(false)
const form = ref(null)

const props = defineProps({
    id: {
        type: String,
        required: true
    },
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
        required: false,
        default: 0
    },
    date: {
        type: Date,
        required: true
    },
    edited: {
        type: Date,
        required: false,
        default: false
    },
    onEdit: {
        type: Function,
        required: true
    },
    onDelete: {
        type: Function,
        required: true
    }
})

const newTitle = ref(props.title)
const newBody = ref(props.body)

// Define functions
async function deletePost() {
    try {
        const { token } = window.$cookies.get('credentials')

        const response = await fetch(`${API_URL}/posts/${props.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => res.json())

        if (response.error) {
            console.error(response.error)
        }
    } catch (error) {
        console.error(error)
    }

    props.onDelete(props.id)
}

function editPost() {
    editFlag.value = true
}

async function savePost() {
    const { valid } = await form.value.validate()
    if (!valid) return

    editFlag.value = false

    const newPostData = {}
    let willEdit = false

    if (newTitle.value !== props.title) {
        newPostData.title = newTitle.value
        willEdit = true
    }
    if (newBody.value !== props.body) {
        newPostData.body = newBody.value
        willEdit = true
    }

    if (!willEdit) return

    props.onEdit(props.id, newPostData)

    const { token } = window.$cookies.get('credentials')

    try {
        const response = await fetch(`${API_URL}/posts/${props.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newPostData)
        }).then((res) => res.json())

        if (response.error) {
            console.error(response.error)
        }
    } catch (error) {
        console.error(error)
    }
}
</script>

<template>
    <div class="post" id="post_id">
        <div class="user">
            <VAvatar class="user-image">
                <VImg
                    :src="user['image']"
                    :alt="`${user['username']}'s image`"
                    @click="
                        router.push({ name: 'profile', params: { username: user['username'] } })
                    "
                />
            </VAvatar>
            <span class="user-name">{{ user['username'] }}</span>
            <VMenu v-if="loggedIn.id === user.id">
                <template v-slot:activator="{ props }">
                    <VBtn
                        v-bind="props"
                        size="large"
                        density="compact"
                        variant="text"
                        icon="mdi-dots-vertical"
                    >
                    </VBtn>
                </template>
                <VList>
                    <VListItem @click="editPost">
                        <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>
                    <VListItem @click="deletePost">
                        <VListItemTitle>Delete</VListItemTitle>
                    </VListItem>
                </VList>
            </VMenu>
        </div>
        <div v-if="edited">
            <VIcon size="x-small" class="ml-3"> mdi-pencil </VIcon>
            <span class="time-span ml-1">edited {{ moment(edited).fromNow() }}</span>
            <VTooltip activator="parent" location="top"> edited at {{ moment(edited) }} </VTooltip>
        </div>
        <div class="content">
            <VContainer
                class="post-content"
                v-if="!editFlag"
                @click="router.push({ name: 'post', params: { id } })"
            >
                <p class="title" id="title">{{ title }}</p>
                <p v-if="body.length <= 500" class="body" id="body">{{ body }}</p>
                <p v-else class="body" id="body">
                    {{ body.substring(0, 500) }}
                    <span class="long-body-ellipsis">...</span>
                </p>
                <img
                    v-if="image"
                    class="post-image"
                    :src="image"
                    :alt="`An image in ${user['username']}'s post`"
                />
            </VContainer>
            <VForm @submit.prevent ref="form">
                <VTextField
                    v-if="editFlag"
                    v-model="newTitle"
                    :rules="editTitleRules"
                    validate-on="input lazy"
                    placeholder="Enter new title..."
                />
                <VTextarea
                    v-if="editFlag"
                    v-model="newBody"
                    :rules="editBodyRules"
                    validate-on="input lazy"
                    placeholder="What's up?"
                    no-resize=""
                />
                <VBtn type="submit" v-if="editFlag" @click="savePost">Save</VBtn>
            </VForm>
        </div>
        <div class="post-footer">
            <PostVote :id="id" style="z-index: 2; position: absolute" />
            <span class="created-timestamp">
                <VIcon size="x-small"> mdi-clock </VIcon>
                <span class="time-span ml-1">
                    posted {{ moment(date).fromNow() }}
                    <VTooltip activator="parent" location="top">
                        posted at {{ moment(date) }}
                    </VTooltip>
                </span>
            </span>
        </div>
    </div>
</template>

<style scoped>
.post {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: left;
    width: 100%;
    padding: 2rem;
    background-color: var(--color-pale-blue);
    box-shadow: 0 0 10px 0 var(--vt-c-black-soft);
    position: relative;
    max-width: 100vw;
}

@media (min-width: 1024px) {
    .post {
        border-radius: 10px;
    }
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
    width: 100%;
    gap: 1rem;
    margin-bottom: 10px;
}

.user-image {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: var(--color-border) solid 3px;
    background-color: var(--color-dark-green);
    cursor: pointer;
}

.user-name {
    padding: 0.2rem;
    border-radius: 5px;
    background-color: var(--color-bright-blue);
}

.time-span {
    font-size: 0.8rem;
    color: var(--color-text);
}

.content {
    width: 100%;
    margin-bottom: 2.5rem;
    text-decoration: none;
    color: var(--color-text);
}

.post-content {
    color: var(--color-text);
    cursor: pointer;
}

.title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.body {
    width: 100%;
    white-space: pre-wrap;
}

.long-body-ellipsis {
    font-weight: bolder;
    color: var(--color-bright-pink);
}

[data-theme='light'] .long-body-ellipsis {
    color: var(--color-bright-blue);
}

.post-image {
    flex-basis: 30rem;
    background-color: transparent;
    border-radius: 10px;
    justify-self: center;
    margin: 20px auto 0;
    max-width: 100%;
}

@media (min-width: 1024px) {
    .post-image {
        max-width: 500px;
    }
}

.post-footer {
    position: absolute;
    display: flex;
    width: calc(100% - 4rem);
    align-items: center;
    bottom: 2rem;
}

.created-timestamp {
    display: flex;
    flex: 1;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
}

.content {
    color: var(--color-text);
    text-decoration: none;
}

svg path:hover {
    fill: var(--color-dark-pink);
}

svg {
    pointer-events: none;
}
</style>
