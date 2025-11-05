import React from 'react';
import { TrendingUp } from 'lucide-react';

export const ReportsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Analíticas</h1>
          <p className="text-gray-600">Insights avanzados y exportación de datos del sistema</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar PDF
          </button>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard Ejecutivo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-8 text-center">
        <div className="text-primary-600 flex justify-center mb-4">
          <TrendingUp className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analíticas Globales y Reportes</h3>
        <p className="text-gray-600 mb-4">
          Insights detallados sobre el rendimiento de la plataforma y métricas clave del negocio.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left">
          <h4 className="font-medium text-orange-900 mb-2">Funcionalidades planificadas:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Dashboard ejecutivo con KPIs principales</li>
            <li>• Reportes de ingresos y conversión</li>
            <li>• Analíticas de uso por cliente e industria</li>
            <li>• Métricas de efectividad de capacitación</li>
            <li>• Exportación automática (PDF/CSV/Excel)</li>
            <li>• Comparativas temporales y benchmarking</li>
            <li>• Alertas de rendimiento del sistema</li>
          </ul>
        </div>
      </div>
    </div>
  );
};