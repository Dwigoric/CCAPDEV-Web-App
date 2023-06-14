<script setup>
import NavigationBar from '../components/NavigationBar.vue'

document.title = 'Compact Donuts | Feed'
</script>

<template>
    <NavigationBar />
    <div id="feed">
        <main>
            <h1>This is the feed page.</h1>
        </main>
    </div>
</template>

<style scoped>
body {
    width: 100%;
    display: flex;
}

#feed {
    display: flex;
    flex-basis: 100vw;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
}
</style>
