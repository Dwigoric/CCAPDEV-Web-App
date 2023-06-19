<script setup>
import NavigationBar from '../components/NavigationBar.vue'
import ThemeSwitch from '../components/ThemeSwitch.vue'
import { useMediaQuery } from '@vueuse/core'

document.title = 'Compact Donuts | Feed'
</script>

<template>
    <NavigationBar />
    <div id="feed">
        <div
            class="feed-element"
            id="left-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            This is the left sidebar.
        </div>
        <div class="feed-element" id="posts">
            <div class="flexboxColumn" id="PostLayout">
                <div class="flexboxRow">
                    <span class="profilePic" id="adachiPfp"></span>
                    <span class="originalPoster"> Adachi &nbsp; </span>
                    <span class="originalPoster"> @Cabbage_Man </span>
                </div>
                <div class="postContent" id="adachiPost"></div>
            </div>
        </div>
        <div
            class="feed-element"
            id="right-sidebar"
            v-if="useMediaQuery('(min-width: 1024px)').value"
        >
            This is the right sidebar.
            <ThemeSwitch />
        </div>
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
    padding: 40px;
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
    flex-flow: column-reverse nowrap;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 6;
    background-color: var(--color-background-mute);
}

#right-sidebar {
    flex-flow: row nowrap;
    justify-content: left;
    flex-grow: 3;
}
/* Flex Box for the class*/
.flexboxColumn {
    display: flex;
    flex-direction: column;
}

.flexboxRow {
    display: flex;
    flex-direction: row;
    margin-bottom: 1em;
}

/* CSS FOR THE POST */
.postContent {
    background-color: brown;
    background-size: 100%;
    background-repeat: no-repeat;
}
/* ID for the anime man post image */
#adachiPost {
    background-image: url('../assets/adachi_true.jpg');
    height: 383px;
    width: 414px;
}
/* Profile CSS */
.profilePic {
    margin-left: 1em;
    margin-right: 1em;
    width: 50px;
    height: 50px;
    background-size: 100%;
    background-color: blue;
}

#adachiPfp {
    background-image: url('../assets/adachi_pfp.png');
}

.originalPoster {
    margin-top: auto;
    margin-bottom: auto;
}
/*Post Layout*/
#PostLayout {
    border: 2px solid;
    border-radius: 25px;
    padding: 1em 1em 1em 1em;
}
</style>
