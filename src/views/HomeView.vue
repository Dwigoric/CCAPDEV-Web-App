<script setup>
// Import components
import HomePage from '../components/HomePage.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'

document.title = 'Compact Donuts | Home'
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
