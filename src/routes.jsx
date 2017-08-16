import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './components/app';
import Cart from './components/cart';
import Products from './components/products';
import Profile from './components/profile';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={App} />
    <Route exact path="/cart" component={Cart} />
    <Route path="/products" component={Products} />
    <Route path="/profile" component={Profile} />
  </Switch>
);

export default Routes;
