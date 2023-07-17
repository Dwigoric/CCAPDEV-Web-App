<script setup></script>

<template>
    <div class="container">
        <img alt="logo" src="@/assets/donut_love.svg" id="logo" />
        <h1>404</h1>
        <p>Page not found</p>
        <router-link to="/">Go back to home</router-link>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}

#logo {
    width: 30rem;
    height: 30rem;
}
</style>
