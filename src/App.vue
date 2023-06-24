<script setup>
import { useIsDarkStore } from './stores/is-dark'
import { useMediaQuery } from '@vueuse/core'

const isDarkStore = useIsDarkStore()

const prefersDark = useMediaQuery('(prefers-color-scheme: dark)').value
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
isDarkStore.isDark = prefersDark
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
