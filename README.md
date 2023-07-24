# Compact Donuts

This is the forum for the Compact Donuts project.
This is for partial fulfillment of the requirements for the course CCAPDEV.

## Customize API endpoint
The API endpoint is set to `https://compact-donuts.azurewebsites.net` by default.
You can change this by setting the `VITE_API_URL` environment variable.

You can do this by cloning the `example.env` file and renaming it to `.env`.
Then, change the value of `VITE_API_URL` to your desired API endpoint.

Alternatively, you can also set the `VITE_API_URL` environment variable
directly in your terminal before running the `npm run dev` command.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
