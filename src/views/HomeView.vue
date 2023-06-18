<script setup>
import router from '../router'
import HomePage from '../components/HomePage.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'

document.title = 'Compact Donuts | Home'

import { useLoggedInStore } from '../stores/loggedIn'

const loggedInStore = useLoggedInStore()

if (loggedInStore.username) {
    router.push({ name: 'feed' })
}
</script>

<template>
    <ThemeSwitch />
    <div id="homepage">
        <HomePage />
    </div>
</template>

<style scoped>
@media (min-width: 1024px) {
    #homepage {
        min-height: 100vh;
        flex-basis: 100vw;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}
</style>
