<script setup>
import LoginBox from './LoginBox.vue'
</script>

<template>
    <header>
        <div class="wrapper">
            <img
                alt="Donut trees"
                class="logo"
                src="@/assets/donut_love.svg"
                width="250"
                height="250"
            />
            <div class="greetings">
                <h1 class="blue">Where sweet dreams come true</h1>
                <h3>A hole new world of donut discussions and delicious discoveries</h3>
            </div>
        </div>
        <nav>
            <RouterLink to="/feed">What's cooking?</RouterLink>
        </nav>
    </header>
    <main>
        <LoginBox />
    </main>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

nav {
    width: 100%;
    font-size: 1.2rem;
    text-align: center;
    margin-top: 2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
        text-align: left;
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    main .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
