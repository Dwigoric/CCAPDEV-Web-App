<script setup>
import { useLoggedInStore } from '../stores/loggedIn'

const loggedInStore = useLoggedInStore()

const logout = () => {
    // Unset username and password in the loggedInStore
    loggedInStore.username = ''
    loggedInStore.image = ''
}
</script>

<template>
    <header>
        <div class="navbar-item">
            <RouterLink to="/feed">Feed</RouterLink>
        </div>
        <div class="navbar-item" v-show="loggedInStore.username">
            <RouterLink to="/profile">Profile</RouterLink>
        </div>
        <div class="navbar-item">
            <RouterLink v-if="!loggedInStore.username" to="/">Login</RouterLink>
            <RouterLink v-else to="/" @click="logout">Logout</RouterLink>
        </div>
        <div class="navbar-item">
            <span v-if="loggedInStore.username">
                Hello, <span id="username">{{ loggedInStore.username }}</span
                >!
            </span>
            <span v-else> Not logged in </span>
            <div>
                <img
                    class="user-image"
                    id="loggedin-user-image"
                    v-show="loggedInStore.image"
                    :src="loggedInStore.image"
                    alt="User"
                />
            </div>
        </div>
    </header>
</template>

<style scoped>
.navbar-item {
    display: flex;
    flex-grow: 1;
    align-items: center;
    text-align: center;
}

.user-image {
    border-radius: 50%;
    border: 2px solid var(--color-border);
    margin: 0 1rem;
}

#loggedin-user-image {
    height: var(--navbar-height);
    border-radius: 50%;
    border: none;
}

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
    flex-basis: 100vw;
    justify-content: center;
    height: var(--navbar-height);
    align-items: center;
    position: sticky;
    top: 0;
    background-color: var(--color-background-soft);
    z-index: 1;
    border-bottom: var(--color-bright-blue) solid 2px;
}

#username {
    color: var(--color-dark-pink);
}

header a.router-link-exact-active {
    color: var(--color-text);
}

header a.router-link-exact-active:hover {
    background-color: transparent;
}

.navbar-item {
    display: flex;
    justify-content: center;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
    align-self: stretch;
}

.navbar-item:first-of-type {
    border: 0;
}
</style>
