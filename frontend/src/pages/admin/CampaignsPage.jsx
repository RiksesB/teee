import React from 'react';

export const CampaignsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Campañas</h1>
          <p className="text-gray-600">Supervisa todas las campañas de capacitación de clientes</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Ver Métricas
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-8 text-center">
        <div className="text-6xl mb-4">📢</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Supervisión de Campañas Globales</h3>
        <p className="text-gray-600 mb-4">
          Vista consolidada de todas las campañas de capacitación de tus clientes.
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
          <h4 className="font-medium text-purple-900 mb-2">Funcionalidades planificadas:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Vista global de campañas por cliente</li>
            <li>• Métricas de participación y completación</li>
            <li>• Monitoreo en tiempo real de WhatsApp</li>
            <li>• Estadísticas de efectividad por industria</li>
            <li>• Alertas de campañas con problemas</li>
            <li>• Integración con simulaciones de phishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};