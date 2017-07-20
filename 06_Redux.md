# Redux

Redux is a library that provides an architecture for writing your business logic.

* dictates a clear line of communication between your view and your business logic.
* allows your view to subscribe to the application state so it can update each time the state updates.
* enforces an immutable application state.

## Introduction to Redux

* Redux dictates a single directional flow for updating the app state in a single Store.
* The store is a JavaScript object.
* Redux notifies any subscribers about updates to the store object.

### Getting started with notifications example app

https://github.com/isomorphic-dev-js/chapter6-redux

### Redux Overview

Main parts of Redux:
1. actions: implements business logic, like updating or adding new notifications.
2. reducers: write state changes triggered by action to the store.
3. store: current application state.

## Redux and Flux: Architecture Patterns

User dismisses an alert => dispatch remove alert action => Update store (remove alert) => Notify view of updated alert list

## Managing Application State

Redux store methods:

* `dispatch(action)`: trigger an update on the store.
* `getState()`: returns the current store object.
* `subscribe()`: listen to changes on the store.

Redux provides a way to initialize the state (store) and then manages the flow of updates to the store and then notifying the view.

To configure the store in your app you need to create your reducers and then initialize the store with them.

Initialize Redux:
```javascript
import { createStore, combineReducers } from 'redux';
import notifications from './notifications-reducer';
import settings from './settings-reducer';

export default function() {
  const reducer = combineReducers({
    notifications,
    settings
  });
  return createStore(reducer);
}
```

Subscribe to store:
```javascript
const store = initRedux();

store.subscribe(() => {
  console.log("Store updated", store.getState());
})
```

### Reducers: Updating the State

Each reducer takes in the store and an action and returns the modified store.

Settings Reducers:
```javascript
import { UPDATE_REFRESH_DELAY } from './settings-action-reducers';

export default function settings(state = {}, action) {
  switch (action.type) {
    case UPDATE_REFRESH_DELAY:
      return {
        ...state,
        refresh: action.time
      }
    default:
      return state
  }
}
```

* Reducers must always be pure functions.
* Reducers must enforce the immutable nature of the store.

#### Immutable Helper Libraries

* Immutable.js
* Rambda
* Underscore
* Lodash
* Deepfreeze

### Actions: Triggering state updates

Actions are the only way to trigger an update to your application state in a Redux application.

Actions will often be objects that contain some data to be updated in the store in addition to the type property.

It is recommended to create reusable functions (action creators) that return the action you want to dispatch.

Action creator files are a good place to define your string constants for actions.

Synchronous actions:
```javascript
export const UPDATE_REFRESH_DELAY = 'UPDATE_REFRESH_DELAY';

export function updateRefreshDelay(time) {
  return {
    type: UPDATE_REFRESH_DELAY,
    time: time
  };
}
```

To dispatch this update to the store.
```javascript
store.dispatch(updateRefreshDelay(5));
```

The reducer will be triggered and the store will be updated.

## Applying Middleware to Redux

Redux let you extend the default functionality of the dispatcher.

These middleware will be called before the final default dispatch behavior.

```javascript
middleware1(dispatchedAction).middleware2(dispatchedAction).middleware3(dispatchedAction).dispatch(dispatchedAction)
```

This allows you to add functionality for debugging and making asynchronous calls.

### Middleware basics: debugging

Using Redux Logger library.

You add middleware when you instantiate your store:
```javascript
export default function() {
  const reducer = combineReducers({ ... });
  let middleware = [logger];
  return compose(
    applyMiddleware(...middleware)
  )(createStore)(reducer);
}
```

* Call `compose` passing in the store so that the middleware will be applied to the store.
* Call `applyMiddleware` on the middleware array to setup the middleware properly.

### Handling asynchronous actions

Asynchronous action creators wait for something to happen (like a network call to complete) and then return the action object.

Redux Thunk: access the dispatch object inside of your action creator function.

Action creator:
```javascript
export const UPDATE_ACTION = 'UPDATE_ACTION';

export function actionCreator() {
  return dispatch => {
    return dispatch({
      type: UPDATE_ACTION
    })
  }
}
```

Asynchronous Action Creators:
```javascript
import request from 'isomorphic-fetch';

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';

export function fetchNotifications() {
  return dispatch => {
    let headers = new Headers({
      "Content-Type": "application/json"
    });
    return fetch(
      'http://localhost:3000/notications',
      { headers: headers }
    ).then((response) => {
      return response.json().then(data => {
        return dispatch({
          type: FETCH_NOTIFICATIONS,
          notifications: data
        })
      })
    })
  }
}
```

## Using Redux with React components

In a React app, the actions are typically dispatched from components.

In order to have access to the store in a component, you need to wire up your React components to Redux using `react-redux`.

You need a top component called `Provider`.
You also need a Higher-Order Component called `connect`.

### Wrapping your app with Provider

`Provider` is a React component from `react-redux` that acts as the root of your application and makes the store available to the `connect` HOC.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.jsx';
import { Provider } from 'react-redux';
import initRedux from './init-redux.es6';
require('./style.css');

const initialState = window.__INITIAL_STATE;
const store = initRedux(initialState);

store.subscribe(() => {
  console.log('Store updated', store.getState());
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-content')
)
```

Now you have access to the store in your components.

### Subscribing to the store from React

Now you need to wrap your container components in the `connect` HOC.
This component handles subscribing to the store for you.

`connect` also provides some helper methods to map the store to props and to make calls from the view.

```javascript
export default connect(mapStateToProps, mapDispatchToProps)(Component);
```

Connect React to Redux:
```javascript
class App extends React.Component {
  componentDidMount() {}
  getSystemNotifications(id) {
    let items = [];
    if (this.props.all) {
      this.props.all.forEach((item, index) => {
        if (item.serviceId == id) {
          let classes = classnames("ui", "message", item.messageType);
          items.push(
            <div className={classes} key={index}>
              <i className="close icon" onClick={this.dismiss.bind(this, index)}></i>
              <p>
                {item.message}
              </p>
            </div>
          )
        }
      })
    }
    return items;
  }
  render() {}
}

function mapStateToProps(state) {
  let { notifications } = state.notifications;
  let { refresh } = state.settings;
  return {
    notifications,
    refresh
  }
}

function mapDispatchToProps(dispatch) {}

export default connect(mapStateToProps, mapDispatchToProps)(App)
```

With `mapDispatchToProps`, you are making actions available to be dispatched directly from the components props.

This helper method lets you use JavaScript's bind to automatically dispatch actions when they are called from the view.

```javascript
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../action-creators';
import * as settingsActionCreators from '../settings-action-creators';

import CreateNotification from './create-notification';
import Settings from './settings';
import classnames from 'classnames';

class App extends React.Component {
  // ... component implementation code
  componentDidMount() {
    intervalId = setInterval(() => {
      this.props.notificationActions.fetchNotifications();
    }, this.props.refresh * 1000);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    notificationActions: bindActionCreators(actionCreators, dispatch),
    settingsActions: bindActionCreators(settingsActionCreators, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(App)
```
