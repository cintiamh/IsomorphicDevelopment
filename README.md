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
      title: 'Output Management',
      template: 'src/templates/index.template.ejs',
      inject: 'body'
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

src/templates/index.template.ejs
```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <title>Everything Westies</title>
  </head>
  <body>
    <div id='root'></div>
  </body>
</html>
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
import Cart from './components/cart';
import Products from './components/products';
import Profile from './components/profile';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={App} />
    <Route exact path="/cart" component={Cart} />
    <Route path="/products" component={Products} />
    <Route path="/profile" component={Profile} />
  </Switch>
);

export default Routes;
```

src/components/app.jsx:
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const App = (props) => {
  return (
    <div>
      <div className="ui fixed inverted menu">
        <h1 className="header item">All Things Westies</h1>
        <Link to="/products" className="item">Products</Link>
        <Link to="/cart" className="item">Cart</Link>
        <Link to="/profile" className="item">Profile</Link>
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
  document.getElementById('root')
);
```

Tutorial for React-router-dom: https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf
