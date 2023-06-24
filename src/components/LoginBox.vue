<script setup>
import LoginForm from './LoginForm.vue'

defineProps({
    buttonText: {
        type: String,
        required: true
    },
    buttonTextOnClick: {
        type: String,
        required: true
    },
    noRegisterPrompt: {
        type: Boolean,
        required: false,
        default: false
    },
    showConfirmPassword: {
        type: Boolean,
        required: false,
        default: false
    }
})
</script>

<template>
    <div id="loginBox">
        <div id="loginHeader">
            Welcome to
            <span id="title">Compact Donuts</span>
        </div>
        <LoginForm
            :button-text="buttonText"
            :button-text-on-click="buttonTextOnClick"
            :show-confirm-password="showConfirmPassword"
        />
        <div id="signUpPrompt" v-if="!noRegisterPrompt">
            Don't have an account?
            <RouterLink to="/register">Sign up</RouterLink>
        </div>
    </div>
</template>

<style scoped>
#title {
    background: linear-gradient(to right, var(--color-dark-pink), var(--color-bright-blue));
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text; /* For Chromium browsers */
}

#loginBox {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    font-size: 0.8rem;
    color: var(--vt-c-white-soft);
    background: var(--vt-c-black-mute);
    padding: 50px 50px 150px;
    flex-basis: 100%;
}

#loginHeader {
    font-weight: 500;
    font-size: 1.6rem;
    top: -10px;
    justify-content: center;
    font-family: Montserrat, sans-serif;
    text-align: center;
    margin-bottom: 1rem;
}

#loginHeader span {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
}

@media (min-width: 1024px) {
    #loginBox {
        flex-basis: 30vw;
        font-size: 1.2rem;
        border-radius: 35px;
        padding: 50px;
    }
}
</style>
