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

## SEO (search engine optimization) & Sharing

Usually you would insert SEO meta tags in the head of the HTML page, and they are not part of a React component.

### Setting up metadata tags

Meta data tags go in the head, which is static once being rendered by the server. It does not change on each React render.

To create the SEO meta tags in the head, one way is to use a static function so that your components can optionally declare their SEO microdata tag needs.

Add a static function for creating meta tags: src/components/detail.jsx
```javascript
class Detail extends React.Component {
  static createMetatags(params, store) {
    const tags = [];
    const item = store.products ? store.products.currentProduct : null;
    if (item) {
      tags.push({
        name: 'description',
        content: item.description
      });
      tags.push({
        property: 'og:description',
        content: item.description
      });
      tags.push({
        property: 'og:title',
        content: item.name
      });
      tags.push({
        property: 'og:url',
        content: `http://localhost:3000/product/detail/${item.id}`
      });
      tags.push({
        property: 'og:image',
        content: item.thumbnail
      });
    }
    return tags;
  }
}
```

### Rendering meta tags into the head on the server

Render meta tags as part of HTML.jsx: src/components/html.jsx
```javascript
const HTML = (props) => {
  const metatagsArray = [];
  props.metatags.forEach((item) => {
    metatagsArray.push(
      <meta {...item} />
    );
  });

  return (
    <html lang="en">
      <head>
        <title
          dangerouslySetInnerHTML={{
            __html: props.title || 'All Things Westies'
          }}
        />
        {metatagsArray}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/semantic-ui/2.2.4/semantic.min.css"
        />
        <link rel="stylesheet" href="/assets/style.css" />
      </head>
    </html>
  );
};
```

Finally, you need to add the code to renderView.jsx that will pull the meta tag arrays out of the individual components.

Fetch meta tags array: src/middleware/renderView.jsx
```javascript
        const seoTags = flattenStaticFunction(
          renderProps,
          'createMetatags',
          serverState
        );

        const html = renderToString(
          <HTML
            html={app}
            serverState={stringifiedServerState}
            metatags={seoTags}
            title={title}
          />
        );
```

### Handling the title

#### Title on the server

Handling the title on the server is similar to handling the meta data on the server.

Each top-level component should provide a static function that outputs the title.

Create title static function: src/components/detail.jsx
```javascript
class Detail extends React.Component {

  static createTitle(props) {
    return `${props.name} - All Things Westies`;
  }

  static getTitle(params, store) {
    const currentProduct = store.products && store.products.currentProduct;

    return Detail.createTitle(currentProduct);
  }

  // ...
}
```

Now you can setup the title on the server.

Add title for the route: src/middleware/renderView.jsx
```javascript
        const title = flattenStaticFunction(
          renderProps,
          'getTitle',
          serverState
        );
        const html = renderToString(
          <HTML
            html={app}
            serverState={stringifiedServerState}
            metatags={seoTags}
            title={title}
          />
        );
```

Now for last you need to change the title in the html.jsx to use the passed in prop.

Render the title for the route: src/components/html.jsx
```javascript
const HTML = (props) => {
  // ...
  return (
    <html lang="en">
      <head>
        <title
          dangerouslySetInnerHTML={{
            __html: props.title || 'All Things Westies'
          }}
        />
        {metatagsArray}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/semantic-ui/2.2.4/semantic.min.css"
        />
        <link rel="stylesheet" href="/assets/style.css" />
      </head>
    </html>
  );
}
```

#### Title on the browser

The title tag is user facing and should get updated on every route change.

This creates a unique situation where you need to update a part of the DOM that is not controlled by React.

src/components/detail.jsx
```javascript
class Detail extends React.Component {
  componentDidMount() {
    document.getElementsByTagName('title')[0].innerHTMl = Detail.createTitle(this.props);
  }

  componentDidUpdate() {
    document.getElementsByTagName('title')[0].innerHTMl = Detail.createTitle(this.props);
  }
}
```

This kind of situation is rare but when it occurs, using direct DOM access is perfectly reasonable.
Just make sure to ask yourself, "Can I do this the React way before accessing the DOM?".

## Multiple sources of truth

When building isomorphic apps, you may run into cases where you can get the same information from the server and the browser.

So pick a single source of truth. And the first place your app runs code is the server, so much as possible, use the server to parse out this information.

### User Agent best practices

1. Always use a single source of truth. This means parsing the User Agent on the server and passing it down to the browser.
2. Use the broadest definition possible. So rather than asking is this an iPhone? Ask is this a mobile device? It is extremely rare to need to know a specific version of a device category or specific browser.

### Parse the User Agent

There are only two things you need to do to parse out the user agent into a usable value for your application:

1. You'll need to add an action and reducer.
2. You'll need to pass the User Agent header information into that action on the server.
