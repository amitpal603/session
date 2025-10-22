// src/components/common/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthoContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // FIX: Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // FIX: Redirect to login with return url
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // FIX: Admin check
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;