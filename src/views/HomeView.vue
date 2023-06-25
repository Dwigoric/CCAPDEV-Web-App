<script setup>
// Import packages
import router from '../router'
import { onBeforeMount } from 'vue'

// Import components
import HomePage from '../components/HomePage.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'

// Import stores
import { useLoggedInStore } from '@/stores/loggedIn'

document.title = 'Compact Donuts | Home'

onBeforeMount(() => {
    const loggedInStore = useLoggedInStore()

    if (loggedInStore.username) {
        router.push({ name: 'feed' })
    }
})
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
