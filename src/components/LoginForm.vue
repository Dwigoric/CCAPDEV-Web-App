<script setup>
// Import packages
import { ref } from 'vue'
import router from '../router'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'

// Import constants
import { API_URL } from '../constants'

// Define variables
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isClicked = ref()
const invalidCredentials = ref(false)
const invalidCredentialsMessage = ref('Invalid credentials')
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

    invalidCredentials.value = false

    // Set cookie
    window.$cookies.set(
        'user',
        { id: userLogin.id, persist: Boolean(remember.value) },
        remember.value ? '21d' : 0
    )

    // Redirect to the feed page using the router
    return router.push({ name: 'feed' })
}

const login = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    // Set isClicked to true to disable the button
    isClicked.value = true

    // Call the API to login
    const result = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
        .then((res) => res.json())
        .catch(console.error)

    if (result.error) {
        isClicked.value = false
        invalidCredentials.value = true
        invalidCredentialsMessage.value = result.message
        return
    }

    await authenticate({
        id: result.user.id,
        username: result.user.username,
        image: result.user.image
    })
}

const registerUser = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    // Set isClicked to true to disable the button
    isClicked.value = true

    // Check if the username is taken
    const params = new URLSearchParams()
    params.set('key', 'username')
    params.set('value', username.value)

    const result = await fetch(`${API_URL}/users/register`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
        .then((res) => res.json())
        .catch(console.error)

    if (result.error) {
        isClicked.value = false
        invalidCredentials.value = true
        invalidCredentialsMessage.value = result.message
        return
    }

    // TODO: Change this to a more secure method once we have a backend
    // Add user to the database

    await authenticate({
        id: result.user.id,
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
