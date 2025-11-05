import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { ClientsTab } from '../../components/admin/ClientsTab';
import { Users, BookOpen, BarChart3 } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCourses: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/courses/stats'),
        ]);

        setStats({
          totalClients: usersRes.data?.stats?.total || 0,
          totalCourses: coursesRes.data?.stats?.total || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-sm text-gray-500 mt-1">Bienvenido, {user?.name}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 max-w-4xl">
        {/* Clientes */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-150 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Clientes</p>
              {stats.loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mt-2"></div>
              ) : (
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalClients}
                </p>
              )}
            </div>
            <div className="text-primary-600">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <span className="text-xs sm:text-sm text-gray-500">Usuarios registrados</span>
          </div>
        </div>

        {/* Cursos */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-150 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Cursos</p>
              {stats.loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mt-2"></div>
              ) : (
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.totalCourses}
                </p>
              )}
            </div>
            <div className="text-primary-600">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </div>
          </div>
          <div className="mt-2 sm:mt-4">
            <span className="text-xs sm:text-sm text-gray-500">Cursos creados</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150">
        <div className="border-b border-gray-150 px-2 sm:px-6">
          <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Resumen', icon: BarChart3 },
              { id: 'clients', name: 'Clientes', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'clients' && <ClientsTab />}
        </div>
      </div>
    </div>
  );
};

// Componentes de pestañas
const OverviewTab = () => {
  const [recentActivity, setRecentActivity] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Obtener últimos clientes registrados
        const usersRes = await api.get('/users', {
          params: { role: 'client' }
        });
        const recentClients = (usersRes.data?.users || []).slice(0, 5);

        // Convertir a formato de actividad
        const activities = recentClients.map(client => ({
          action: 'Nuevo cliente registrado',
          client: client.name,
          email: client.email,
          time: formatDate(client.createdAt),
          type: 'client'
        }));

        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recientemente';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
      {recentActivity.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay actividad reciente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.client}</p>
                  {activity.email && (
                    <p className="text-xs text-gray-400">{activity.email}</p>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
