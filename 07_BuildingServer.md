# Building the Server

Using Express and and how to run React, React Router and Redux code on the server.

React and React Router each provide server specific APIs to make this work.
Redux only has some minor changes needed, like just call actions from the server.

Workflow:
* Set up basic routing with Express
* Set up app specific routing with React Router using the `match` function.
* Render your React components on the server using `renderToString`.
* Fetch the data for your components on the server.
* Respond to requests with the rendered app.

Flow:
1. The user requests to render the app.
2. A request for the home page is sent to your server.
3. Your server runs your app. The entry point for your server code lives here.
4. The server determines what to render. In this case several product components and a placeholder for the twitter widget.
5. The server fetches any required data from your API like products.
6. Once the data is received, the server renders the components with the data.
7. The server responds with the fully rendered DOM markup (as a string).
8. The DOM is parsed by the browser. The initial load of the page is completed. The user sees the home page.
9. The page enters into Single Page Application (SPA) flow. Updates are initiated by events, usually from the user.
10. The user clicks on a button.
11. Your React code responds to the button click and updates your app code.
12. Your code fetches any required data from the API.
13. When the data responds, React kicks off a render.
14. The DOM is updated and executes a render and repaint so the user sees the latest app state.
15. The app awaits until further input or events are received. The cycle then repeats from steps 10 to 15.

## Introduction to Express

Express is a framework for Node.js that makes it easy to build REST APIs and to implement view rendering.

Part of building an isomorphic app with JavaScript is handling initial requests to your web server.

### Setting up the Server Entry Point

Server Entry (src/app.es6)
```javascript
import express from 'express';

const app = express();
app.listen(3000, () => {
  console.log('App listening on port: 3000');
});
```

### Setting up routing with Express

The Express router handles all incoming requests to the application and decides what to do with each request.

You can set up specific routes for any type of HTTP verb (GET, POST, PUT, OPTIONS, DELETE).

```javascript
app.get('/test', (req, res) => {
  res.send('Test route success!');
});
```

#### Regular Expression in Routes

This is helpful for building an app with React Router because we want to hand off the route handling to React Router instead of having individual Express routes.

```javascript
app.get('/*', (req, res) => {
  res.send(`${req.url} route success!`)
})
```

## Adding Middleware for view rendering

Middleware: small reusable code functions that can be used together to handle complex business logic.

Express middleware == Redux middleware.

### Using match to handle routing

React Router provides `match` that handles route matching.

Route matching middleware: src/middleware/renderView.js
```javascript
import { match } from 'react-router';
import routes from '../shared/sharedRoutes';

export default function renderView(req, res) {
  const matchOpts = {
    routes,
    location: req.url
  };
  const handleMatchResult = (error, redirectLocation, renderProps) => {
    if (!error && !redirectLocation && renderProps) {
      res.send('Success, that is a route!');
    }
  };
  match(matchOpts, handleMatchResult);
}
```

Using renderView middleware for the catch all route: src/app.es6
```javascript
import renderViewMiddleware from './middleware/renderView';

app.get('/*', renderViewMiddleware);
```

### Rendering components on the Server

1. Each view request must render the React tree based on the route matched with React Router.
2. The final request must contain a complete HTML page with head and body tags. You will need to create an HTML.jsx component that handles the wrapper markup.

#### renderToString vs render

##### `render`
* Output: JavaScript representation of your components.
* Runs once? No, runs every time there is an update.
* Environment: Browser

##### `renderToString`
* Output: A string of DOM elements.
* Runs once? Yes, it doesn't hold any state.
* Environment: Server

#### Building your index component

HTML container - html.jsx
```javascript
import React from 'react';
const HTML = (props) => {
  return (
    <html lang="en">
      <head>
        <title>All Things Westies</title>
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/semantic-ui/2.2.2/semantic.min.css" />
        <link rel="stylesheet"
          href="/assets/style.css" />
      </head>
      <body>
        <div id="react-content"
          dangerouslySetInnerHTML={{ __html: props.renderedToStringComponents }} />
      </body>
    </html>
  );
};
HTML.propTypes = {
  renderedToStringComponents: React.PropTypes.string
};
export default HTML;
```

