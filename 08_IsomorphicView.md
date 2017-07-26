# Isomorphic View Rendering

In this chapter, we will build the browser portion of the Isomorphic View Render.

https://github.com/isomorphic-dev-js/complete-isomorphic-example/tree/chapter-8.1.1

## Browser Entry Point

`main.jsx` is the browser entry point and will be the point at which you bootstrap your React code in the browser.

### Referencing the browser code

To get the browser code loading, you need to make sure to reference it from your HTML.

Adding your browser source code: src/components/html.jsx
```javascript
<body>
  <div
    id="react-content"
    dangerouslySetInnerHTML={{ __html: props.html }}
  />
  <script type="application/javascript" src="browser.js" />
</body>
```

### Rendering React in the Browser

In the `/cart` route everything is rendering on the server.

This means some things don't yet work, like the Checkout button.

The first step to get this hooked up in the browser is to call `ReactDOM.render` in the browser.

Rendering an HTML element in the browser: src/main.jsx
```javascript
import React from 'react';
import ReactDOM from 'react-dom';

function init() {
  ReactDOM.render(
    <div>
      Browser Render
    </div>,
    document.getElementById('react-content')
  );
}

init();
```

At this point our application disappeared.

## Matching Server State on the First Render

To make the app isomorphic, you need to recreate the state from the server.
* Serialize the state of the app on the server and send it down in the stringified DOM markup.
* Deserialize the state on the browser so it is a consumable JSON object.
* Initialize Redux with the app state (JSON object).
* Pass the initialized Redux store into the props.

The state that is create on the server need to EXACTLY match the state that is used to bootstrap your React code on the browser.

### Serializing the data on the server

The current app state needs to be captured and serialized.

Serialization is the act of taking some data and converting it to a format that can be sent between environments.

By the end of this section, you'll be able to access your server state in the console.

Capture and serialize current app state: renderView.jsx:
```javascript
Promise.all(promises).then(() => {
  const serverState = store.getState();
  const stringifiedServerState = JSON.stringify(serverState);
  const app = renderToString(
    <Provider store={store}>
      <RouterContext routes={routes} {...renderProps} />
    </Provider>
  );
  const html = renderToString(
    <HTML html={app} serverState={stringifiedServerState} />
  );
  return res.send(`<!DOCTYPE html>${html}`);
})
```

Set the serialized state in the DOM: src/components/html.jsx
```html
<body>
  <div
    id="react-content"
    dangerouslySetInnerHTML={{ __html: props.html }}
  />
  <script
    dangerouslySetInnerHTML={{ __html: `window.__SERIALIZED_STATE__ = JSON.stringify(${props.serverState})`}}
  />
  <script type='application/javascript' src='browser.js' />
</body>
```

Upon restarting the server, you will be able to see your app state stringified and printed in the console by running:

```
window.__SERIALIZED_STATE__
```

### Deserializing the data in the browser

The goal is to take the stringified data that the server sends down and get it into a state that the app can work with it.

Getting the state in the browser: src/main.jsx
```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const initialState = JSON.parse(window.__SERIALIZED_STATE__);
console.log(initialState);
```

### Hydrating the store

Now that you have the state deserialized, you need to initialize Redux with the state that was generated on the server.

Setting up Redux and the component tree: src/main.jsx
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router } from 'react-router';
import initRedux from './shared/init-redux.es6';
import sharedRoutes from './shared/sharedRoutes';

const initialState = JSON.parse(window.__SERIALIZED_STATE__);
console.log(initialState);

const store = initRedux(initialState);

function init() {
  ReactDOM.render(
    <Provider store={store}>
      <Router routes={sharedRoutes} history={browserHistory} />
    </Provider>,
    document.getElementById('react-content')
  );
}

init();
```

## The First Load Cycle

The initial render in the browser is different than what happens later as the user interacts with the app.

### The React Lifecycle on the first load

React begins to bootstrap in your main.jsx file when you call ReactDOM.render.

* The constructor is called.
* `componentWillMount` is triggered.
* The render method is called.
* `componentDidMount` is called.

#### Initial Render differences

`componentWillMount` is called on the first load for every component on both the server and the browser.

`componentDidMount` is called after the first render is complete, and is only called in the browser.

### Isomorphic Render Errors

The isomorphic warning log that React issues when it has detected an isomorphic render that is not truly isomorphic.
This happens when the virtual DOM from the initial render cycle and the browser DOM don't match.

### Using `componentDidMount` to prevent isomorphic load errors

Be careful setting state in this function, because you can easily get into a situation where you cause unnecessary re-renders of your component.

## Adding Single Page App Interactions

### Browser Routing: Data Fetching

To get the app fetching data in the browser, you will take advantage of the loadData static function to fetch the data on each route.

React Router provides callback for various portions of its own lifecycle.
There is a `onChange` callback that can be configured.
The function provided will be called before each Route is rendered, giving you the opportunity to fetch any data from your API that is needed for the route.

Fetching data in the browser: src/shared/sharedRoutes.jsx
```javascript
let beforeRouteRender = (dispatch, prevState, nextState) => {
  const { routes } = nextState;
  routes.map((route) => {
    const { component } = route;
    if (component) {
      if (component.displayName && component.displayName.toLowerCase().indexOf('connect') > -1) {
        if (component.WrappedComponent.loadData) {
          return component.WrappedComponent.loadData();
        }
      } else if (component.loadData) {
        return component.loadData();
      }
    }
    return [];
  }).reduce((flat, toFlatten) => {
    return flat.concat(toFlatten);
  }, []).map((initialAction) => {
    return dispatch(initialAction());
  });
};

export const routes = (onChange = () => {}) => {
  return (
    <Route path="/" component={App} onChange={onChange}>
      <Route path="/cart" component={Cart} />
      <Route path="/products" component={Products} />
      <Route path="/product/detail/:id" component={Detail} />
      <Route path="/blog" component={Blog} />
    </Route>
  )
}

const createSharedRoutes = ({ dispatch }) => {
  beforeRouteRender = beforeRouteRender.bind(this, dispatch);
  return routes(beforeRouteRender);
};

export default createSharedRoutes;
```

Updating Main to call sharedRoutes: src/main.jsx
```javascript
function init() {
  ReactDOM.render(
    <Provider store={store}>
      <Router routes={sharedRoutes(store)} history={browserHistory} />
    </Provider>,
    document.getElementById('react-content')
  );
}
```

Updating renderView to user routes: src/middleware/renderView.jsx
```javascript
// ...
import { match, RouterContext } from 'react-router';
import { routes } from '../shared/sharedRoutes';
import initRedux from '../shared/init-redux.es6';
import HTML from '../components/html';

export default function renderView(req, res, next) {
  const matchOpts = {
    routes: routes(),
    location: req.url
  };
  // ...
}
```
