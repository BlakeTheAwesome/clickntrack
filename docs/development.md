# Click N Track
This application is written as a web app that is built into a complete HTML, which means it can be run from the local file system without getting CORS errors or needing a server.

The main technologies used in this application are:
- [npm](https://www.npmjs.com/) (Package Management)
- [TypeScript](https://www.typescriptlang.org/) (The language used for development)
- [Vite](https://vitejs.dev/) (The build tool)
- [Vue 3](https://vuejs.org/) (The application framework)
- [Pinia](https://pinia.vuejs.org/) (The recommended data store for Vue 3)
- [PrimeVue](https://primevue.org/) (The component library used)
- [Zod](https://zod.dev/) (Schema validation, used for import/export)
- [ESLint](https://eslint.org/) (For code linting)
- [Prettier](https://prettier.io/) (For code formatting)

## Project Setup

### Prerequisites
Before you start you will need to install the correct Node version (currently `v24.13.1`).
The easiest way to ensure you have the right versions installed and enabled is to use [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm). With `nvm` installed, you can use the `.nvmrc` file in this directory to install the correct versions.
```sh
nvm use
```


<br />

### Installation
With `Node` and `npm` configured, you can install the required packages by running this command:
```sh
npm install
```
You will need to re-run this command whenever the packages are updated in the `package.json` file.


<br />

## Running the project
### Compile and Hot-Reload for Development
To run a development server with hot-reloading, run the following command:
```sh
npm run dev
```
This will start a development server at http://localhost:5173 and will automatically reload the page whenever you make changes to the source code.


<br />

### Type-Check, Compile and Minify for Production
To create a static build that can be run in the browser:
```sh
npm run build
```
This will build the files to the `dist` directory. You can then run the build by opening the `index.html` file in your browser.

<br />

## Validation checks
### Lint with [ESLint](https://eslint.org/)
You can run ESLint to check for errors by running the following command:
```sh
npm run lint
```
<br />

### Format the code with [Prettier](https://prettier.io/)
You can run prettier to format the code:
```sh
npm run format
```

## Troubleshooting
If the app encounters an error on startup (for example because a store schema changed and the saved data no longer matches), it will display a recovery screen. From there you can download a backup of the raw localStorage data or clear it and reload — no need to open DevTools.

If you need to clear localStorage manually (e.g. in a headless environment), all app keys are prefixed with `clickntrack-pinia-`.