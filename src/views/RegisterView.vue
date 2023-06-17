<script setup>
import NavigationBar from '../components/NavigationBar.vue'
import LoginBox from '../components/LoginBox.vue'
import { useLoggedInStore } from '../stores/loggedIn'
import router from '../router'

document.title = 'Compact Donuts | Register'

const loggedInStore = useLoggedInStore()
if (loggedInStore.username) {
    router.push({ name: 'feed' })
}
</script>

<template>
    <NavigationBar />
    <main>
        <LoginBox
            button-text="Register"
            button-text-on-click="Registering..."
            no-register-prompt
            show-confirm-password
        />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    align-self: baseline;
}
</style>
