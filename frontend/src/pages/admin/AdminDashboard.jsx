import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Total Clientes', value: '24', icon: '👥', change: '+12%', trend: 'up' },
    { name: 'Licencias Activas', value: '1,248', icon: '🎫', change: '+18%', trend: 'up' },
    { name: 'Cursos Disponibles', value: '12', icon: '📚', change: '+2', trend: 'up' },
    { name: 'Campañas Activas', value: '8', icon: '📊', change: '-5%', trend: 'down' },
  ];

  return (
    <div className="min-h-screen bg-gray-75">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="mt-1 text-sm text-gray-500">Bienvenido, {user?.name}</p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Cliente
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-150 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-secondary-600' : 'text-danger-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 mb-6">
          <div className="border-b border-gray-150">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
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
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'clients' && <ClientsTab />}
            {activeTab === 'courses' && <CoursesTab />}
            {activeTab === 'licenses' && <LicensesTab />}
            {activeTab === 'campaigns' && <CampaignsTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </div>
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

const ClientsTab = () => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Gestión de Clientes</h3>
      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
        + Agregar Cliente
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Licencias</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cliente {i}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">cliente{i}@empresa.com</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i * 50}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
                  Activo
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
