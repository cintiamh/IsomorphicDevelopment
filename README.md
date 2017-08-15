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
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
  main: './src/main.jsx',
  dist: path.join(__dirname, 'dist')
};

const commonConfig = {
  entry: {
    main: PATHS.main
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ],
  output: {
    path: PATHS.dist,
    filename: '[name].js'
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

const productionConfig = () => commonConfig;

const developmentConfig = () => {
  const config = {
    devtool: 'source-map',
    devServer: {
      historyApiFallback: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT || 3000
    }
  };

  return Object.assign(
    {},
    commonConfig,
    config
  )
};

module.exports = (env) => {
  if (env === 'production') {
    return productionConfig();
  }
  return developmentConfig();
}
```

### React-Router

```
$ npm i react-router-dom --save
$ touch src/routes.jsx
$ mkdir src/components
$ touch src/components/app.jsx
```

src/routes.jsx:
```javascript
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './components/app';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={App} />
  </Switch>
);

export default Routes;
```

src/components/app.jsx:
```javascript
import React from 'react';

const App = (props) => {
  return (
    <div>
      <div className="ui fixed inverted menu">
        <h1 className="header item">All Things Westies</h1>
        <a to="/products" className="item">Products</a>
        <a to="/cart" className="item">Cart</a>
        <a to="/profile" className="item">Profile</a>
      </div>
      <div className="ui main text container">
        Content Placeholder
      </div>
    </div>
  );
};

export default App;
```

src/main.jsx:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

ReactDOM.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
  document.getElementsByTagName('body')[0] // this is actually better if it's an id
);
```
