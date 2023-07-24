<script setup>
// Import packages
import { reactive, ref, onMounted } from 'vue'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import FeedPost from '../components/FeedPost.vue'
import LoaderHeart from '../components/LoaderHeart.vue'

//Import router
import Router from '../router/index.js'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'

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


const login = useLoggedInStore()

const userPosts = reactive([])
const loading = ref(true)
const editing = ref(false)
const cDescription = ref('')
const cUsername = ref('')
const modName = ref([false])
const modDesc = ref(false)
const inputImage = ref(null)
const modFile = ref([])
const filename = ref([])
const prevName = ref(false)

const dialog = ref(false)





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

onMounted(fetchUser)



const processInput = (ref) => {
    if (!inputImage.value || !inputImage.value.files || !inputImage.value.files.length){
        modFile.value = login.image
    } else {
        // Retrieve image input file
        const file = inputImage.value.files[0]

        // Read the image file
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            // Change image
            modFile.value = reader.result
        }
        reader.onerror = (error) => {
            console.log('Error: ', error)
        }
    }

    // Reset form
    filename.value = []
}

function saveChanges(){
    if(cUsername.value === '' && cDescription.value === '') return

    modName.value = false
    if(cUsername.value == '')
    {
        login.username = login.username
        currentUser.username = login.username
    }
    else
    {
        login.username = cUsername.value
        currentUser.username = login.username
    }
    modDesc.value = false
    login.description = cDescription.value
    currentUser.description = login.description
    dialog = false
}

function sendtoDB(){

    if (cUsername.value == '')
    {
        cUsername.value = login.username
    }

    if (cDescription.value == '')
    {
        cDescription.value = login.description
    }

    if (filename.value == '')
    {
        modFile.value = `https://robohash.org/${login.username}`
    } 

    //processInput(this/$ref.inputImage)
    

    fetch(`${API_URL}/users/${login.id}`,{
    method: 'PATCH',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({
        username: cUsername.value,
        image: modFile.value,
        description: cDescription.value,
    }),
    }
    )
    .then((response) => response.json())
    .then((json) => console.log(json));

    login.username = cUsername.value
    //currentUser.username = login.username
    login.image = modFile.value
    //currentUser.image = login.image
    //currentUser.description = login.description

    Router.push({ name: 'profile', vparams:{ username: login.username } })

}



</script>

<template>
    <NavigationBar />
    <div id="header">
        <VImg
            src="https://ik.imagekit.io/ikmedia/backlit.jpg"
            alt="Background image"
            id="bg-image"
            height="150"
            :aspect-ratio="1"
            cover=""
        />
        <div id="user-panel">
            <div id="user-data">
                <VAvatar
                    size="150"
                    class="mb-3"
                    variant="tonal"
                    :style="{ cursor: editing ? 'pointer' : 'default' }"
                >

                    <VImg :src="currentUser.image" alt="Profile image" :aspect-ratio="1" />
                </VAvatar>
                
                
                   <!--
                    v-if="!editing" 
                    <VFileInput
                        v-else 
                        v-model="currentUser.image"
                        label="Insert image"
                        clearable="clearable"
                        accept="image/*"
                        prepend-icon="mdi-camera"
                        ref="inputImage"
                    ></VFileInput>
                
                <VBtn
                    >
                        Edit Picture
                </VBtn>
                -->

                <span id="username" class="rounded-pill pa-1 px-3">{{
                    currentUser.username
                }}</span>
                
            </div>
            <div id="user-description">
                <span>
                    {{ currentUser.description }}
                </span>
            </div>
        </div>

            
        <v-row justify="center">
            <v-dialog
            v-model="dialog"
            persistent
            width="1024"
            >
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
                            <v-col
                            cols="12"
                            >
                                <span class="label1">
                                    New Username
                                </span>
                                <VTextField
                                    label="A user can go by many names, but they still keep their own identity."
                                    v-model="cUsername"
                                >
                                </VTextField>
                                <small class="note">
                                    Username should be at least 1 character long. Otherwise, the empty string will not be saved
                                </small>
                            </v-col>
                            <v-col cols="12">
                                <span class="label2">
                                    New Description
                                </span>
                                <VTextField
                                    label="Don't forget to bake it with love!"
                                    v-model="cDescription"
                                ></VTextField>
                            </v-col>
                            <v-col cols="12">
                                <span class="label2">
                                    New Profile Picture
                                </span>
                                <v-file-input
                                    label="Change profile picture"
                                    v-model="filename"
                                    accept="image*/"
                                    clearable="clearable"
                                    ref="inputImage"
                                ></v-file-input>
                                <VBtn
                                @click="processInput"
                                class="Submit"
                                >
                                    Submit Picture
                                </VBtn>
                            </v-col>
                            <v-col cols="12">
                                <VBtn
                                @click="sendtoDB"
                                class="Submit"
                                >
                                    Save Changes
                                </VBtn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <VBtn
                    color="red-darken-1"
                    variant="text"
                    @click= "dialog = false"
                    >
                        Save and Close
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
        />
        <ThemeSwitch />
    </div>
</template>

<style scoped>
#header {
    height: 35vh;
    width: 100vw;
}

#bg-image {
    position: relative;
    top: var(--navbar-height);
    left: 0;
    z-index: -1;
}

#user-panel {
    display: flex;
    position: absolute;
    top: calc(var(--navbar-height) + 3vh);
    left: 10vw;
    width: 100vw;
    flex-flow: row wrap;
    justify-content: flex-start;
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
    margin: 12vh 0 0 1rem;
    width: 50vw;
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
    width: 100%;
    gap: 2rem;
}

</style>
