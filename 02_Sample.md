# Sample Isomorphic App

## Example: Recipes App

Example App: https://github.com/isomorphic-dev-js/chapter2-a-sample-isomorphic-app

Building Blocks:
* React - View
* Redux - Business logic
* Babel - Compile JS
* Webpack - Build tool: bundle code for the browser.
* Express - Server side.

### devDependencies

Build Tools:

* babel-core: main Babel compiler package.
* babel-cli: Babel command line tool.
* babel-loader: webpack loader for using Babel.
* babel-preset-es2015, babel-preset-react, babel-plugin-transform-es2015-destructuring, babel-plugin-transform-es2015-parameters, babel-plugin-transform-object-rest-spread: Babel preset options for React, ES6 and JSX.
* babel-preset-react: React preset (JSX).
* css-loader: webpack CSS loader.
* style-loader: webpack CSS loader.
* webpack: build tool for compiling JavaScript code.

### dependencies

Libraries required to run the application.

* express: Node.js routing handling tools via middleware
* isomorphic-fetch: enable fetch API in browser and server.
* react: React.
* react-dom: the browser and server specific DOM rendering implementation.
* redux: Redux.
* react-redux: connects React and Redux.
* redux-thunk: Redux middleware.
* redux-promise-middleware: Redux middleware that supports promises.
* superagent: Isomorphic XHR request handling library.

#### Babel configuration

`.babelrc`
```javascript
{
  "presets": ["es2015", "react"],
  "plugins": [
    "transform-es2015-destructuring",
    "transform-es2015-parameters",
    "transform-object-rest-spread"
  ]
}
```

https://babeljs.io

The view doesn't worry about the implementation of the business logic and the app state doesn't worry about how it will be displayed.

src/server.js
```javascript
require('babel-register');
require('./app.es6');
```

### Building the code for the browser with webpack

Webpack features:

* Using loaders to compile ES6 and JSX code and load static assets via loaders.
* Code splitting for smart bundling of code into smaller packages
* The ability to build code node or the browser.
* Out of the box sourcemaps
* The webpack dev server.
* A built-in watch option.

Example webpack.config.js:
```javascript
module.exports = {
  entry: "./src/main.jsx",
  output: {
    path: __dirname + '/dist/',
    filename: "browser.js"
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|es6)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.es6']
  }
}
```

## The view

The app lifecycle is single directional:

```
View (React Components) ===> Application State (Redux) --|
          ^                                              |
          |----------------------------------------------|
```

### React & Components

### App Wrapper Component

`app.jsx` is a container component.

### HTML container

## App State: Redux
