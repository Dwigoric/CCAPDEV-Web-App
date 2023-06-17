<script>
import { ref } from 'vue'
import router from '../router'

import { useLoggedInStore } from '../stores/loggedIn'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isClicked = ref()

const login = () => {
    // TODO: Implement login functionality
    // Set isClicked to true to disable the button
    isClicked.value = true

    const loggedInStore = useLoggedInStore()

    // Set the user in the loggedInStore
    loggedInStore.username = username.value

    // Redirect to the feed page using the router
    router.push({ path: '/feed' })
}

const registerUser = () => {
    // TODO: Implement register functionality
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
            registerUser
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
</style>
