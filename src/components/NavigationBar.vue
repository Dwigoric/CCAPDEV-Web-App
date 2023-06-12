<script setup></script>

<template>
    <header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/feed">Feed</RouterLink>
            <RouterLink to="/profile">Profile</RouterLink>
            <RouterLink to="/login">Login</RouterLink>
        </nav>
    </header>
</template>

<style scoped>
a {
    color: var(--color-dark-pink);
    text-decoration: none;
    font-weight: bold;
    font-size: large;
}

/* Put nav as a bar on top of the page */
header {
    position: sticky;
    top: 0;
    background-color: var(--vt-c-black-soft);
    z-index: 1;
    width: 100%;
}

/* Put nav links in a row */
nav {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    height: 3rem;
}
</style>
