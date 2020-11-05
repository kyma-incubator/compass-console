# Compass Console

## Overview

The Compass Console is a web-based UI for managing resources within [Compass](https://github.com/kyma-incubator/compass).

### Components

The Console includes React and Angular libraries:

- [`React common`](./common) - common functionalities for React applications
- [`React components`](./components/react) - components for React applications (it will be replaced by `Shared components`)
- [`Shared components`](./components/shared) - new versions of components for React applications written in TypeScript
- [`Generic documentation`](./components/generic-documentation) - a React component that uses [`@kyma-project/documentation-component`](https://github.com/kyma-incubator/documentation-component) for displaying documentation and various specifications in the [`Content`](./content), [`Service-Catalog-UI`](./service-catalog-ui), and [`Compass`](./compass) views.

## Prerequisites

- [`npm`](https://www.npmjs.com/): >= 6.4.0
- [`node`](https://nodejs.org/en/): >= 12.0.0

## Installation

1. Change your current directory to the `console/compass` folder.

2. Run the following commands in your terminal:

    ```bash
    npm install
    cd ..
    npm run bootstrap
    cd compass
    npm start
    ```

3. The Compass website opens in a new tab of your browser. If not, go to `http://localhost:8080`.

   > **NOTE:** The `npm run bootstrap` command:
   > - installs root dependencies provided in the [package.json](./package.json) file
   > - installs dependencies for the [`React common`](./common), [`React components`](./components/react), [`Shared components`](./components/shared) and [`Generic documentation`](./components/generic-documentation) libraries
   > - builds all the libraries
   > - installs dependencies for all the [components](#components)
   > - updates your `/etc/hosts` with the `127.0.0.1 compass-dev.kyma.local` host
   > - creates the `.clusterConfig.gen` file if it doesn't exist, pointing at the `kyma.local` domain

## Usage

### Set the cluster (optional)

By default, the Compass cluster URL with which the Console communicates is set to `kyma.local`. To change the address of the cluster, run:

```bash
./scripts/setClusterConfig.sh {CLUSTER_URL}
```

To simplify switching clusters hosted on the same domain, you can assign the domain to `CLUSTER_HOST` environment variable, then use any subdomain as a cluster name.

For example, let's assume you want to easily switch between two clusters - `foo.abc.com` and `bar.abc.com`. Follow these steps to simplify switching between these clusters:

```bash
export CLUSTER_HOST=abc.com
# If you use only one domain for your cluster, consider setting it permanently in your shell.

./scripts/setClusterConfig.sh foo
# After setting the CLUSTER_HOST variable this is equal to running ./scripts/.setClusterConfig foo.abc.com

./scripts/setClusterConfig.sh bar
# Switch to a different cluster on the same domain
```

To reset the domain to the default kyma.local setting, run:

```bash
./scripts/setClusterConfig.sh local
```

### Start all views

Use the following command to run the Console with the [`core`](./core) and all other views locally:

```bash
npm run start
```

To get the credentials required to access the local instance of the Compass Console at `http://compass-dev.kyma.local:8888`, follow the instructions from [this](https://kyma-project.io/docs/master/root/kyma#installation-install-kyma-on-a-cluster-access-the-cluster) document.

### Watch changes in React libraries

If you want to watch changes in the React libraries, run this command in a new terminal window:

```bash
npm run watch:libraries
```

## Development

Once you start Compass Console locally, you can start development. All modules have hot-reload enabled therefore you can edit the code real time and see the changes in your browser.

The Compass console is available at `http://localhost:8080` or `http://compass-dev.kyma.local:8080`.

### Security countermeasures

When developing new features in Compass Console UI, adhere to the following rules. This will help you to mitigate any security-related threats.

#### Prevent Cross-site request forgery (XSRF)

- Do not store the authentication token as a cookie. Make sure the token is sent to the Console Backend Service as a bearer token.
- Make sure that state-changing operations (gql mutations) are only triggered upon explicit user interactions such as form submissions.
- Keep in mind that UI rendering in response to user navigating between views is only allowed to trigger read-only operations (gql queries and subscriptions) without any data mutations.

#### Protect against Cross-site scripting (XSS)

- It is recommended to use JS frameworks that have built-in XSS prevention mechanisms, such as [reactJS](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks), [vue.js](https://vuejs.org/v2/guide/security.html#What-Vue-Does-to-Protect-You) or [angular](https://angular.io/guide/security#angulars-cross-site-scripting-security-model).
- As a rule of thumb, you cannot perceive user input to be 100% safe. Get familiar with prevention mechanisms included in the framework of your choice. Make sure the user input is sanitized before it is embedded in the DOM tree.
- Get familiar with the most common [XSS bypasses and potential dangers](https://stackoverflow.com/questions/33644499/what-does-it-mean-when-they-say-react-is-xss-protected). Keep them in mind when writing or reviewing the code.
- Enable the `Content-security-policy` header for all new micro frontends to ensure in-depth XSS prevention. Do not allow for `unsafe-eval` policy.

### Run tests

For the information on how to run tests and configure them, go to the [`tests`](tests) directory.

## Troubleshooting

> **TIP:** To solve most of the problems with the Console development, clear the browser cache or do a hard refresh of the website.

### CI fails on PRs related to staging dependencies

Remove the `node_modules` folder and the `package-lock.json` file in the [`compass`](./compass) folder and on the root. Then rerun the `npm run bootstrap` command in the root context and push all the changes.

### Can't access `compass.kyma.local:8888` after hibernating the Minikube cluster

Follow the guidelines from [this](https://kyma-project.io/docs/#troubleshooting-basic-troubleshooting-can-t-log-in-to-the-console-after-hibernating-the-minikube-cluster) document to solve the problem.

### Check the availability of a remote cluster

Use the `checkClusterAvailability.sh` script to quickly check the availability of remote clusters.

```bash
./scripts/checkClusterAvailability.sh {CLUSTER_URL}

# or

export CLUSTER_HOST=abc.com
./scripts/checkClusterAvailability.sh {cluster_subdomain}
# the same as ./scripts/checkClusterAvailability.sh {CLUSTER_SUBDOMAIN}.abc.com

# or

./scripts/checkClusterAvailability.sh
# Checks the availability of every cluster that has ever been set through setClusterConfig.sh
# or checked with checkClusterAvailability.sh on your machine.

# or

./scripts/checkClusterAvailability.sh -s {cluster_domain}
# Returns an appropriate exit code if the cluster is unavailable.
```
