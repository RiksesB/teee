import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CLIENT: 'client',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada y validarla con el backend
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('niblion_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          // Validar token con el backend
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(userData);
          } else {
            // Token inválido
            localStorage.removeItem('niblion_user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error validando sesión:', error);
          localStorage.removeItem('niblion_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Llamada real al backend
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        const { user: userData, accessToken, refreshToken } = response.data;

        const user = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          companyName: userData.companyName,
          credits: userData.credits,
          token: accessToken,
          refreshToken: refreshToken,
        };

        setUser(user);
        localStorage.setItem('niblion_user', JSON.stringify(user));

        return { success: true, role: user.role };
      } else {
        throw new Error('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Mensajes de error específicos según el código de estado
      let errorMessage = 'Error al iniciar sesión';

      if (error.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message;

        if (status === 401) {
          errorMessage = backendMessage || 'Credenciales incorrectas. Por favor verifica tu email y contraseña.';
        } else if (status === 404) {
          errorMessage = 'Usuario no encontrado. Por favor regístrate primero.';
        } else if (status === 400) {
          errorMessage = backendMessage || 'Datos inválidos. Verifica tu email y contraseña.';
        } else {
          errorMessage = backendMessage || `Error del servidor (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        errorMessage = error.message || 'Error desconocido al iniciar sesión';
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      // Llamada real al backend
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        name: userData.contactName || userData.companyName,
        companyName: userData.companyName,
        phone: userData.phone,
        employees: userData.employees,
      });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Usuario registrado exitosamente',
        };
      } else {
        throw new Error('Error al registrar usuario');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrar usuario';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Llamar al endpoint de logout para invalidar el refresh token
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      // Limpiar estado local siempre
      setUser(null);
      localStorage.removeItem('niblion_user');
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
