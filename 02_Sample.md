# Sample Isomorphic App

## Example: Recipes App

Example App: https://github.com/isomorphic-dev-js/chapter2-a-sample-isomorphic-app

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
