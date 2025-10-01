import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalActiveSessions: 0,
    byState: {},
    byModule: {},
    averageProgress: 0
  });
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchHealthStatus();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      fetchStats();
      fetchHealthStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/health');
      const data = await response.json();
      setHealthStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching health:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitoreo en tiempo real del sistema de concientización en seguridad
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button 
            onClick={() => { fetchStats(); fetchHealthStatus(); }}
            className="btn-secondary"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Health Status Alert */}
      {healthStatus && healthStatus.status !== 'healthy' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Estado del sistema: {healthStatus.status}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Algunos servicios pueden estar experimentando problemas.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Sesiones Activas"
          value={stats.totalActiveSessions}
          icon={UsersIcon}
          color="blue"
          subtitle="Usuarios conectados ahora"
        />
        
        <StatCard
          title="Progreso Promedio"
          value={`${Math.round(stats.averageProgress)}%`}
          icon={ChartBarIcon}
          color="green"
          subtitle="Avance en el curso"
        />
        
        <StatCard
          title="En Cuestionarios"
          value={stats.byState?.answering_quiz || 0}
          icon={AcademicCapIcon}
          color="yellow"
          subtitle="Respondiendo preguntas"
        />
        
        <StatCard
          title="Viendo Videos"
          value={stats.byState?.watching_video || 0}
          icon={ClockIcon}
          color="purple"
          subtitle="En contenido educativo"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Estado de Sesiones */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estado de Sesiones
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byState).map(([state, count]) => (
              <div key={state} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {state.replace('_', ' ')}
                </span>
                <span className="badge badge-info">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Módulo */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Usuarios por Módulo
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byModule).map(([module, count]) => (
              <div key={module} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Módulo {module}
                </span>
                <span className="badge badge-success">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      {healthStatus && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estado del Sistema
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Object.entries(healthStatus.services || {}).map(([service, status]) => (
              <div key={service} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  status.status === 'healthy' ? 'bg-green-400' : 
                  status.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {service}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  status.status === 'healthy' ? 'bg-green-100 text-green-800' :
                  status.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {status.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}