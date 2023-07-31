<script setup>
// Import packages
import { reactive, ref, onMounted, watch } from 'vue'

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
const loading = ref(true)

const newUsername = ref('')
const newDescription = ref('')

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

    return fetchPosts()
}

async function fetchPosts() {
    // Process posts
    const { posts } = await fetch(`${API_URL}/posts/user/${currentUser.id}`).then((res) =>
        res.json()
    )
    userPosts.push(...posts)

    loading.value = false
}

async function saveChanges(file) {
    let willUpdate = false

    const payload = new FormData()
    if (newUsername.value.length > 0) {
        payload.append('username', newUsername.value)
        willUpdate = true
    }
    if (newDescription.value.length > 0) {
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

function deletePost(id) {
    const postIndexUser = userPosts.findIndex((post) => post['id'] === id)
    userPosts.splice(postIndexUser, 1)

    const postIndexFeed = cachedPosts.findIndex((post) => post.id === id)
    cachedPosts.splice(postIndexFeed, 1)
}

// Define lifecycle hooks
onMounted(fetchUser)
watch(
    () => props.username,
    () => {
        loading.value = true
        userPosts.splice(0, userPosts.length)

        fetchUser()
    }
)
</script>

<template>
    <NavigationBar />
    <div id="profile-container">
        <div id="header">
            <div id="user-panel">
                <div id="user-data">
                    <VAvatar size="150" class="mb-3" variant="tonal">
                        <VImg :src="currentUser.image" alt="Profile image" :aspect-ratio="1" />
                    </VAvatar>
                    <span id="username" class="rounded-pill pa-1 px-3">{{
                        currentUser.username
                    }}</span>
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

            <v-row justify="center" v-if="currentUser.id === login.id">
                <v-dialog v-model="dialog" width="1024">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            class="rounded-pill"
                            id="edit-btn"
                            v-bind="props"
                            @click="dialog = true"
                        >
                            Edit Profile
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Edit User Information</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <span class="label1"> New Username </span>
                                        <VTextField
                                            label="A user can go by many names, but they still keep their own identity."
                                            v-model="newUsername"
                                        >
                                        </VTextField>
                                        <small class="note">
                                            Username should be at least 1 character long. Otherwise,
                                            the empty string will not be saved
                                        </small>
                                    </v-col>
                                    <v-col cols="12">
                                        <span class="label2"> New Description </span>
                                        <VTextField
                                            label="Don't forget to bake it with love!"
                                            v-model="newDescription"
                                        ></VTextField>
                                    </v-col>
                                    <v-col cols="12">
                                        <span class="label2"> New Profile Picture </span>
                                        <v-file-input
                                            label="Change profile picture"
                                            v-model="files"
                                            accept="image*/"
                                            clearable="clearable"
                                            ref="inputImage"
                                        ></v-file-input>
                                    </v-col>
                                    <v-col cols="12">
                                        <VBtn @click="processInput" class="Submit">
                                            Save Changes
                                        </VBtn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <VBtn color="red-darken-1" variant="text" @click="dialog = false">
                                Close
                            </VBtn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </div>

        <div id="posts">
            <Waypoint v-if="loading">
                <LoaderHeart />
            </Waypoint>
            <FeedPost
                v-else
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
                :on-delete="deletePost"
            />
            <ThemeSwitch />
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
        360deg,
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
    top: calc(var(--navbar-height) + 15vh);
    right: 1vw;
    transform: translateX(-50%);
    width: 150px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease-in-out;
}

#posts {
    display: flex;
    flex-flow: column-reverse nowrap;
    justify-content: center;
    align-items: center;
    padding: 2rem 10vw;
    margin-top: 5rem;
    width: 100%;
    gap: 2rem;
}
</style>
