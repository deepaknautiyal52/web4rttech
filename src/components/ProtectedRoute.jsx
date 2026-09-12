import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/adminAuth';

const ProtectedRoute = ({ children }) => {
  if (!getToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
