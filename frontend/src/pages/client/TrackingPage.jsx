import React from 'react';

export const TrackingPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seguimiento y Analíticas</h1>
          <p className="text-gray-600">Monitorea el progreso de tus empleados y métricas clave</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analíticas de Capacitación</h3>
        <p className="text-gray-600 mb-4">
          Obtén insights detallados sobre el rendimiento de tu equipo en capacitación de ciberseguridad.
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-left">
          <h4 className="font-medium text-indigo-900 mb-2">Métricas disponibles:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-indigo-800 mb-1">Progreso General</h5>
              <ul className="text-indigo-700 space-y-1">
                <li>• Empleados capacitados vs. total</li>
                <li>• Tasa de completación de cursos</li>
                <li>• Tiempo promedio de completación</li>
                <li>• Puntuaciones promedio por módulo</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-indigo-800 mb-1">Simulación de Phishing</h5>
              <ul className="text-indigo-700 space-y-1">
                <li>• Empleados que cayeron en phishing</li>
                <li>• Empleados que reportaron phishing</li>
                <li>• Tasa de mejora post-capacitación</li>
                <li>• Comparativa por departamento</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
            <h5 className="font-medium text-indigo-900 mb-1">Reportes exportables:</h5>
            <p className="text-indigo-700 text-sm">
              Genera reportes ejecutivos en PDF, CSV o Excel con métricas detalladas por empleado, 
              departamento y período de tiempo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};