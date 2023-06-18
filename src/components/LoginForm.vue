<script>
import { ref } from 'vue'
import router from '../router'

import { useLoggedInStore } from '../stores/loggedIn'
import { useTempRegisterStore } from '../stores/tempRegister'

const USER_API = 'https://dummyjson.com/users/'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isClicked = ref()
const invalidCredentials = ref(false)
const invalidCredentialsMessage = ref('Invalid Credentials')

const authenticate = async (image) => {
    const loggedInStore = useLoggedInStore()

    // Store user in the loggedInStore
    loggedInStore.username = username.value
    loggedInStore.image = image

    invalidCredentials.value = false

    // Redirect to the feed page using the router
    await router.replace('feed')
}

const login = async () => {
    // Set isClicked to true to disable the button
    isClicked.value = true

    // Check if user is in temporary register store
    const tempRegisterStore = useTempRegisterStore()
    const tempUser = tempRegisterStore.tempUsers.find((user) => user.username === username.value)
    if (tempUser) {
        if (tempUser.password === password.value) {
            await authenticate(tempUser.image)
            return
        } else {
            isClicked.value = false
            invalidCredentials.value = true
            invalidCredentialsMessage.value = 'Invalid credentials'
            return
        }
    }

    // Create URL Search Params
    const params = new URLSearchParams()
    params.set('key', 'username')
    params.set('value', username.value)

    // Fetch the user if they exist
    const { users } = await fetch(`${USER_API}/filter?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => res.json())
        .catch((err) => console.error(err))

    // TODO: Change this to a more secure method once we have a backend
    // Check if the user exists
    if (!users.length || users[0].password !== password.value) {
        isClicked.value = false
        invalidCredentials.value = true
        invalidCredentialsMessage.value = 'Invalid credentials'
        return
    }

    await authenticate(users[0].image)
}

const registerUser = async () => {
    // Set isClicked to true to disable the button
    isClicked.value = true

    // Check if the passwords match
    if (password.value !== confirmPassword.value) {
        isClicked.value = false
        invalidCredentials.value = true
        invalidCredentialsMessage.value = 'Passwords do not match'
        return
    }

    // Check if the username is taken
    const params = new URLSearchParams()
    params.set('key', 'username')
    params.set('value', username.value)

    const { users } = await fetch(`${USER_API}/filter?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((res) => res.json())
        .catch((err) => console.error(err))

    if (users.length) {
        isClicked.value = false
        invalidCredentials.value = true
        invalidCredentialsMessage.value = 'Username is already taken'
        return
    }

    // TODO: Change this to a more secure method once we have a backend
    // Add user to the database

    const tempRegisterStore = useTempRegisterStore()
    tempRegisterStore.tempUsers.push({
        username: username.value,
        password: password.value,
        image: `https://robohash.org/${username.value}.png`
    })

    await authenticate(`https://robohash.org/${username.value}.png`)
}

export default {
    setup() {
        username.value = ''
        password.value = ''
        confirmPassword.value = ''
        isClicked.value = false

        return {
            username,
            password,
            confirmPassword,
            isClicked,
            login,
            registerUser,
            invalidCredentials,
            invalidCredentialsMessage
        }
    },

    props: {
        buttonText: {
            type: String,
            required: true
        },
        buttonTextOnClick: {
            type: String,
            required: true
        },
        showConfirmPassword: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>

<template>
    <form id="loginForm" method="post">
        <input
            class="inputField"
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            v-model.lazy="username"
        />
        <input
            class="inputField"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            v-model.lazy="password"
        />
        <input
            v-if="showConfirmPassword"
            class="inputField"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            v-model.lazy="confirmPassword"
        />
        <span v-show="invalidCredentials" id="invalidCredentials">
            {{ invalidCredentialsMessage }}
        </span>
        <input
            type="button"
            :class="{
                loginButton: true,
                noButton:
                    isClicked ||
                    !username.length ||
                    !password.length ||
                    (showConfirmPassword && !confirmPassword.length)
            }"
            @click="
                () => {
                    showConfirmPassword ? registerUser() : login()
                }
            "
            :value="isClicked ? buttonTextOnClick : buttonText"
        />
    </form>
</template>

<style scoped>
#loginForm {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.inputField {
    margin: 10px;
    flex-basis: 75%;
    min-width: 75%;
    float: left;
}

.loginButton {
    font-family: var(--source-sans);
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--vt-c-black-soft);
    background-color: var(--color-dark-pink);
    border: none;
    border-radius: 20px;
    padding: 15px 25px;
    margin: 8px 0;
    cursor: pointer;
}

.loginButton:hover {
    background-color: var(--color-bright-pink);
}

.noButton {
    background-color: var(--vt-c-black-soft);
    color: var(--vt-c-white-soft);
    pointer-events: none;
}

input[type='text'],
input[type='password'] {
    font-family: var(--source-sans);
    width: 100%;
    padding: 20px 25px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid var(--vt-c-black-soft);
    border-radius: 30px;
    background-color: var(--vt-c-white-soft);
}

#invalidCredentials {
    padding: 10px;
    border-radius: 10px;
    background-color: var(--color-pale-red);
}
</style>
