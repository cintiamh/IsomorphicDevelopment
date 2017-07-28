# Handling Differences in Environments

https://github.com/isomorphic-dev-js/complete-isomorphic-example

## Isolate browser specific code

Let's suppose you have some code you need to use browser specific objects like `window` or `document`, which would fail on server side.

So we can create environment specific Boolean flags for detecting whether the code is currently running in the server or in the browser.

### Creating the environment variable for the server

package.json
```javascript
"scripts": {
  "start": "NODE_ENV=development SERVER=TRUE node src/server.js",
}
```

### Creating the environment variable for the browser

webpack.config.js
```javascript
const webpack = require('webpack');

const injectVariables = new webpack.DefinePlugin({
  process: {
    env: {
      NODE_ENV: JSON.stringify("development"),
      BROWSER: JSON.stringify('true'),
      SERVER: JSON.stringify('false')
    }
  }
});

module.exports = {
  entry: "./src/main.jsx",
  devtool: "source-map",
  output: {
    // ...
  },
  module: {
    // ...
  },
  resolve: {
    // ...
  },
  plugins: [
    injectVariables
  ]
};
```

### Using the variables

Checking for environment: src/analytics.es6
```javascript
import fetch from 'isomorphic-fetch';

// This is a mock - in a real app you would use a third party tool
// or your own internal system
if (process.env.BROWSER) {
  window.analytics = {
    send: (opts) => {
      fetch('http://localhost:3000/analytics', {
        method: 'POST',
        body: JSON.stringify(opts)
      })
      .then((res) => {
        console.log('analytics result', res);
      })
      .catch((err) => {
        console.log('analytics err', err);
      });
    }
  };
}

const getAnalytics = () => {
  if (process.env.BROWSER) {
    return window.analytics;
  }
  return {
    send: () => {
      console.error('Window was not available, do not call sendData');
    }
  };
};

export const sendData = (opts) => {
  getAnalytics().send(opts);
};

export default {
  sendData
};
```

Now you are able to check for `process.env.BROWSER`.

#### Environment aware routes

You can use the same idea to hide features in development mode.

```javascript
const developmentRoute =
    process.env.NODE_ENV !== 'production' ?
      <Route path="/dev-test" component={App} />
      : null;
```

To test this code, you can update your webpack config file:

```javascript
const injectVariables = new webpack.DefinePlugin({
  process: {
    env: {
      NODE_ENV: JSON.stringify("production"),
      BROWSER: JSON.stringify('true'),
      SERVER: JSON.stringify('false')
    }
  }
});
```

Or you can change the value in the start script to be production on the server.

```javascript
"scripts": {
    ...
    "start": "NODE_ENV=production SERVER=TRUE node src/server.js",
    ...
  },
```

## SEO & Sharing
