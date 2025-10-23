import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'client',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('niblion_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('niblion_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock users for testing - replace with real API call
      const mockUsers = {
        'admin@niblion.com': {
          id: 1,
          email: 'admin@niblion.com',
          name: 'Administrador Niblion',
          role: 'admin',
          password: 'admin123'
        },
        'client@techcorp.com': {
          id: 2,
          email: 'client@techcorp.com',
          name: 'María González - TechCorp',
          role: 'client',
          password: 'client123'
        },
        'client2@startup.com': {
          id: 3,
          email: 'client2@startup.com',
          name: 'Carlos Rodríguez - StartupXYZ',
          role: 'client',
          password: 'client123'
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = mockUsers[email];
      
      if (!user || user.password !== password) {
        throw new Error('Credenciales inválidas');
      }

      // Generate mock JWT token
      const mockToken = `mock_jwt_token_${user.id}_${Date.now()}`;
      
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: mockToken,
      };

      setUser(userData);
      localStorage.setItem('niblion_user', JSON.stringify(userData));
      
      return { success: true, role: userData.role };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('niblion_user');
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
