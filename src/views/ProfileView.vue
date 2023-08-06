<script setup>
// Import packages
import { reactive, ref, onMounted, watch } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import moment from 'moment'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

//Import router
import router from '../router/index.js'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'
import { useCachedPostsStore } from '../stores/cachedPosts'

// Import constants
import { API_URL } from '../constants'

// Define variables
document.title = 'Compact Donuts | Profile'

const usernameRules = [
    (v) => !!v || 'Username is required',
    (v) => (v && v.length <= 20) || 'Username must be less than 20 characters',
    (v) => /^[A-Za-z0-9]+$/.test(v) || 'Username can only be alphanumeric'
]

const props = defineProps({
    username: {
        type: String,
        required: true
    }
})

const currentUser = reactive({
    id: '',
    username: '',
    description: '',
    image: ''
})

// Define variables
const login = useLoggedInStore()
const { cachedPosts } = useCachedPostsStore()

const inputImage = ref(null)
const dialog = ref(false)
const files = ref([])
const userPosts = reactive([])
const userComments = reactive([])
const loading = ref(true)
const commentsMode = ref(false)
const editDialog = ref(false)
const commentEditing = ref('')
const newCommentBody = ref('')

const newUsername = ref(login.username)
const newDescription = ref(login.description)

// Define functions
async function fetchUser() {
    const { user } = await fetch(`${API_URL}/users/username/${props.username}`).then((res) =>
        res.json()
    )

    currentUser.id = user.id
    currentUser.username = user.username
    currentUser.description = user.description
    currentUser.image = user.image

    //user initially was the object

    await Promise.all([fetchPosts(), fetchComments()])
}

async function fetchPosts() {
    // Process posts
    const { posts } = await fetch(`${API_URL}/posts/user/${currentUser.id}`).then((res) =>
        res.json()
    )
    userPosts.push(...posts)

    loading.value = false
}

async function fetchComments() {
    // Process comments
    const { comments } = await fetch(`${API_URL}/comments/user/${currentUser.id}`).then((res) =>
        res.json()
    )
    userComments.push(...comments)
}

async function saveChanges(file) {
    let willUpdate = false

    const payload = new FormData()
    if (newUsername.value !== login.username) {
        payload.append('username', newUsername.value)
        willUpdate = true
    }
    if (newDescription.value !== login.description) {
        payload.append('description', newDescription.value)
        willUpdate = true
    }
    if (file) {
        payload.append('avatar', file)
        willUpdate = true
    }

    if (!willUpdate) return

    const { token } = window.$cookies.get('credentials')

    const { user, error, message } = await fetch(`${API_URL}/users/${login.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: payload
    }).then((response) => response.json())

    if (error) {
        console.error(message)
        return
    }

    login.username = user.username
    login.description = user.description
    login.image = file ? user.image : login.image
    for (const post of userPosts) {
        post['user'].username = user.username
        post['user'].image = file ? user.image : post['user'].image
    }
    for (const post of cachedPosts) {
        if (post['user'].id !== login.id) continue

        post['user'].username = user.username
        post['user'].image = file ? user.image : post['user'].image
    }

    currentUser.username = login.username
    currentUser.description = login.description
    currentUser.image = login.image

    return router.replace({ name: 'profile', params: { username: login.username } })
}

const processInput = () => {
    if (!inputImage.value || !inputImage.value.files || !inputImage.value.files.length) {
        saveChanges(null)
    } else {
        // Retrieve image input file
        const file = inputImage.value.files[0]
        saveChanges(file)
    }

    // Close dialog
    dialog.value = false

    // Reset form
    newUsername.value = ''
    newDescription.value = ''
    files.value = []
}

function editPost(id, { title, body }) {
    const postIndexUser = userPosts.findIndex((post) => post['id'] === id)
    if (title) userPosts[postIndexUser].title = title
    if (body) userPosts[postIndexUser].body = body
    userPosts[postIndexUser].edited = Date.now()

    const postIndexFeed = cachedPosts.findIndex((post) => post.id === id)
    if (title) cachedPosts[postIndexFeed].title = title
    if (body) cachedPosts[postIndexFeed].body = body
    cachedPosts[postIndexFeed].edited = Date.now()
}

function deletePost(id) {
    const postIndexUser = userPosts.findIndex((post) => post['id'] === id)
    userPosts.splice(postIndexUser, 1)

    const postIndexFeed = cachedPosts.findIndex((post) => post.id === id)
    cachedPosts.splice(postIndexFeed, 1)
}

function editComment(id, body) {
    commentEditing.value = id
    newCommentBody.value = body
}

async function saveComment(id) {
    const { token } = window.$cookies.get('credentials')

    const { comment, error, message } = await fetch(`${API_URL}/comments/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newCommentBody.value })
    }).then((response) => response.json())

    if (error) {
        console.error(message)
        return
    }

    const commentIndex = userComments.findIndex((comment) => comment.id === id)
    userComments[commentIndex].body = comment.body
    userComments[commentIndex].edited = comment.edited

    commentEditing.value = ''
    editDialog.value = false
}

