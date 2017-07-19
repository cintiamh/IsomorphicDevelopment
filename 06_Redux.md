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
