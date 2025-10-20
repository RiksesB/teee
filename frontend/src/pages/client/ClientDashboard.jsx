import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');

  const userStats = {
    licensesAvailable: 45,
    licensesTotal: 100,
    activeCampaigns: 3,
    completedCourses: 12,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Bienvenido, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Licencias disponibles</p>
                <p className="text-2xl font-bold text-primary-600">
                  {userStats.licensesAvailable}/{userStats.licensesTotal}
                </p>
              </div>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Campaña
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Campañas Activas</p>
                <p className="text-4xl font-bold mt-2">{userStats.activeCampaigns}</p>
                <p className="text-primary-100 text-sm mt-2">En progreso</p>
              </div>
              <div className="text-6xl opacity-20">📢</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100 text-sm font-medium">Cursos Completados</p>
                <p className="text-4xl font-bold mt-2">{userStats.completedCourses}</p>
                <p className="text-secondary-100 text-sm mt-2">Total en la empresa</p>
              </div>
              <div className="text-6xl opacity-20">📚</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Tasa de Éxito</p>
                <p className="text-4xl font-bold mt-2">87%</p>
                <p className="text-purple-100 text-sm mt-2">Promedio general</p>
              </div>
              <div className="text-6xl opacity-20">📈</div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'catalog', name: 'Catálogo de Cursos', icon: '📚' },
                { id: 'licenses', name: 'Mis Licencias', icon: '🎫' },
                { id: 'campaigns', name: 'Mis Campañas', icon: '📢' },
                { id: 'tracking', name: 'Seguimiento', icon: '📊' },
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
            {activeTab === 'catalog' && <CatalogTab />}
            {activeTab === 'licenses' && <LicensesTab userStats={userStats} />}
            {activeTab === 'campaigns' && <CampaignsTab />}
            {activeTab === 'tracking' && <TrackingTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes de pestañas
const CatalogTab = () => {
  const courses = [
    { id: 1, title: 'Fundamentos de Phishing', modules: 5, duration: '2h', level: 'Básico', enrolled: 0 },
    { id: 2, title: 'Detección Avanzada de Amenazas', modules: 8, duration: '3h', level: 'Intermedio', enrolled: 0 },
    { id: 3, title: 'Ingeniería Social', modules: 6, duration: '2.5h', level: 'Avanzado', enrolled: 0 },
    { id: 4, title: 'Seguridad en Email Corporativo', modules: 4, duration: '1.5h', level: 'Básico', enrolled: 0 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cursos Disponibles</h3>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option>Todos los niveles</option>
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-3xl">
                📚
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course.level === 'Básico' ? 'bg-secondary-100 text-secondary-700' :
                course.level === 'Intermedio' ? 'bg-primary-100 text-primary-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {course.level}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {course.modules} módulos
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration}
              </span>
            </div>

            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const LicensesTab = ({ userStats }) => (
  <div>
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {userStats.licensesAvailable} licencias disponibles
          </h3>
          <p className="text-gray-600">De un total de {userStats.licensesTotal} adquiridas</p>
        </div>
        <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
          Comprar Más Licencias
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
        <div className="text-5xl mb-4">📦</div>
        <h4 className="font-semibold text-gray-900 mb-2">Paquete Básico</h4>
        <p className="text-3xl font-bold text-primary-600 mb-2">50</p>
        <p className="text-sm text-gray-500 mb-4">licencias</p>
        <p className="text-2xl font-bold text-gray-900 mb-4">$499</p>
        <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
          Seleccionar
        </button>
      </div>

      <div className="border-2 border-primary-500 rounded-lg p-6 text-center relative shadow-md">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
          Recomendado
        </div>
        <div className="text-5xl mb-4">📦</div>
        <h4 className="font-semibold text-gray-900 mb-2">Paquete Pro</h4>
        <p className="text-3xl font-bold text-primary-600 mb-2">100</p>
        <p className="text-sm text-gray-500 mb-4">licencias</p>
        <p className="text-2xl font-bold text-gray-900 mb-4">$899</p>
        <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
          Seleccionar
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
        <div className="text-5xl mb-4">📦</div>
        <h4 className="font-semibold text-gray-900 mb-2">Paquete Enterprise</h4>
        <p className="text-3xl font-bold text-primary-600 mb-2">250</p>
        <p className="text-sm text-gray-500 mb-4">licencias</p>
        <p className="text-2xl font-bold text-gray-900 mb-4">$1,999</p>
        <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
          Seleccionar
        </button>
      </div>
    </div>
  </div>
);

const CampaignsTab = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Mis Campañas</h3>
      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Crear Nueva Campaña
      </button>
    </div>

    <div className="space-y-4">
      {[
        { name: 'Campaña Trimestral Q4', status: 'active', progress: 65, enrolled: 45, completed: 29 },
        { name: 'Onboarding Nuevos Empleados', status: 'active', progress: 30, enrolled: 15, completed: 4 },
        { name: 'Campaña Anual 2024', status: 'completed', progress: 100, enrolled: 100, completed: 100 },
      ].map((campaign, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">{campaign.name}</h4>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                campaign.status === 'active' ? 'bg-secondary-100 text-secondary-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {campaign.status === 'active' ? 'Activa' : 'Completada'}
              </span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">⋮</button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progreso</span>
              <span className="font-semibold text-gray-900">{campaign.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${campaign.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Inscritos</p>
              <p className="font-semibold text-gray-900">{campaign.enrolled}</p>
            </div>
            <div>
              <p className="text-gray-500">Completados</p>
              <p className="font-semibold text-gray-900">{campaign.completed}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TrackingTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Seguimiento y Analíticas</h3>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Desempeño por Departamento</h4>
        <div className="space-y-3">
          {[
            { dept: 'IT', score: 95, color: 'secondary' },
            { dept: 'Ventas', score: 87, color: 'primary' },
            { dept: 'Marketing', score: 78, color: 'purple' },
            { dept: 'RRHH', score: 92, color: 'secondary' },
          ].map((item) => (
            <div key={item.dept}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.dept}</span>
                <span className="font-semibold text-gray-900">{item.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${item.color}-600 h-2 rounded-full`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Últimas Actividades</h4>
        <div className="space-y-3">
          {[
            { user: 'Juan Pérez', action: 'completó curso de Phishing', time: 'Hace 2 horas' },
            { user: 'María García', action: 'inició curso de Seguridad', time: 'Hace 5 horas' },
            { user: 'Carlos López', action: 'obtuvo certificado', time: 'Hace 1 día' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
