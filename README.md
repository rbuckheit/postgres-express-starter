# postgres-express-starter

This starter repo can be used to quickly scaffold a web application stack using Postgres, Express, React, Node, and Typescript.

The Node ecosystem provides a number of powerful tools. However, choosing these tools and assembling them into a stack takes a lot of time and debugging. This project's goal is to disambiguate the process of choosing tools, and to speed up the process of putting them together and deploying an app.

Specifically, the project has objectives in a few different areas:

**Tools**

- Bundle together some of the highest quality and most widely used tools.
- Pre-configure those tools so that they work together seamlessly.
- Make project creation and development fast and easy.

**Structure**

- Offer structure/scaffolding to guide development, encourage separation of concerns, and keep the repository organized.
- Encourage best practices (such as testing, separating code from configuration, server fast-failure) by baking these in to the project from the onset.
- Encouraging code quality and safety through testing, linting, and language choice.

**Deployability**

- Minimize gaps between development and production environment.
- Reduce the spin-up time to move an application from development into production.

This project is a fork of [tg970/PERN-Advanced-Starter](https://github.com/tg970/PERN-Advanced-Starter) which has been modified to support Typescript.

## setup

1. Install `node` from https://nodejs.org/en/download
1. Install postgres from https://www.postgresql.org/download/
1. Clone, fork, or copy the code of this directory into your repo.
1. Run `npm install`.
1. Create a new postgres database named `express-starter` using your software of choice (PgAdmin, terminal, etc).
1. Set your database password in postgres to whatever value you want, and make sure it's available in the environment variable `DB_PASSWORD`. You can do this by adding it to your `.profile` or `.bashrc`.
1. Start the stack by running `npm run dev`.
1. Access http://localhost:3000

## scripts

The stack contains the following scripts:

- `build`: compile the react app for production (it will be output to the `dist` directory).
- `client`: run the react client alone via webpack.
- `dev`: run the react client via webpack concurrently with the server.
- `lint-client`: run `eslint` on the client.
- `lint-server`: run `eslint` on the server.
- `server`: run the node backend server in development mode using `nodemon`. the server will serve whatever react app has been previously built using `build` (though keep in mind that the app will be static and won't update as you change files).
- `start`: run the server (without nodemon). useful to run in production.
- `tsc`: run typescript compiler.

## components

This section describes some of the components used in the stack, how those components are configured, and how those components work and run in different environments.

### postgres

Postgres provides database storage backing the web application. The node server queries postgres via the `pg-promise` library. The app includes code to configure `pg-promise` and connect to the database in `server/db/index.ts`. The `server/db/model` directory contains sample modules which interact with a database table.

This project also provides a lightweight migrations system. SQL files placed in `server/db/migrations` will be automatically run when the server starts up. The migrations system also creates a `migrations` table and will use this to determine which migrations to run and which ones have already been run.

### express

Express provides the web application framework and allows you to configure routing, asset serving, rate limiting, and everything related to the request/response lifecycle for the server. Express is configured in `server/index.ts`, and additional sample routes are provided in `server/routes` (and connected to the app via `server/index.ts`).

### react

React is the frontend framework for the client. This project provides a sample app which was created using `create-react-app`. The sample app was updated with a new component that allows you to make calls from the client to the server (and the server will in turn query your postgres database if all is configured correctly).

You can see examples of how to make server calls in the `src/ServerApiExample.tsx` react component, and can see these server interactions live on the app homepage.

### webpack

Webpack acts as a pipeline to build and bundle together the client react application. It is configured in `webpack.config.js`. It can be used to serve the react app in development. It can also be used to build a compiled javascript bundle containing the react app for serving in production.

### typescript

TypeScript is provided via the `typescript` npm package. The typescript compiler is available in `./node_modules/.bin/tsc`. There are two typescript configurations (`tsconfig.json`). The one in the root directory manages compiler settings for the react client and the one in the server directory manages compiler settings for the server.

Server typescript code is built directly by `tsc` and outputs compiled `.js` files into the `server/build` directory. You probably want to ignore this directory in your editor so you don't end up editing these files (they will get overwritten with each build or restart of the development server).

Client typescript code is built indirectly as part of the `webpack` pipeline. `webpack.config.js` overrides the typescript compiler options to allow the typescript compiler to emit files as part of the webpack serving pipeline. This means you don't see the output `.js` files being written to disk directly, but they show up in the output `dist` or are output by the webpack server.

### node

`node` is used to run the server (in particular, it runs all of the compiled javascript files that typescript output into the `build` directory).

### eslint

`eslint` is used for linting and there is an `.eslintrc.json` for the client (in the root directory) and another for the server (in the `server` directory). This allows for setting different linting rules for the react code vs. the backend code.

### nodemon

`nodemon` is used to run the server in development mode. It watches all of the server source code files and will restart the development server if one changes. Because server files must be compiled with typescript, this project uses a script (`scripts/nodemon.sh`) to both compile and start the server when nodemon detects a change (as opposed to starting the server up directly).

## configuration

The application configuration is managed through environment variables and the `env-var` node module. The `env.ts` file in the server spells out all of the configuration options for the server, and is loaded immediately at server startup. This ensures that all necessary environment variables are loaded immediately at startup, and guarantees that the server will fast-fail if a particular variable is missing.

The `environment` directory provides shell scripts which act as wrappers to provide the necessary variables in a particular environment. Variables which are sensitive or need to change from machine to machine (like `DB_PASSWORD`) may be omitted or passed through in the scripts.

## editor config

The tools chosen for this stack are more powerful if you connect them with your editor. You'll want to install and configure plugins in your editor for:

- `prettier`. You can configure prettier to automatically format code on save according to the `.prettierrc.json` file
- `eslint`. You can configure your eslint integration to automatically fix lint errors according to the project `.eslintrc.json` rules, and to show un-fixable lint errors in red.
- `typescript` language support
- `scss` language support
- `react` and JSX / TSX language support

## improvements needed

This is a work in progress, and I'm hoping to work on the following areas. I'm also happy to accept pull requests for any of these.

- Adding test infrastructure for both react and the server.
- Building in passport authentication by default and providing a table for user accounts.
- Reducing or eliminating custom webpack config in favor of using `react-scripts` in a more out-of-the-box way (if possible).
- Splitting up client and server dependencies and more clearly separating these projects.
- Researching and integrating a more powerful database migrations system.
- Re integrate material UI or another UI kit for better frontend experience.
