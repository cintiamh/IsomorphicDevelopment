# Introduction to Isomorphic Web Application Architecture

Isomorphic application => server rendered + single page web app.

* Search Engine Optimization (SEO)
* Handle complex UI
* Browser push history

## Building our stack

* NodeJS
* React
* React Router
* Redux
* Babel
* webpack

## Application Flow

1. The browser initiates the request.
2. The server receives a request.
3. The server determines what needs to be rendered.
4. The server gathers the data required for the part of our app being requested.
5. The server generates the HTML for our web page using the data from 4.
6. The server responds to the request with the fully-built HTML.

## Advantages of Isomorphic App Architecture

* Simplified and improved SEO
* Perceived performance
* Maintenance
* Accessibility

With Isomorphic architecture you can serve portions of your site without requiring JavaScript.

Since we serve a complete page to the browser, users can at least see your content.

## Building the View with React

React is a library for creating UI.

### Understanding the Virtual DOM

Virtual DOM => representation of the browser DOM written with JavaScript.

React compares the virtual tree to the current tree and calculates what needs to be updated.

React updates only the parts of the DOM that has updates.

The Virtual DOM can be used on server side and even render as a "string" `ReactDOM.renderToString`.

## Business Logic and Model: Redux

### One Way data Flow

Redux holds the state of your app in its store, providing a single source of truth for your application.

Views or node middleware dispatches Action => Reducers => new Store with changes.

ONLY REDUCERS CAN UPDATE THE STORE. Store is read only.

## Building the app: webpack
