<script setup>
// Import packages
import { ref, defineProps } from 'vue'
import router from '../router'

// Import stores
import { useLoggedInStore } from '@/stores/loggedIn'
import { useTempRegisterStore } from '@/stores/tempRegister'

// Define variables
const USER_API = 'https://dummyjson.com/users/'
const DEFAULT_BG_IMAGE = 'https://ik.imagekit.io/ikmedia/backlit.jpg'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isClicked = ref()
const invalidCredentials = ref(false)
const invalidCredentialsMessage = ref('Invalid Credentials')
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const remember = ref(false)
const form = ref(null)

// Form rules
const usernameRules = [
    (v) => !!v || 'Username is required',
    (v) => (v && v.length <= 20) || 'Username must be less than 20 characters'
]
const passwordRules = [
    (v) => !!v || 'Password is required',
    (v) => (v && v.length >= 6) || 'Password must be at least 6 characters'
]
const confirmPasswordRules = [
    ...passwordRules,
    (v) => v === password.value || 'Passwords do not match'
]

// Define functions
const authenticate = async (userLogin) => {
    const loggedInStore = useLoggedInStore()

    // Store user in the loggedInStore
    loggedInStore.id = userLogin.id
    loggedInStore.username = userLogin.username
    loggedInStore.image = userLogin.image
    loggedInStore.bgImage = userLogin.bgImage || DEFAULT_BG_IMAGE

    invalidCredentials.value = false

    // Set cookie
    if (remember.value) userLogin.persist = true
    window.$cookies.set('user', userLogin, remember.value ? '21d' : 0)

    // Redirect to the feed page using the router
    return router.push({ name: 'feed' })
}

const login = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    // Set isClicked to true to disable the button
    isClicked.value = true

    // Check if user is in temporary register store
    const tempRegisterStore = useTempRegisterStore()
    const tempUser = tempRegisterStore.tempUsers.find((user) => user.username === username.value)
    if (tempUser) {
        if (tempUser.password === password.value) {
            await authenticate({
                id: tempUser.id,
                username: tempUser.username,
                image: tempUser.image,
                bgImage: tempUser.bgImage
            })
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

    await authenticate({
        id: users[0].id,
        username: users[0].username,
        image: users[0].image
    })
}

const registerUser = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

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
        id: 100 + tempRegisterStore.tempUsers.length + 1,
        username: username.value,
        password: password.value,
        image: `https://robohash.org/${username.value}.png`
    })

    await authenticate({
        id: 100 + tempRegisterStore.tempUsers.length + 1,
        username: username.value,
        image: `https://robohash.org/${username.value}.png`
    })
}

defineProps({
    buttonText: {
        type: String,
        required: true
    },
    showConfirmPassword: {
        type: Boolean,
        required: false,
        default: false
    }
})
</script>

<template>
    <VForm method="post" @submit.prevent ref="form">
        <VTextField
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            :rules="usernameRules"
            validate-on="input lazy"
            v-model.lazy="username"
        />
        <VTextField
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            id="password"
            name="password"
            placeholder="Password"
            :rules="passwordRules"
            validate-on="input lazy"
            v-model.lazy="password"
            @click:append-inner="showPassword = !showPassword"
        />
        <VTextField
            v-if="showConfirmPassword"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            :append-inner-icon="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            :rules="confirmPasswordRules"
            validate-on="input lazy"
            v-model.lazy="confirmPassword"
            @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
        />
        <VCheckbox label="Remember me" v-model="remember" />
        <span v-if="invalidCredentials" id="invalidCredentials">
            {{ invalidCredentialsMessage }}
        </span>
        <VBtn
            type="submit"
            rounded="xl"
            size="x-large"
            class="ma-3"
            :loading="isClicked"
            @click="
                () => {
                    showConfirmPassword ? registerUser() : login()
                }
            "
        >
            {{ buttonText }}
        </VBtn>
    </VForm>
</template>

<style scoped>
.v-form {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
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

.v-input {
    font-family: var(--source-sans);
    width: 100%;
    border-radius: 30px;
    color: var(--color-text);
}

#invalidCredentials {
    padding: 10px;
    border-radius: 10px;
    background-color: var(--color-pale-red);
}
</style>
