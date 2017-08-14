# IsomorphicDevelopment

Isomorphic Development with JavaScript

## Notes about commands and configs

### devDependencies

* babel-core: the main Babel compiler package.
* babel-cli: the Babel command line tool. Used to compile the server code.
* babel-loader: webpack loader for using Babel with webpack.
* babel plugins:
  * babel-preset-es2015
  * babel-preset-react
  * babel-plugin-transform-es2015-destructuring
  * babel-plugin-transform-es2015-parameters
  * babel-plugin-transform-object-rest-spread
* babel-preset-react
* css-loader
* style-loader
* webpack

### core Dependencies

* express: a Node.js routing library that provides routing and route handling tools via middleware.
* isomorphic-fetch: enables the use of the fetch API in the browser and the server.
* react: the main React package.
* react-dom: the browser and server specific DOM rendering implementations
* redux: core Redux code.
* react-redux: provides support to connect React and Redux.
* redux-thunk: Redux middleware.
* redux-promise-middleware: Redux middleware that supports promises.
* superagent: isomorphic XHR request handling library.

## Applying React

```
$ npm init -y
$ npm i webpack css-loader style-loader babel-loader --save-dev
$ npm i babel-core babel-cli babel-preset-es2015 babel-preset-react --save-dev
$ npm i babel-plugin-transform-es2015-destructuring babel-plugin-transform-es2015-parameters babel-plugin-transform-object-rest-spread --save-dev
$ npm i react react-dom --save
$ npm i webpack-dev-server html-webpack-plugin clean-webpack-plugin --save-dev
$ touch .babelrc
$ mkdir src
$ mkdir dist
$ touch webpack.config.js
$ touch src/main.jsx
```

.babelrc
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

webpack.config.js
```javascript
module.exports = {
  entry: './src/main.jsx',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist/',
    filename: 'browser.js'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|es6)$/,
        exclude: /node_modules|examples/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.es6', '.json']
  }
};
```
