import React from 'react';
import { Navigate } from 'react-router-dom';
import RouteWrapper from './routeWrapper';

const ProtectedRoute = ({ role, element: Component, acceptProps = []  }) => {

  if (!role) {
    return <Navigate to="/" />
  }

  return <RouteWrapper Component={Component} acceptProps={acceptProps} />;
};

export default ProtectedRoute;