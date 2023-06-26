<script setup>
// Import packages
import { useMediaQuery } from '@vueuse/core'

// Import components
import SearchBar from './SearchBar.vue'

// Import stores
import { useLoggedInStore } from '../stores/loggedIn'

// Define variables
const loggedInStore = useLoggedInStore()

// Define functions
const logout = () => {
    // Unset username and password in the loggedInStore
    loggedInStore.id = -1
    loggedInStore.username = ''
    loggedInStore.image = ''

    // Remove cookie
    window.$cookies.remove('user')
}

const dayMessage = () => {
    const date = new Date()
    const hour = date.getHours()
    if (hour < 12) {
        return 'Good morning'
    } else if (hour < 18) {
        return 'Good afternoon'
    } else {
        return 'Good evening'
    }
}
</script>

<template>
    <header>
        <div class="navbar-item" v-if="useMediaQuery('(min-width: 1024px)').value">
            <RouterLink to="/feed" id="feed-link">Compact Donuts</RouterLink>
        </div>
        <div class="navbar-item" id="search-bar">
            <SearchBar />
        </div>
        <div class="navbar-item" v-if="loggedInStore.username" id="user-panel">
            <span>
                <span v-if="useMediaQuery('(min-width: 1024px)').value">{{ dayMessage() }}, </span>
                <span id="username">{{ loggedInStore.username }}</span>
                <span v-if="useMediaQuery('(min-width: 1024px)').value">!</span>
            </span>
            <div v-if="loggedInStore.image">
                <RouterLink to="/profile" id="profile-picture-link">
                    <VAvatar class="mx-2">
                        <img id="user-image" :src="loggedInStore.image" alt="User" />
                    </VAvatar>
                </RouterLink>
            </div>
            <RouterLink to="/" @click="logout">Logout</RouterLink>
        </div>
        <div class="navbar-item" v-else>
            <RouterLink to="/">Login</RouterLink>
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

#user-image {
    height: calc(var(--navbar-height) * 0.8);
    border-radius: 50%;
    border: none;
}

a {
    color: var(--color-dark-pink);
    text-decoration: none;
    font-weight: bold;
}

/* Put nav as a bar on top of the page */
header {
    display: flex;
    flex-flow: row nowrap;
    width: 100vw;
    justify-content: center;
    height: var(--navbar-height);
    align-items: center;
    position: fixed;
    top: 0;
    background-color: var(--color-background-soft);
    z-index: 1;
    border-bottom: var(--color-bright-blue) solid 2px;
    padding-right: 1rem;
}

#feed-link {
    background: linear-gradient(to left, var(--color-dark-pink), var(--color-bright-blue));
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text; /* For Chromium browsers */
}

#search-bar {
    flex-grow: 10;
    display: flex;
    justify-content: center;
    padding: 0;
}

#username {
    color: var(--color-dark-pink);
}

#profile-picture-link:hover {
    background-color: transparent;
}

header a.router-link-exact-active {
    color: var(--color-text);
}

#feed-link,
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

#user-panel {
    flex-grow: 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
}
</style>
