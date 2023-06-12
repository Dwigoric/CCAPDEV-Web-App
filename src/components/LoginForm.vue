<script setup></script>

<template>
    <div id="loginForm">
        <input
            class="inputField"
            type="text"
            id="username"
            name="username"
            placeholder="Username"
        />
        <input
            class="inputField"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
        />
        <div id="loginButton">
            <button type="submit">Login</button>
        </div>
    </div>
</template>

<style scoped>
#loginForm {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.inputField {
    margin: 10px;
    flex-basis: 75%;
    min-width: 75%;
    float: left;
}

button {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--vt-c-black-soft);
    background-color: var(--color-dark-pink);
    border: none;
    border-radius: 20px;
    padding: 15px 25px;
    margin: 8px 0;
    cursor: pointer;
    width: 100%;
}

button:hover {
    background-color: var(--color-bright-pink);
}

input[type='text'],
input[type='password'] {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    width: 100%;
    padding: 20px 25px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid var(--vt-c-black-soft);
    border-radius: 30px;
    background-color: var(--vt-c-white-soft);
}
</style>
