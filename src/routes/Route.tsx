import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import Layout from '../components/Layout';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  requiredRole?: 'user' | 'admin';
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  requiredRole,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate !== !!user) {
          return (
            <Redirect
              to={{
                pathname: isPrivate ? '/signin' : '/',
                state: {
                  from: location,
                },
              }}
            />
          );
        }

        if (isPrivate && requiredRole && user?.role !== requiredRole) {
          return (
            <Redirect
              to={{ pathname: '/', state: { from: location } }}
            />
          );
        }

        if (isPrivate) {
          return (
            <Layout>
              <Component />
            </Layout>
          );
        }

        return <Component />;
      }}
    />
  );
};

export default Route;
