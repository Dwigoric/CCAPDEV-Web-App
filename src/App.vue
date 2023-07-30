<script setup>
// Import packages
import { inject } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import jwt_decode from 'jwt-decode'

// Import stores
import { useLoggedInStore } from './stores/loggedIn'
import { useIsDarkStore } from './stores/is-dark'
import { useTheme } from 'vuetify'

// Define variables
const loggedInStore = useLoggedInStore()
const isDarkStore = useIsDarkStore()
const theme = useTheme()

const $cookies = inject('$cookies')
const credentials = $cookies.get('credentials')
if (credentials) {
    // Decode the token
    const { id } = jwt_decode(credentials.token)
    loggedInStore.id = id

    // Extend the cookie if it's set to persist
    if (credentials.persist) $cookies.set('user', credentials, '21d')

    // Fetch the user
    loggedInStore.fetchUser()
}

const prefersDark = useMediaQuery('(prefers-color-scheme: dark)').value
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
isDarkStore.isDark = prefersDark
theme.global.name.value = prefersDark ? 'dark' : 'light'
</script>

<template>
    <RouterView />
</template>

<style>
/* Import Material Design Icons */
@import 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css';

main {
    line-height: 1.5;
}
</style>
