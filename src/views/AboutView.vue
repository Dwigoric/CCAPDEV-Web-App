<script setup>
import { useMediaQuery } from '@vueuse/core'
import { Waypoint } from 'vue-waypoint'

// Import components
import NavigationBar from '../components/NavigationBar.vue'
//import ThemeSwitch from '../components/ThemeSwitch.vue'

</script>


<template>
    <NavigationBar />
    <div id="details">
        <h1> Facts About Compact Discs </h1>
        <h4></h4>
        <h2> About: </h2>
        <h4> - Compact Discs is a forum web application created in fulfillment for the course Web Application Development (CCAPDEV). </h4>
        <h4> - This web application is made using HTML, CSS, JavaScript following the Vue Framework. </h4>
        <h4> - Other tools used include MongoDB, NodeJS, Azure Websites, GitHub, Microsoft VS Code</h4>
        <h4></h4>
        <h2> Goal: </h2>
        <h4> - The goal of Compact Discs is to allow users to share their thoughts in a forum that will help create sweet and memorable experiences for all to see. </h4>
        <h4></h4>
        <h2> NPM Packages and Third-Patry Libraries Used: </h2>
        <h4> - dev: vite</h4>
        <h3> dependencies </h3>
        <h4> - @vueuse/core: ^10.2.0 </h4>
        <h4> - dotenv: ^16.3.1</h4>
        <h4> - jwt-decode: ^3.1.2</h4>
        <h4> - moment: ^2.29.4</h4>
        <h4> - pinia: ^2.0.36</h4>
        <h4> - vite-plugin-vuetify: ^1.0.2</h4>
        <h4> - vue: ^3.3.4</h4>
        <h4> - vue-cookies: ^1.8.3</h4>
        <h4> - vue-router: ^4.2.0</h4>
        <h4> - vue-waypoint: ^4.2.5</h4>
        <h4> - vuetify: ^3.3.5</h4>
        <h4></h4>
        <h1> The Compact Discs team appreciates you for using this forum page!</h1>

    </div>
</template>

<style scoped>
    .details{
        width: 100%;
        border-radius: 5px;
        border: none;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-dark-pink);
        outline: none;
    }
</style>