<script setup>
import NavigationBar from '../components/NavigationBar.vue'

document.title = 'Compact Donuts | Feed'
</script>

<template>
    <NavigationBar />
    <div id="feed">
        <div class="feed-element" id="left-sidebar">This is the left sidebar.</div>
        <div class="feed-element" id="posts">
            <span>This is where the posts go.</span>
            <span>There are no posts yet.</span>
        </div>
        <div class="feed-element" id="right-sidebar">This is the right sidebar.</div>
    </div>
</template>

<style scoped>
#feed {
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    align-self: baseline;
    min-height: calc(100vh - var(--navbar-height));
}

.feed-element {
    display: flex;
    flex-grow: 1;
}

#left-sidebar,
#right-sidebar {
    background-color: var(--color-background);
    position: sticky;
    height: calc(100vh - var(--navbar-height));
    align-self: flex-start;
    top: var(--navbar-height);
}

#left-sidebar {
    flex-flow: row nowrap;
    justify-content: right;
    flex-grow: 2;
}

#posts {
    flex-flow: column nowrap;
    align-items: center;
    flex-grow: 6;
    background-color: var(--color-background-mute);
}

#right-sidebar {
    flex-flow: row nowrap;
    justify-content: left;
    flex-grow: 3;
}

@media (min-width: 1024px) {
    .feed-element {
        padding: 40px;
    }
}
</style>
