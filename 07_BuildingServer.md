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
