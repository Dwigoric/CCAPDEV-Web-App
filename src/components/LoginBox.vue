<script setup>
import LoginForm from './LoginForm.vue'
</script>

<template>
    <div id="loginBox">
        <div id="loginHeader">
            Welcome to
            <span id="title">Compact Donuts</span>
        </div>
        <LoginForm />
        <div id="signUpPrompt">
            Don't have an account?
            <RouterLink to="/register">Sign up</RouterLink>
        </div>
    </div>
</template>

<style scoped>
#loginBox {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    font-size: 0.8rem;
    color: var(--vt-c-white-soft);
    background: var(--vt-c-black-mute);
    padding: 50px;
    flex-basis: 30vw;
}

#loginHeader {
    font-weight: 500;
    font-size: 1.6rem;
    top: -10px;
    justify-content: center;
    font-family: Montserrat, sans-serif;
    text-align: center;
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
    }
}
</style>
