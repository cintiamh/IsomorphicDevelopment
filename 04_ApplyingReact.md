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

You can use a React component to use a protected logged in access only to specific routes.

React provides several hooks into the lifecycle of components.

1. Mounting events: happens when React element is attached to a DOM node. This is where you would handle the check for being logged in.
2. Updating events: happens when React element is updating either as a result of new values of its properties or state. If you had a timer in your component, you would manage it in these functions.
3. Unmounting events: happens when React element is detached from DOM. If you had a timer in your component, you would clean it up here.

### Hooking into mounting and updating to detect user status

```javascript
class Profile extends React.Component {
  componentWillMount() {
    if (!this.props.user) {
      this.props.router.push('/login');
    }
  }
  render() {}
}
```

`componentWillMount` is fired before the component has mounted (been attached to the DOM).

#### First Render Cycle

* `componentWillMount()`: happens before the render and before the component is mounted on the DOM.
* `render()`: renders the component.
* `componentDidMount()`: happens after the render and after the component is mounted on the DOM.

### Adding Timers

Timers are asynchronous and break the normal flow of user event driven React updates.

* kick the timer off once the component has mounted.
* handle clean up of the timer when the component unmounts or when done.

```javascript
class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToolTip: false,
      searchQuery: ''
    };
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showToolTip: true
      });
    }, 10000);
  }
  updateSearchQuery() {
    this.setState({
      searchQuery: this.search.value
    });
  }
  render() {
    const toolTip = (
      <div className="tooltip ui inverted">
        Not sure where to start? Try top Picks.
      </div>
    );
    return (
      <div className="products">
        <div className="ui search">
          <div className="ui item input">
            <input className="prompt" type="text" value={this.state.searchQuery} ref={
              (input) => { this.search = input; }
            } onChange={this.updateSearchQuery}/>
            <i className="search icon" />
          </div>
          <div className="results" />
        </div>
        <h1 className="ui dividing header">Shop by Category</h1>
        <div className="ui doubling four column grid">
          <div className="column segment secondary"></div>
          <div className="column segment secondary"></div>
          <div className="column segment secondary">
            <i className="heart icon" />
            <div className="category-title">Top Picks</div>
            { this.state.showToolTip ? toolTip : "" }
          </div>
          <div className="column segment secondary"></div>
        </div>
      </div>
    );
  }
}
```

Clearing the timer on user interaction:

```javascript
class Products extends React.Component {
  componentDidMount() {
    this.clearTimer = setTimeout(() => {
      this.setState({
        showToolTip: true
      });
    }, 10000);
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.searchQuery.length > 0) {
      clearTimeout(this.clearTimer);
    }
  }
  updateSearchQuery() { ... }
}
```

#### Update lifecycle

The update lifecycle methods are made up of several update methods and the render method.
These methods never run on the server.

* `componentWillReceiveProps(nextProps)`: happens when component is about to receive properties.
* `shouldComponentUpdate(nextProps, nextState)`
* `componentWillUpdate(nextProps, nextState)`: happens right before component will update.
* `render()`
* `componentDidUpdate(prevProps, prevState)`: happens right after component updated

#### Unmounting event

`componentWillUnmount()`

Clean up manually attached event listeners and shutdown any timers you may have running.

## Component Patterns

Composing React components in user interfaces:

* Higher-order components
* Presentation and Container components

### Higher-order Components

You might want to have a List component that is compatible with different data sets.

To accomplish this, you could create a ListDataFetcher component:
```javascript
const ListDataFetcher = (Component) => {
  // fetches some data
  // ensures data is compatible with the child component
  return <Component data={this.state.data} />
}
```

You pass in the Component to the FetchData function.
This abstracts away any state or logic form that is passed in to the Component.

If you have a component and then pass it into the Higher Order Component, you will end up with the original component plus some additional functionality.

### Component Types: Presentation and Container

#### Container components

* Contains state
* Responsible for how the app works
* Children: Container and Presentation Components
* Connect to rest of application (e.g. Redux)
* How it works

Container components abstract state away from their children.
They also handle layout and are generally responsible for the how of the application.
They listen for data changes and then pass that state down as props.

#### Presentation components

* Limited state (for user interactions), ideally implemented as a functional component.
* Responsible for how the app looks
* Children: Container and Presentation Components
* No dependencies model or controller portions of the app.
* What it looks like

Presentation components only contain state related to user interactions.
Whenever possible they should be implemented as pure components.
