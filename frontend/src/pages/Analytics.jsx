import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export function Analytics() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      completionRate: 0,
      averageScore: 0,
      averageTimePerModule: 0
    },
    moduleStats: [],
    progressTrends: [],
    timeDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?period=${timeRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const OverviewCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {change !== undefined && (
              <div className={`ml-2 flex items-center text-sm ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(change)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ModuleStatsTable = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">
          Estadísticas por Módulo
        </h3>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {analytics.moduleStats.map((module, index) => (
          <div key={index} className="bg-gray-75 rounded-lg p-4 border border-gray-150">
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-900">
                Módulo {module.moduleId}
              </div>
              <div className="text-xs text-gray-500">
                {module.title}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <div className="text-xs text-gray-500">Participantes</div>
                <div className="font-semibold text-gray-900">{module.totalParticipants}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Completados</div>
                <div className="font-semibold text-gray-900">{module.completed}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Puntuación</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  module.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                  module.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {Math.round(module.averageScore)}%
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-500">Tiempo</div>
                <div className="font-semibold text-gray-900">{formatTime(module.averageTime)}</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Tasa de Éxito</span>
                <span className="font-semibold text-gray-900">
                  {Math.round((module.completed / module.totalParticipants) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${(module.completed / module.totalParticipants) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-150">
          <thead className="bg-gray-75">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Módulo
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participantes
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completados
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tasa de Éxito
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntuación
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiempo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-150">
            {analytics.moduleStats.map((module, index) => (
              <tr key={index} className="hover:bg-gray-75">
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    Módulo {module.moduleId}
                  </div>
                  <div className="text-xs text-gray-500">
                    {module.title}
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {module.totalParticipants}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {module.completed}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900">
                      {Math.round((module.completed / module.totalParticipants) * 100)}%
                    </div>
                    <div className="ml-2 w-12 lg:w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(module.completed / module.totalParticipants) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    module.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                    module.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {Math.round(module.averageScore)}%
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatTime(module.averageTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProgressChart = () => (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Tendencia de Progreso
      </h3>
      
      {analytics.progressTrends.length > 0 ? (
        <div className="space-y-4">
          {analytics.progressTrends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-75 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(trend.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {trend.newUsers} nuevos usuarios
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {trend.completions} completados
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(trend.completionRate)}% tasa
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p>No hay datos de tendencias disponibles</p>
        </div>
      )}
    </div>
  );

  const TimeDistributionChart = () => (
    <div className="card">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
        Distribución Horaria de Actividad
      </h3>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 sm:gap-2">
        {Object.entries(analytics.timeDistribution).map(([hour, count]) => (
          <div key={hour} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{hour}:00</div>
            <div
              className="bg-blue-200 rounded"
              style={{
                height: `${Math.max(20, (count / Math.max(...Object.values(analytics.timeDistribution))) * 60)}px`
              }}
            ></div>
            <div className="text-xs text-gray-700 mt-1">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-64 bg-gray-200 rounded"></div>
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
            Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Análisis detallado del rendimiento y participación
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field"
          >
            <option value="1d">Último día</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Usuarios"
          value={analytics.overview.totalUsers}
          icon={UserGroupIcon}
          color="blue"
        />
        
        <OverviewCard
          title="Tasa de Completación"
          value={`${Math.round(analytics.overview.completionRate)}%`}
          icon={TrophyIcon}
          color="green"
        />
        
        <OverviewCard
          title="Puntuación Promedio"
          value={`${Math.round(analytics.overview.averageScore)}%`}
          icon={ChartBarIcon}
          color="yellow"
        />
        
        <OverviewCard
          title="Tiempo Promedio"
          value={formatTime(analytics.overview.averageTimePerModule)}
          icon={ClockIcon}
          color="purple"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ModuleStatsTable />
        </div>
        
        <div className="space-y-6">
          <ProgressChart />
          <TimeDistributionChart />
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
          Exportar Datos
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.open(`/api/analytics/export?format=csv&period=${timeRange}`)}
            className="btn-secondary"
          >
            Descargar CSV
          </button>
          <button
            onClick={() => window.open(`/api/analytics/export?format=pdf&period=${timeRange}`)}
            className="btn-secondary"
          >
            Generar Reporte PDF
          </button>
        </div>
      </div>
    </div>
  );
}