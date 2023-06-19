<script setup>
import { useLoggedInStore } from '../stores/loggedIn'
import { useMediaQuery } from '@vueuse/core'

const loggedInStore = useLoggedInStore()

const logout = () => {
    // Unset username and password in the loggedInStore
    loggedInStore.username = ''
    loggedInStore.image = ''
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
        <div class="navbar-item" id="search-bar">There is a search bar here.</div>
        <div class="navbar-item" v-if="loggedInStore.username" id="user-panel">
            <span>
                <span v-if="useMediaQuery('(min-width: 1024px)').value"> {{ dayMessage() }}, </span>
                <span id="username">{{ loggedInStore.username }}</span>
                <span v-if="useMediaQuery('(min-width: 1024px)').value">!</span>
            </span>
            <div v-if="loggedInStore.image">
                <RouterLink to="/profile" id="profile-picture-link">
                    <img
                        class="user-image"
                        id="loggedin-user-image"
                        :src="loggedInStore.image"
                        alt="User"
                    />
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
}
</style>
