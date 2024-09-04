// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Helper function to check if a user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;  // Return true if token exists, false otherwise
};

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
