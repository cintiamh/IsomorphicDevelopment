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
