// src/components/ProtectedRoute.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { selectIsAuthenticated, selectAuthLoading } from '../store/features/authSlice';
import { useGetCurrentUserQuery } from '../store/api/authApi';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  
  // Try to get current user to verify authentication
  const { isLoading: userLoading, error } = useGetCurrentUserQuery();

  // Show loading while checking authentication
  if (authLoading || userLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // If not authenticated, redirect to login with return url
  if (!isAuthenticated || error) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;