import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import AcceptInvite from '../pages/AcceptInvite';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Profile from '../pages/Profile';
import AddSupplier from '../pages/AddSupplier';
import AddProduct from '../pages/AddProduct';
import Dashboard from '../pages/Dashboard';
import Suppliers from '../pages/Suppliers';
import Products from '../pages/Products';
import EditSupplier from '../pages/EditSupplier';
import EditProduct from '../pages/EditProduct';
import Clients from '../pages/Clients';
import AddClient from '../pages/AddClient';
import EditClient from '../pages/EditClient';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/signin" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/accept-invite" component={AcceptInvite} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/" exact component={Dashboard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/supplier/add" exact component={AddSupplier} isPrivate />
    <Route path="/supplier/:id" component={EditSupplier} isPrivate />
    <Route path="/suppliers" component={Suppliers} isPrivate />
    <Route path="/product/add" exact component={AddProduct} isPrivate />
    <Route path="/product/:id" component={EditProduct} isPrivate />
    <Route path="/products" component={Products} isPrivate />
    <Route path="/client/add" exact component={AddClient} isPrivate />
    <Route path="/client/:id" component={EditClient} isPrivate />
    <Route path="/clients" component={Clients} isPrivate />
  </Switch>
);

export default Routes;
