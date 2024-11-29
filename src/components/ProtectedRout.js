import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token.split('=')[1]);
      isAuthenticated = !!decodedToken;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;