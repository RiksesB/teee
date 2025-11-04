import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirigir a login guardando la ubicación intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene el rol permitido
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirigir al dashboard apropiado según su rol
    const redirectPath = (user.role === 'admin' || user.role === 'super_admin') ? '/admin' : '/client';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // Si ya está autenticado, redirigir según rol
    const redirectPath = (user.role === 'admin' || user.role === 'super_admin') ? '/admin' : '/client';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
