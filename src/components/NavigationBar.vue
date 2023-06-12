<script setup>
import { useLoggedInStore } from '../stores/loggedIn'

const loggedInStore = useLoggedInStore()
</script>

<template>
    <header>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/feed">Feed</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <div id="user">
            <span v-if="loggedInStore.username"> Logged in as {{ loggedInStore.username }} </span>
            <span v-else> Not logged in </span>
        </div>
    </header>
</template>

<style scoped>
a {
    color: var(--color-dark-pink);
    text-decoration: none;
    font-weight: bold;
    font-size: large;
}

/* Put nav as a bar on top of the page */
header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    height: 3rem;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: var(--vt-c-black-soft);
    z-index: 1;
    width: 100%;
}
</style>