* This component will only be rendered on the server so it will never have state and can be a pure (stateless) component that is represented by a function.

##### dangerouslySetInnerHTML

This property is provided by React to allow you to inject HTML into React components.

React considers using `dangerouslySetInnerHTML` a best practice because it reminds you that you don't want to be setting `innerHTML` most of the time.

### Using `renderToString` to create the view

Render HTML output in the middleware: middleware/renderView.jsx
```javascript
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match } from 'react-router';
import routes from '../shared/sharedRoutes';
import HTML from '../components/html';

export default function renderView(req, res, next) {
  const matchOpts = {
    routes,
    location: req.url
  };
  const handleMatchResult = (error, redirectLocation, renderProps) => {
    if (!error && !redirectLocation && renderProps) {
      const app = renderToString(<div>App!</div>);
      const html = renderToString(<HTML renderedToStringComponents={app}) />);
      res.send(`<!DOCTYPE html>${html}`);
    } else {
      next();
    }
  };
  match(matchOpts, handleMatchResult);
}
```

#### Rendering components

The final step is to completely render a route inside of the middleware.
This means dynamically rendering app.jsx, a child component base don the route and then returning them rendered into html.jsx.

Render with routes: middleware/renderView.jsx
```javascript
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../shared/sharedRoutes';
import HTML from '../components/html';

export default function renderView(req, res, next) {
  const matchOpts = {
    routes,
    location: req.url
  };
  const handleMatchResult = (error, redirectLocation, renderProps) => {
    if (!error && !redirectLocation && renderProps) {
      const app = renderToString(
        <RouterContext routes={routes} {...renderProps} />
      );
      const html = renderToString(<HTML renderedToStringComponents={app}) />);
      res.send(`<!DOCTYPE html>${html}`);
    } else {
      next();
    }
  };
  match(matchOpts, handleMatchResult);
}
```

The `RouterContext` is a React Router component that is used to properly render your component on the server.

## Adding Redux

When using Redux on the server, we need our data to be ready before we render our view.
We need to guarantee that the data needed by the view is available before we begin to render the view.

Flow of Redux on the server:
1. `renderView` middleware (server): dispatches actions based on what each component needs.
2. Action: executes business logic including fetching data asynchronously.
3. Reducer: determines which reducer to use based on action definition.
4. Store: updates are broadcast to any component subscribed to the store.
5. `renderView` middleware (server): renders the view components with the data in the store.

### Setting up the cart actions and reducers

Initialize the Redux store: src/shared/init-redux.es6
```javascript
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import cart from './cart-reducer.es6';

export default function(initialStore = {}) {
  const reducer = combineReducers({ cart });
  const middleware = [thunkMiddleware, loggerMiddleware()];
  return compose(
    applyMiddleware(...middleware)
  )(createStore)(reducer, initialStore);
}
```

Cart actions: src/shared/cart-action-creators.es6
```javascript
import fetch from 'isomorphic-fetch';

export const GET_CART_ITEMS = 'GET_CART_ITEMS';

export function getCartItems() {
  return (dispatch) => {
    return fetch('http://localhost:3000/api/user/cart', {
      method: 'GET'
    }).then((response) => {
      return response.json().then((data) => {
        return dispatch({
          type: GET_CART_ITEMS,
          data: data.items
        })
      })
    })
  }
}
```

Cart reducers: shared/cart-reducer.es6
```javascript
import { GET_CART_ITEMS } from './cart-action-creators.es6';

export default function cart(state={}, action) {
  switch (action.type) {
    case GET_CART_ITEMS:
      return {
        ...state,
        items: action.data
      };
    default:
      return state;
  }
}
```

### Using Redux in renderView Middleware

Adding the Redux store to your middleware: middleware/renderView.jsx:
```javascript
import initRedux from '../shared/init-redux.es6';

export default function renderView(req, res, next) {
  const matchOpts = { ... };
  const handleMatchResult = (error, redirectLocation, renderProps) => {
    if (!error && !redirectLocation && renderProps) {
      const store = initRedux();
      // ... more code
    }
  }
}
```

