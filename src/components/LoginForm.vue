<script setup>
// Import packages
import { ref } from 'vue'
import router from '../router'
import jwt_decode from 'jwt-decode'

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
    (v) => (v && v.length <= 20) || 'Username must be less than 20 characters',
    (v) => /^[A-Za-z0-9]+$/.test(v) || 'Username can only be alphanumeric'
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
const saveUser = async (token) => {
    const loggedInStore = useLoggedInStore()

    // Decode the token.
    const { id } = jwt_decode(token)

    // Fetch the user
    const { user } = await fetch(`${API_URL}/users/${id}`)
        .then((res) => res.json())
        .catch(console.error)

    // Store user in the loggedInStore
    loggedInStore.id = user.id
    loggedInStore.username = user.username
    loggedInStore.image = user.image

    invalidCredentials.value = false

    // Set cookie
    window.$cookies.set(
        'credentials',
        { token, persist: Boolean(remember.value) },
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
    const { token, message } = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
        .then((res) => res.json())
        .catch(console.error)

    // If the token is not returned, then the credentials are invalid
    if (!token) {
        isClicked.value = false
        invalidCredentials.value = true
        invalidCredentialsMessage.value = message
        return
    }

    await saveUser(token)
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

    const { token, message } = await fetch(`${API_URL}/auth/signup`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
        .then((res) => res.json())
        .catch(console.error)

    if (!token) {
        isClicked.value = false
        invalidCredentials.value = true
        invalidCredentialsMessage.value = message
        return
    }

    await saveUser(token)
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
    <VForm id="login-form" method="post" @submit.prevent ref="form">
        <VTextField
            class="form-input"
            type="text"
            name="username"
            placeholder="Username"
            :rules="usernameRules"
            validate-on="input lazy"
            v-model.lazy="username"
        />
        <VTextField
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            name="password"
            placeholder="Password"
            :rules="passwordRules"
            validate-on="input lazy"
            v-model.lazy="password"
            @click:append-inner="showPassword = !showPassword"
        />
        <VTextField
            class="form-input"
            v-if="showConfirmPassword"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            :append-inner-icon="showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'"
            name="confirmPassword"
            placeholder="Confirm Password"
            :rules="confirmPasswordRules"
            validate-on="input lazy"
            v-model.lazy="confirmPassword"
            @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
        />
        <VCheckbox label="Remember me" v-model="remember" class="align-self-lg-start" />
        <VAlert type="error" closable="closable" v-model="invalidCredentials">
            {{ invalidCredentialsMessage }}
        </VAlert>
        <VBtn
            type="submit"
            rounded="xl"
            size="x-large"
            class="ma-3"
            :loading="isClicked"
            @click="
                () => {
                    invalidCredentials = false
                    showConfirmPassword ? registerUser() : login()
                }
            "
        >
            {{ buttonText }}
        </VBtn>
    </VForm>
</template>

<style scoped>
#login-form {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.form-input {
    width: 100%;
}
</style>
