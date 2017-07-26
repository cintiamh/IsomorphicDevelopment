# Testing and Debugging

https://github.com/isomorphic-dev-js/complete-isomorphic-example/tree/chapter-9.1.1

## Testing: React Components

For both unit tests and integration tests it is possible to use the same tooling setup to test your isomorphic app.

* Mocha/Chai: test library
* Karma: test runner

### Using Enzyme to Test Components

React provides React Test Utils for testing your components.

A library called Enzyme provides an API that makes writing test assertions against your view components straightforward.

* shallow version of the component: with no children.

Rendering with shallow: test/components/app.spec.jsx
```javascript
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Link } from 'react-router';
import App from '../../src/components/app';

describe('App Component', () => {
  let wrappedComponent;

  beforeEach(() => {
    wrappedComponent = shallow(<App />);
  });

  afterEach(() => {
    wrappedComponent = null;
  });

  it('Uses Link Components', () => {
    expect(wrappedComponent.find(Link).length).to.eq(3);
  });

  it('Links to /products, /cart and /profile pages', () => {
    expect(wrappedComponent.find({ to: '/products' }).length).to.eq(1);
    expect(wrappedComponent.find({ to: '/cart' }).length).to.eq(1);
    expect(wrappedComponent.find({ to: '/profile' }).length).to.eq(1);
  })
})
```

#### Enzyme Selectors

* Component selectors (takes a React component reference)
* Attribute selectors (takes an object)
* CSS selectors ('#id', '.class', '.multiple.class')

Testing a presentation component: test/components/item.spec.jsx
```javascript
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Item from '../../src/components/item';

describe('Item Component', () => {
  let testComponent;
  let props;

  beforeEach(() => {
    props = {
      thumbnail: 'http://image.png',
      name: 'Test Name',
      price: 10
    };
    testComponent = shallow(<Item {...props} />);
  });

  afterEach(() => {
    testComponent = null;
    props = null;
  });

  it('Displays a thumbnail based on its props', () => {
    expect(testComponent.find({ src: props.thumbnail }).length).to.eq(1);
  });

  it('Displays a name based on its props', () => {
    expect(testComponent.find('.middle.aligned.content').text()).to.eq(props.name);
  });

  it('Displays a price based on its props', () => {
    expect(testComponent.find('.right.aligned.content').text()).to.eq(`$${props.price}`);
  });
});
```

### Testing User Actions

Testing with  shallow render also lets you test user interactions.

Testing user interactions: test/components/cart.spec.jsx
```javascript
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { CartComponent } from '../../src/components/cart';

describe('Cart Component', () => {
  let testComponent;
  let props;

  beforeEach(() => {
    props = {
      items: [
        {
          thumbnail: 'http://image.png',
          name: 'Test Name',
          price: 10
        }
      ],
      router: {
        push: sinon.spy()
      }
    };
    testComponent = shallow(<CartComponent {...props} />);
  });

  afterEach(() => {
    testComponent = null;
    props = null;
  });

  it('When checkout is clicked, the router push method is triggered', () => {
    testComponent.find('.button').simulate('click');
    expect(props.router.push.called).to.be.truthy;
    expect(props.router.push.calledWith('/cart/payment')).to.be.truthy;
  });
});
```

The `simulate` does not propagate the fake events.

### Testing Nested Components

Using Enzyme's mount, it fully renders you component along with all its children.
This can be most useful for integration tests.

Rendering with mount: test/components/app.spec.jsx
```javascript
import React from 'react';
  import { Router, createMemoryHistory } from 'react-router';
  import { expect } from 'chai';
  import { mount } from 'enzyme';
  import { routes } from '../../src/shared/sharedRoutes';

  describe('App Component', () => {
    it('Uses Link Components', () => {
      const renderedComponent = mount(
        <Router
          routes={routes()}
          history={createMemoryHistory('/products')}
        />);
      expect(renderedComponent.find('.search').length).to.be.above(1);
    });
  });
```

#### Advance Enzyme API methods

* `setProps`: Use this method to pass in updated props to a loaded component. Useful for testing logic that happens in React lifecycle methods.
* `setState`: Use this method to change the state of a loaded component. Let’s you test complex cases, like the search input in products.jsx.
* `debug`: Useful for seeing the rendered html of the component at any point in time. Useful for debugging.
* `unmount`: Test any code that happens in your `componentWillUnmount`.

## Testing: Thinking Isomorphically
