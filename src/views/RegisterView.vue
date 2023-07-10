<script setup>
// Import components
import NavigationBar from '../components/NavigationBar.vue'
import LoginBox from '../components/LoginBox.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'

document.title = 'Compact Donuts | Register'
</script>

<template>
    <ThemeSwitch />
    <NavigationBar />
    <main>
        <LoginBox button-text="Register" no-register-prompt show-confirm-password />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    align-self: baseline;
    margin-top: var(--navbar-height);
    min-height: calc(100vh - var(--navbar-height));
}
</style>
