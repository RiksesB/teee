import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, USER_ROLES } from '../../contexts/AuthContext';
import { NiblionLogo } from '../ui/Logo';

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const adminNavigation = [
    { name: 'Resumen', href: '/admin', icon: '📊' },
    { name: 'Clientes', href: '/admin/clients', icon: '👥' },
    { name: 'Cursos', href: '/admin/courses', icon: '📚' },
    { name: 'Licencias', href: '/admin/licenses', icon: '🎫' },
    { name: 'Campañas', href: '/admin/campaigns', icon: '📢' },
    { name: 'Reportes', href: '/admin/reports', icon: '📈' },
  ];

  const clientNavigation = [
    { name: 'Mi Dashboard', href: '/client', icon: '🏠' },
    { name: 'Catálogo', href: '/client/catalog', icon: '📚' },
    { name: 'Mis Licencias', href: '/client/licenses', icon: '🎫' },
    { name: 'Campañas', href: '/client/campaigns', icon: '📢' },
    { name: 'Seguimiento', href: '/client/tracking', icon: '📊' },
  ];

  const navigation = isAdmin ? adminNavigation : clientNavigation;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-75">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-150 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-150 gap-3">
          <Link to={isAdmin ? '/admin' : '/client'} className="flex items-center gap-3">
            <NiblionLogo size="md" />
            <span className="text-xl font-bold text-gray-900 niblion-brand">Niblion</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-75'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-150">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-75 rounded-lg hover:bg-gray-150 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
};
