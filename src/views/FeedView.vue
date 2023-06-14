<script setup>
import NavigationBar from '../components/NavigationBar.vue'

document.title = 'Compact Donuts | Feed'
</script>

<template>
    <NavigationBar />
    <main>
        <div id="feed">
            <div class="feed-element" id="left-sidebar">This is the left sidebar.</div>
            <div class="feed-element" id="posts">
                <span>This is where the posts go.</span>
                <span>There are no posts yet.</span>
            </div>
            <div class="feed-element" id="right-sidebar">This is the right sidebar.</div>
        </div>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    flex-grow: 1;
}

#feed {
    display: flex;
}

.feed-element {
    display: flex;
    flex-grow: 1;
}

#left-sidebar {
    flex-flow: row nowrap;
    justify-content: right;
    flex-grow: 2;
    background-color: var(--color-dark-blue);
}

#posts {
    flex-flow: column nowrap;
    align-items: center;
    flex-grow: 6;
    background-color: var(--color-pale-blue);
}

#right-sidebar {
    flex-flow: row nowrap;
    justify-content: left;
    flex-grow: 3;
    background-color: var(--color-bright-blue);
}
</style>
