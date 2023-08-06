<script setup>
// Import components
import { ref } from 'vue'

// Define variables
const opened = ref('')
</script>

<template>
    <VContainer id="container">
        <div class="mt-12">
            <img alt="Donut trees" class="logo" src="@/assets/donut_love.svg" />
            <div class="greetings">
                <h1 class="blue">Compact Donuts</h1>
            </div>
            <nav>
                <RouterLink to="/feed">Go back to feed</RouterLink>
            </nav>
        </div>
        <main>
            <VContainer id="details">
                <h2>What's this?</h2>
                <p>
                    Compact Donuts is a forum web application created in fulfillment for the course
                    Web Application Development (CCAPDEV).
                </p>
                <p>
                    This web application is made using HTML, CSS, JavaScript following the Vue
                    Framework.
                </p>
                <h2>Our Goal</h2>
                <p>
                    The goal of Compact Donuts is to allow users to share their thoughts in a forum
                    that will help create sweet and memorable experiences for all to see.
                </p>
                <h2>Repositories</h2>
                <p>
                    You may access our
                    <a href="https://github.com/Dwigoric/CCAPDEV-Web-App">frontend repository</a>
                    and our
                    <a href="https://github.com/Dwigoric/CCAPDEV-Server-App">backend repository</a>.
                    We hope you enjoy our work!
                </p>
                <h2>Deployments</h2>
                <p>
                    This project's frontend portion is hosted on
                    <a href="https://pages.github.com/">GitHub Pages</a>. Big thanks!
                </p>
                <p>
                    On the other hand, the backend portion is hosted on
                    <a href="https://azure.microsoft.com/en-us/products/app-service/web"
                        >Azure App Service</a
                    >. Thank you!
                </p>
                <h2>NPM Packages and Third-Party Libraries Used</h2>
                <p>
                    Our deepest gratitude goes to those who developed the tools we used to create
                    this project.
                </p>
                <p>Without you, this project would have been much more difficult to create.</p>
                <VList class="w-100" v-model:opened="opened">
                    <VListGroup value="Frontend">
                        <template v-slot:activator="{ props }">
                            <VListItem v-bind="props" title="Frontend"></VListItem>
                        </template>
                        <VListItem title="Vue" prepend-icon="mdi-vuejs" href="https://vuejs.org" />
                        <VListItem
                            title="Vuetify"
                            prepend-icon="mdi-vuetify"
                            href="https://vuetifyjs.com"
                        />
                        <VListItem
                            title="dotenv"
                            prepend-icon="mdi-npm"
                            href="https://www.dotenv.org/"
                        />
                        <VListItem
                            title="Moment.js"
                            prepend-icon="mdi-clock-time-nine-outline"
                            href="https://momentjs.com/"
                        />
                        <VListItem
                            title="jwt-decode"
                            prepend-icon="mdi-npm"
                            href="https://github.com/auth0/jwt-decode"
                        />
                        <VListItem
                            title="Pinia"
                            prepend-icon="mdi-fruit-pineapple"
                            href="https://pinia.vuejs.org/"
                        />
                        <VListItem
                            title="vue-cookies"
                            prepend-icon="mdi-cookie-outline"
                            href="https://github.com/cmp-cc/vue-cookies"
                        />
                        <VListItem
                            title="vue-waypoint"
                            prepend-icon="mdi-npm"
                            href="https://github.com/scaccogatto/vue-waypoint"
                        />
                        <VListItem
                            title="ESLint"
                            prepend-icon="mdi-eslint"
                            href="https://eslint.org/"
                        />
                        <VListItem
                            title="Prettier"
                            prepend-icon="mdi-npm"
                            href="https://prettier.io/"
                        />
                    </VListGroup>
                    <VListGroup value="Backend">
                        <template v-slot:activator="{ props }">
                            <VListItem v-bind="props" title="Backend"></VListItem>
                        </template>
                        <VListItem
                            title="Express"
                            prepend-icon="mdi-server"
                            href="https://expressjs.com/"
                        />
                        <VListItem
                            title="MongoDB Node.js Driver"
                            prepend-icon="mdi-database-outline"
                            href="https://github.com/mongodb/node-mongodb-native"
                        />
                        <VListItem
                            title="Passport.js"
                            prepend-icon="mdi-passport"
                            href="https://www.passportjs.org"
                        />
                        <VListItem
                            title="jsonwebtoken"
                            prepend-icon="mdi-npm"
                            href="https://github.com/auth0/node-jsonwebtoken"
                        />
                        <VListItem
                            title="@sapphire/utilities"
                            prepend-icon="mdi-npm"
                            href="https://github.com/sapphiredev/utilities"
                        />
                        <VListItem
                            title="argon2"
                            prepend-icon="mdi-form-textbox-password"
                            href="https://github.com/ranisalt/node-argon2"
                        />
                        <VListItem
                            title="cors"
                            prepend-icon="mdi-npm"
                            href="https://github.com/expressjs/cors"
                        />
                        <VListItem
                            title="debug"
                            prepend-icon="mdi-npm"
                            href="https://github.com/debug-js/debug"
                        />
                        <VListItem
                            title="dotenv"
                            prepend-icon="mdi-npm"
                            href="https://www.dotenv.org/"
                        />
                        <VListItem
                            title="http-errors"
                            prepend-icon="mdi-npm"
                            href="https://github.com/jshttp/http-errors"
                        />
                        <VListItem
                            title="morgan"
                            prepend-icon="mdi-script-text-outline"
                            href="https://github.com/expressjs/morgan"
                        />
                        <VListItem
                            title="multer"
                            prepend-icon="mdi-file-cloud-outline"
                            href="https://github.com/expressjs/multer"
                        />
                        <VListItem
                            title="NProgress"
                            prepend-icon="mdi-progress-download"
                            href="https://github.com/rstacruz/nprogress"
                        />
                        <VListItem
                            title="uuid"
                            prepend-icon="mdi-identifier"
                            href="https://github.com/uuidjs/uuid"
                        />
                    </VListGroup>
                </VList>
            </VContainer>
        </main>
    </VContainer>
</template>

<style scoped>
#container {
    min-height: 100vh;
    flex-basis: 100vw;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

header {
    display: flex;
    flex: 1 0 auto;
    flex-flow: column nowrap;
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

#details {
    margin-top: calc(var(--navbar-height));
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    width: 100%;
    border-radius: 5px;
    border: none;
    outline: none;
    gap: 1rem;
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
