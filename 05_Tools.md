# Tools: Webpack and Babel

Webpack gives you the power to include any JavaScript code in your build.

## Webpack Overview

### Getting started with webpack CLI (command line tool)

Example:
```
$ webpack --entry ./name.js --output-filename output.js --output-path ./
```

Where:
* `webpack`: webpack cli
* `--entry ./name.js`: option --entry point of code with the path for entry file.
* `--output-filename output.js`: option file name of compiled output with the name.
* `--output-path ./`: option path to output with the path.

Webpack wraps all of the modules in JavaScript closures which allows it to control and rewrite the import statements.

The bundled code includes some additional functions that are part of the webpack library.

#### Debugging webpack

* `--debug` shows errors in stdout in the command line.
* `--display-error-details`: provides an additional level of detail about any errors that occur.

## Babel overview

Babel is a tool for compiling JavaScript.

If you want to use the latest and greatest parts of JavaScript spec then you must use a compiler.

### Getting started with Babel

Babel compiles to code that can be understood by any browser running ES5 JavaScript.

### The Babel CLI

```
$ ./node_modules/.bin/babelsrc/compile-me.js
```

#### Babel plugins and presets

Plugins are often grouped into presets.

`.babelrc` configuration file:
```javascript
{
  "presets": ["es2015", "react"]
}
```

## Webpack Config with loaders

By default, the webpack command will look for a file called `webpack.config.js`.

The most basic configuration file just includes an entry point and output information.

```javascript
var path = require('path');

module.exports = {
  entry: path.resolve(__dirname + '/src/main.js'),
  debug: true,
  output: {
    path: path.resolve(__dirname + '/'),
    filename: 'webpack-bundle.js'
  }
}
```

### Configure the Babel loader

* You still need `.babelrc` file with presets list.
* You need to declare Babel as a loader in the webpack configuration.

```javascript
var path = require('path');

module.exports = {
  entry: path.resolve(__dirname + '/src/main.js'),
  debug: true,
  output: {
    path: path.resolve(__dirname + '/'),
    filename: 'webpack-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
}
```

Note that if you want multiple loaders you put them in an array and you change the key name from `loader` to `loaders`.

#### Using custom extensions

* use specific extensions (not `.js`) to indicate the file type like `.jsx` for React components.
* It can be convening to not have to write the extension on your import statements.

Just add the resolve property and declare an array of extensions to use, including an empty extension.

```javascript
var path = require('path');

module.exports = {
  entry: path.resolve(__dirname + '/src/main.js'),
  debug: true,
  output: { ... },
  module: { ... },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  }
}
```

### Configuring the CSS loader

```javascript
var path = require('path');

module.exports = {
  entry: path.resolve(__dirname + '/src/main.js'),
  debug: true,
  output: { ... },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css/,
        loaders: ['style', 'css']
      }
    ]
  }
}
```

Loader uses two webpack loaders: `style-loader` and `css-loader`.

## Bundling for Dev and Production

* `base.config.js`: mostly like `webpack.config.js` content.
* `dev.config.js`
* `prod.config.js`

`dev.config.js` and `prod.config.js` requires `base.config.js` and then extend the configuration.

### Webpack plugins

A webpack plugin is an additional code module that you can include in the plugins array of your webpack configuration.

For the dev config, you will add the `html-webpack-plugin`. This plugin auto generates an html file that loads the bundled JavaScript.

`config/dev.config.js`:
```javascript
var baseConfig = require('./base.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = Object.assign(baseConfig, {
  output: {
    filename: 'dev-bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Calendar App Dev",
      filename: 'bundle.html'
    })
  ]
})
```

### Creating Globals

You can use plugins to define environment variables.
Webpack ships with a plugin called `definePlugin` which allows you to inject variables into your webpack module.

```JavaScript
var webpack = require('webpack');

var injectEnvironment = new webpack.definePlugin({
  __ENV__: JSON.stringify("dev")
});

module.exports = Object.assign(baseConfig, {
  output: {},
  plugins: [
    ...,
    injectEnvironment
  ]
})
```

### Sourcemaps

With soucemaps enabled, webpack generates additional code that maps the generated code back to the original file structure.

```javascript
module.exports = Object.assign(baseConfig, {
  output: {},
  devtool: 'sourcemap',
  plugins: []
})
```

### Preparing the build for production

* Make the bundle as small as possible.
* Inject production environment variables.
* Output to a different output bundle.

`config/prod.config.js`:
```javascript
var baseConfig = require('./base.config.js');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var injectEnvironment = new webpack.DefinePlugin({
  __ENV__: JSON.stringify('prod')
});

module.exports = Object.assign(baseConfig, {
  debug: false,
  output: {
    filename: 'prod-bundle.js'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      }
    }),
    new HtmlWebpackPlugin({
      title: "Calendar App",
      filename: 'prod-bundle.html'
    }),
    injectEnvironment
  ]
});
```
