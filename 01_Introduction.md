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
