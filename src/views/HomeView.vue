<script setup>
import HomePage from '../components/HomePage.vue'
document.title = 'Compact Donuts | Home'
</script>

<template>
    <div id="homepage">
        <HomePage />
    </div>
</template>

<style scoped>
@media (min-width: 1024px) {
    #homepage {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}
</style>
