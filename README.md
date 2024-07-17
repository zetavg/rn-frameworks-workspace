# React Native Framework Development Workspace

This is a workspace that can be used to run some of the major React Native packages together for easier framework development and code tracing purposes.

## Setup

```bash
git submodule init
git submodule update
```

Then, ensure the following patches are made to each project (you can skip this part if you haven't change the versions of the submodule projects, as patched versions should have already been used):

* **All**: Remove `yarn.lock`.
* **`react-native`**:
  * Replace `rimraf`s with `rm -rf` in `"script"` of `package.json`s as a workaround for `rimraf` not being available while installed with yarn workspaces (and we're not using Windows anyway).
  * Change `./src` to `./dist` for the exports in `package.json` for these packages:
    * `packages/metro-config`
    * `packages/dev-middleware`
    * `packages/core-cli-utils`
    * `packages/community-cli-plugin`
* **`react-native-cli`**: Remove the `postinstall` script in `package.json` since it's not working for now.
* **`expo`**: Remove the `postinstall` script in `package.json` since it will not work.

Once the projects are prepared, run:

```bash
yarn install
```

Then, `cd` into each project and run `yarn build` to build the packages, except for the following:

* `react-native`: Run `yarn build`, and `yarn build` inside `packages/react-native-codegen`.
* `metro`: Run `yarn build`, then `yarn workspaces foreach --worktree run prepare-release`.
* `expo`: Run `yarn workspace @expo/cli prepare`.

Note that in the root `package.json`, we're using the `resolutions` field to force the use of the local packages as we have encountered situations where some of the `react-native` or `react-native-cli` packages in node_modules are not linked to the local packages as expected but installed from NPM.


## Running

There are some projects in the `playground/` directory that can be used.

### CLI & Dev Server

With VSCode, you can use [JavaScript Debug Terminal](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-debug-terminal)s to run commands and debug or trace the code using breakpoints and other VSCode debugging features.

Most of the packages will have source maps generated during build, so you can set breakpoints in the source code (such as `.ts` files) instead of the compiled code, since VSCode will automatically [search the entire workspace to find source maps](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-map-discovery) that can be used to map the compiled code to the source code.