async function deleteComment(id) {
    const { token } = window.$cookies.get('credentials')

    const { error, message } = await fetch(`${API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    }).then((response) => response.json())

    if (error) {
        console.error(message)
        return
    }

    const commentIndex = userComments.findIndex((comment) => comment.id === id)
    userComments.splice(commentIndex, 1)
}

// Define lifecycle hooks
onMounted(fetchUser)
watch(
    () => props.username,
    () => {
        loading.value = true
        userPosts.splice(0, userPosts.length)
        userComments.splice(0, userComments.length)

        fetchUser()
    }
)
</script>

<template>
    <NavigationBar title-custom-text="Back to Feed" />
    <div id="profile-container">
        <div id="header">
            <div id="user-panel">
                <div id="user-data">
                    <VAvatar size="150" class="mb-3" variant="tonal">
                        <VImg :src="currentUser.image" alt="Profile image" :aspect-ratio="1" />
                    </VAvatar>
                    <span id="username" class="rounded-pill pa-1 px-3">
                        {{ currentUser.username }}
                    </span>
                </div>
                <div id="user-description">
                    <span>
                        {{
                            currentUser.description ||
                            'This user has not written a description yet.'
                        }}
                    </span>
                </div>
            </div>

            <VRow justify="center" v-if="currentUser.id === login.id">
                <VDialog v-model="dialog" width="80%">
                    <template v-slot:activator="{ props }">
                        <VBtn
                            id="edit-btn"
                            v-bind="props"
                            @click="dialog = true"
                            icon="mdi-pencil"
                            type="text"
                            color="primary"
                        />
                    </template>
                    <VCard>
                        <VCardTitle>
                            <span class="text-h5">Edit User Information</span>
                        </VCardTitle>
                        <VCardText>
                            <VContainer>
                                <VRow>
                                    <VCol cols="12">
                                        <span class="label1"> New Username </span>
                                        <VTextField
                                            label="A user can go by many names, but they still keep their own identity."
                                            v-model="newUsername"
                                            :rules="usernameRules"
                                        >
                                        </VTextField>
                                        <small class="note">
                                            Username should be at least 1 character long. Otherwise,
                                            the empty string will not be saved
                                        </small>
                                    </VCol>
                                    <VCol cols="12">
                                        <span class="label2"> New Description </span>
                                        <VTextField
                                            label="Don't forget to bake it with love!"
                                            v-model="newDescription"
                                        ></VTextField>
                                    </VCol>
                                    <VCol cols="12">
                                        <span class="label2"> New Profile Picture </span>
                                        <VFileInput
                                            label="Change profile picture"
                                            v-model="files"
                                            accept="image*/"
                                            clearable="clearable"
                                            ref="inputImage"
                                        ></VFileInput>
                                    </VCol>
                                    <VCol cols="12">
                                        <VBtn @click="processInput" class="Submit">
                                            Save Changes
                                        </VBtn>
                                    </VCol>
                                </VRow>
                            </VContainer>
                        </VCardText>
                        <VCardActions>
                            <VSpacer></VSpacer>
                            <VBtn color="red-darken-1" variant="text" @click="dialog = false">
                                Close
                            </VBtn>
                        </VCardActions>
                    </VCard>
                </VDialog>
            </VRow>
        </div>
        <div id="contents">
            <div id="mode-switch">
                <VSwitch v-model="commentsMode" label="Comments Mode" color="teal-darken-3" />
            </div>
            <Waypoint v-if="loading">
                <LoaderHeart />
            </Waypoint>
            <div id="posts" v-if="!loading && !commentsMode">
                <FeedPost
                    v-for="post in userPosts"
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
            </div>
            <div
                class="bg-teal-darken-2 rounded-t-xl"
                id="comments"
                v-if="!loading && commentsMode && userComments.length > 0"
            >
                <VList lines="three" class="rounded-t-xl" bg-color="teal-darken-2">
                    <VListItem
                        v-for="comment in userComments"
                        class="rounded-xl"
                        :key="comment.id"
                        @click="router.push({ name: 'post', params: { id: comment.post.id } })"
                    >
                        <template v-slot:prepend>
                            <VAvatar>
                                <VIcon>mdi-comment</VIcon>
                            </VAvatar>
                        </template>
                        <template v-slot:append v-if="currentUser.id === login.id">
                            <VListItemAction>
                                <VMenu>
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
                                        <VDialog v-model="editDialog" width="80%">
                                            <template v-slot:activator="{ props }">
                                                <VListItem
                                                    v-bind="props"
                                                    @click="editComment(comment.id, comment.body)"
                                                >
                                                    <VListItemTitle>Edit</VListItemTitle>
                                                </VListItem>
                                            </template>
                                            <VCard>
                                                <VCardTitle>Edit Comment</VCardTitle>
                                                <VCardText>
                                                    <VTextField
                                                        v-model="newCommentBody"
                                                        label="Comment"
                                                        required
                                                    ></VTextField>
                                                </VCardText>
                                                <VCardActions>
                                                    <VSpacer></VSpacer>
                                                    <VBtn
                                                        color="red darken-1"
                                                        @click="editDialog = false"
                                                    >
                                                        Cancel
                                                    </VBtn>
                                                    <VBtn
                                                        color="teal darken-1"
                                                        @click="saveComment(comment.id)"
                                                    >
                                                        Save
                                                    </VBtn>
                                                </VCardActions>
                                            </VCard>
                                        </VDialog>
                                        <VListItem @click="deleteComment(comment.id)">
                                            <VListItemTitle>Delete</VListItemTitle>
                                        </VListItem>
                                    </VList>
                                </VMenu>
                            </VListItemAction>
                        </template>
                        <VListItemTitle class="comment-header">
                            <span class="comment-post-title mr-2 text-cyan-lighten-3">{{
                                comment.post.title
                            }}</span>
                            <VIcon size="x-small"> mdi-clock </VIcon>
                            {{ moment(comment.date).fromNow() }}
                            <span v-if="comment.edited">
                                <VIcon size="x-small"> mdi-pencil </VIcon>
                                {{ moment(comment.edited).fromNow() }}
                            </span>
                        </VListItemTitle>
                        <VListItemSubtitle>
                            {{ comment.body }}
                        </VListItemSubtitle>
                    </VListItem>
                </VList>
            </div>
            <ThemeSwitch v-if="useMediaQuery('(min-width: 1024px)').value" />
        </div>
    </div>
</template>

<style scoped>
#profile-container {
    display: flex;
    width: 100%;
    flex-flow: column nowrap;
}

#header {
    background: linear-gradient(
        to top,
        var(--color-background) 0%,
        var(--color-background-soft) 100%
    );
}

#user-panel {
    display: flex;
    flex-flow: column nowrap;
    margin-top: calc(var(--navbar-height) + 3vh);
    width: 100vw;
    justify-content: center;
    align-items: center;
}

#user-data {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

#username {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-text);
    background: var(--color-background-soft);
}

#user-description {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    width: 50vw;
    text-align: center;
}

#edit-btn {
    position: absolute;
    top: calc(var(--navbar-height) + 3vh);
    right: 3vw;
    font-weight: 600;
    font-size: 1rem;
}

#contents {
    display: flex;
    width: 100%;
    height: 100%;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 2rem;
}

#mode-switch {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
}

#posts {
    display: flex;
    flex-flow: column-reverse nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
}

#comments {
    width: 100%;
    height: 100%;
}

.comment-header {
    font-size: 0.8rem;
}

.comment-post-title {
    font-size: 1rem;
    font-weight: bolder;
}

@media (min-width: 1024px) {
    #posts {
        padding: 2rem 10vw;
        gap: 2rem;
    }

    #comments {
        width: 50%;
    }
}
</style>
