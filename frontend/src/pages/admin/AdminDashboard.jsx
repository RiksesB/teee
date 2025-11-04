import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

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
        <button className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nuevo Cliente</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
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
            <div className="text-2xl sm:text-3xl lg:text-4xl">👥</div>
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
            <div className="text-2xl sm:text-3xl lg:text-4xl">📚</div>
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
              { id: 'overview', name: 'Resumen', icon: '📊' },
              { id: 'clients', name: 'Clientes', icon: '👥' },
              { id: 'courses', name: 'Cursos', icon: '📚' },
              { id: 'licenses', name: 'Licencias', icon: '🎫' },
              { id: 'campaigns', name: 'Campañas', icon: '📢' },
              { id: 'reports', name: 'Reportes', icon: '📈' },
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
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'clients' && <ClientsTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'licenses' && <LicensesTab />}
          {activeTab === 'campaigns' && <CampaignsTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </div>
      </div>
    </div>
  );
};

// Componentes de pestañas
const OverviewTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
    <div className="space-y-3">
      {[
        { action: 'Nueva campaña creada', client: 'TechCorp', time: 'Hace 2 horas', type: 'campaign' },
        { action: 'Licencias renovadas', client: 'StartupXYZ', time: 'Hace 5 horas', type: 'license' },
        { action: 'Curso completado', client: 'Enterprise Inc', time: 'Hace 1 día', type: 'course' },
      ].map((activity, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.type === 'campaign' ? 'bg-primary-100 text-primary-600' :
              activity.type === 'license' ? 'bg-secondary-100 text-secondary-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              {activity.type === 'campaign' ? '📢' : activity.type === 'license' ? '🎫' : '📚'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.client}</p>
            </div>
          </div>
          <span className="text-sm text-gray-400">{activity.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const ClientsTab = () => {
  const clients = [
    { id: 1, name: 'Cliente 1', email: 'cliente1@empresa.com', licenses: 50, status: 'Activo' },
    { id: 2, name: 'Cliente 2', email: 'cliente2@empresa.com', licenses: 100, status: 'Activo' },
    { id: 3, name: 'Cliente 3', email: 'cliente3@empresa.com', licenses: 150, status: 'Activo' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
        <h3 className="text-lg font-semibold text-gray-900">Gestión de Clientes</h3>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium text-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Cliente
        </button>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{client.name}</h4>
                <p className="text-sm text-gray-500 truncate mt-1">{client.email}</p>
              </div>
              <span className="ml-2 px-2.5 py-1 text-xs font-semibold rounded-full bg-secondary-100 text-secondary-800 whitespace-nowrap">
                {client.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-500">Licencias:</span>
                <span className="ml-2 font-medium text-gray-900">{client.licenses}</span>
              </div>
              <div className="flex gap-2">
                <button className="text-primary-600 hover:text-primary-900 font-medium">Editar</button>
                <button className="text-danger-600 hover:text-danger-900 font-medium">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licencias</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.licenses}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 mr-3">Editar</button>
                  <button className="text-danger-600 hover:text-danger-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CoursesTab = () => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Catálogo de Cursos</h3>
      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
        + Nuevo Curso
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
              📚
            </div>
            <button className="text-gray-400 hover:text-gray-600">⋮</button>
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Curso de Phishing Básico {i}</h4>
          <p className="text-sm text-gray-500 mb-3">Módulos: 5 | Duración: 2h</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-600 font-medium">Publicado</span>
            <button className="text-sm text-primary-600 hover:text-primary-700">Ver detalles →</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LicensesTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Licencias</h3>
    <p className="text-gray-600">Control y asignación de licencias por cliente.</p>
  </div>
);

const CampaignsTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campañas Activas</h3>
    <p className="text-gray-600">Seguimiento de campañas de concienciación.</p>
  </div>
);

const ReportsTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes y Analíticas</h3>
    <p className="text-gray-600">Métricas y estadísticas de uso de la plataforma.</p>
  </div>
);
