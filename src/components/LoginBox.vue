<script setup></script>

<template>
    <div id="loginBox">
        <div id="loginHeader">
            Welcome to
            <span id="title">Compact Donuts</span>
        </div>
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
        <div id="signUpPrompt">
            Don't have an account?
            <a>Sign up</a>
        </div>
    </div>
</template>

<style>
#loginBox {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    font-size: 1.2rem;
    color: var(--vt-c-white-soft);
    background: var(--vt-c-black-mute);
    padding: 50px;
    border-radius: 35px;
    flex-basis: 30vw;
    margin: 30px;
}

#loginHeader {
    font-weight: 500;
    font-size: 1.6rem;
    top: -10px;
    justify-content: center;
    font-family: Montserrat, sans-serif;
    text-align: center;
}

#loginHeader span {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
}

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
