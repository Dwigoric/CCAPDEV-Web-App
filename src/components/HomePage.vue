<script setup>
import LoginBox from './LoginBox.vue'
</script>

<template>
    <header>
        <div class="wrapper">
            <img alt="Donut trees" class="logo" src="@/assets/donut_love.svg" />
            <div class="greetings">
                <h1 class="blue">Where sweet dreams come true</h1>
                <h3>A hole new world of donut discussions and delicious discoveries</h3>
            </div>
            <nav>
                <RouterLink to="/feed">What's cooking?</RouterLink>
            </nav>
        </div>
    </header>
    <main>
        <LoginBox button-text="Login" button-text-on-click="Logging in..." />
    </main>
</template>

<style scoped>
header {
    padding: 2rem;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    height: 100vh;
    min-height: 670px;
}

h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
    width: 65%;
}

nav {
    width: 100%;
    font-size: 1.2rem;
    text-align: center;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
}

@media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
        text-align: left;
    }

    .logo {
        margin: 0 2rem 0 0;
        width: 520px;
    }

    header {
        align-items: flex-end;
        padding: 50px;
        height: auto;
    }

    main {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        place-items: center;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;
        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
