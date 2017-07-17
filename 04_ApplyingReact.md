# Applying React

## React Router

Routers provide mapping between a URL based route and the view that route should load.

React Router is simply a React component that handles your routing logic.

Example: https://github.com/isomorphic-dev-js/complete-isomorphic-example

### Setting up an app with React Router

src/shared/sharedRoutes.jsx:
```javascript
export const routes = (onChange = () => {}) => {
  return (
    <Route path="/" component={App} onChange={onChange}>
      <IndexRoute component={Products} />
      <Route path="cart" component={Cart} />
      <Route path="cart/payment" component={Payment} />
      <Route path="products" component={Products} />
      <Route path="profile" component={Profile} />
      <Route path="login" component={Login} />
    </Route>
  );
};
```

src/main.jsx:
```javascript
function init() {
  ReactDOM.render(
    <Provider store={store}>
      <Router routes={sharedRoutes(store)} history={browserHistory} />
    </Provider>, document.getElementById('react-content'));
}
```

React Router ends up being your root component.

src/components/app.jsx
```javascript
import React from 'react';
import { Link } from 'react-router';
import Banner from './banner';

const App = (props) => {
  return (
    <div>
      <div className="ui fixed inverted menu">
        <h1 className="header item">All Things Westies</h1>
        <Link to="/products" className="item">Products</Link>
        <Link to="/cart" className="item">Cart</Link>
        <Link to="/profile" className="item">Profile</Link>
      </div>
      <Banner show>
        <h3>Check out the semi-annual sale! Up to 75% off select Items</h3>
      </Banner>
      <div className="ui main text container">
        {
          // Instead of rendering a specific component or static text, the app component renders the children property
          React.Children.map(
            props.children,
            (child) => {
              return React.cloneElement(
                child,
                { router: props.router }
              );
            }
          )
        }
      </div>
    </div>
  );
};

App.propTypes = {
  children: React.PropTypes.element,
  router: React.PropTypes.shape({
    push: React.PropTypes.function
  })
};

export default App;
```

Setting propTypes on components provides documentation and is considered best practice. It’s an object that describes the expected properties, including whether or not they are required.

The prop type children is a React element, which is described here.

#### Router Props

1. `location`: query and pathname.
2. `params`: parameters in path like: `/products/:categories` would be `{ category: treats }`.
3. `router`

### Routing from components: Link

The `Link` component renders an `<a>` tag for you while handling all the history and other necessary logic under the hood.

The `Link` component ties into the history without you having to do any extra work.

```html
<Link to="/products" className="item">Products</Link>
```

### The router lifecycle

Each Route can have an onEnter and/or an onChange property.

## Component Lifecycle