Once you have the store in the middleware, you can dispatch action on the server.

#### Setting up initial actions

Declaring initial actions: components/cart.jsx:
```javascript
import cartActions from '../shared/cart-action-creators.es6';

class Cart extends Component {
  static prefetchActions() {
    return [
      cartActions.getCartItems
    ]
  }
  render() {
    return {
      <div className="cart main ui segment">...</div>
    }
  }
}
```

Static functions are not part of the class instance. So it doesn't have access to class's state or props.

### Adding data prefetching via middleware

You can use the middleware to fetch the data before you render the components.

The first thing you need to add is some code that collects all the actions from the components on `renderProps`.

Calling all initial actions on components: src/middleware/renderView.jsx
```javascript
export default function renderView(req, res, next) {
  const matchOpts = { ... };
  const handleMatchResult = (error, redirectLocation, renderProps) => {
    if (!error && !redirectLocation && renderProps) {
      const store = initRedux();
      let actions = renderProps.components.map((component) => {
        if (component) {
          if (component.displayName && component.displayName.toLowerCase().indexOf('connect') > -1) {
            if (component.WrappedComponent.prefetchActions) {
              return component.WrappedComponent.prefetchActions();
            }
          } else if (component.prefetchActions) {
            return component.prefetchActions();
          }
        }
        return [];
      });
      actions = actions.reduce((flat, toFlatten) => {
        return flat.concat(toFlatten);
      }, []);
    }
  }
  match(matchOpts, handleMatchResult);
}
```

This takes care of knowing what actions to call for the route.
Remember you can only call prefetchActions with this function on components that re known to React Router.

Use `Promise.all` to wait until all your initial actions complete before rendering the React components.

Calling all initial actions on components:
```javascript
import { Provider } from 'react-redux';

export default function renderView(req, res, next) {
  const matchOpts = { ... };
  const handleMatchResult = (error, redirectLocation, renderProps) => {
    if (!error && renderProps) {
      const store = initRedux();
      let actions = renderProps.components.map((component) => {
        ...
      });
      actions = actions.reduce((flat, toFlatten) => { ... }, []);
      const promises = actions.map((initialAction) => {
        return store.dispatch(initialAction());
      });
      Promise.all(promises).then(() => {
        const app = renderToString(
          <Provider store={store}>
            <RouterContext routes={routes} {...renderProps} />
          </Provider>
        );
        const html = renderToString(<HTML html={app} />);
        return res.status(200).send(`<!DOCTYPE html>${html}`);
      });
    }
  }
  match(matchOpts, handleMatchResult);
}
```

#### Displaying data in the cart

Complete cart component: components/cart.jsx:
```javascript
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getCartItems } from '../shared/cart-action-creators.es6';
import Item from './item';

class Cart extends Component {
  static prefetchActions() {}

  constructor(props) {
    super(props);
    this.proceedToCheckout = this.proceedToCheckout.bind(this);
  }

  getTotal() {
    let total = 0;
    const items = this.props.itmes;
    if (items) {
      total = items.reduce((prev, current) => {
        return prev + current.price;
      }, total);
    }
    return total;
  }

  proceedToCheckout() {
    console.log('clicked checkout button', this.props);
  }

  renderItems() {
    const components = [];
    const items = this.props.items;
    if (this.props.items) {
      this.props.items.forEach((item, index) => {
        components.push(<Item key={index} {...item} />);
      });
    }
    return items;
  }

  render() {
    return (
      <div className="cart main ui segment">
        <div className="ui segment divided items">
          {this.renderItems()}
        </div>
        <div className="ui right rail">
          <div className="ui segment">
            <span>Total: </span>
            <span>${this.getTotal()}</span>
            <button onClick={this.proceedToCheckout} className="ui positive basic button">
              Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }
}

Cart.propTypes = {
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      price: React.PropTypes.number.isRequired,
      thumbnail: React.PropTypes.string.isRequired
    })
  )
};

function mapStateToProps(state) {
  const { items } = state.cart;
  return {
    items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cartActions: bindActionCreators(cartActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
```
