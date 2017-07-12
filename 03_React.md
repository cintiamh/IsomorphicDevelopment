# React Overview

Project: https://github.com/isomorphic-dev-js/chapter3-react-overview

## Overview of React

### Basic rendering

```html
<html>
  <head>
    <title>React render example</title>
    <script src="https://npmcdn.com/react@15.3.1/dist/react.js"></script>
    <script src="https://npmcdn.com/react-dom@15.3.1/dist/react-dom.js"></script>
  </head>
  <body>
    <div id="render-react-into-me"></div>
    <script type="text/javascript">
      ReactDOM.render(
        React.createElement("div", null, "My first react component"),
        document.getElementById('render-react-into-me')
      );
    </script>
  </body>
</html>
```

## Virtual DOM

React updates only those parts that are absolutely necessary so that the internal state (virtual DOM) and the view (real DOM) are the same.

## Your First React Component

### JSX Basics

JSX is a template language that makes writing components almost like writing HTML.

JSX provides syntax for indicating where to execute JavaScript expressions: `{}`.

#### Common JSX Gotchas

For a full list: https://facebook.github.io/react/docs/jsx-in-depth.html

* instead of `class`, use `className`
* custom attributes, use `data-` prefix `<div data-custom-id=”1234”></div>`
* you cannot use HTML style comments: `<!-- html comment -->` use a JavaScript comment instead `{ /* My comment */ }`

### Building a reusable component

In a React view each repeatable element can become a component. Other components wrap the smaller composable components and determines the layout.

### Using Props

You can pass in the name property with a value:

```javascript
<ListItem name="Cleanup my desk" />
```

The component can then access this value on the `props` object.

```html
<div>{props.name}</div>
```

This in turn will render like this:

```html
<div>Cleanup my desk</div>
```

* Properties are immutable within their components.
* A parent assign properties to its children upon their creation.
* The child is not supposed to change to modify its properties.

### Functional components

Given a set of inputs, the component will return a predictable output.

### Conditionals and Looping

## Interactive components: React state
