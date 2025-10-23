import React from 'react';

export const ClientCampaignsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Campañas</h1>
          <p className="text-gray-600">Crea y gestiona campañas de capacitación para tu equipo</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nueva Campaña
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-8 text-center">
        <div className="text-6xl mb-4">📢</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Campañas de Capacitación WhatsApp</h3>
        <p className="text-gray-600 mb-4">
          Crea campañas personalizadas para capacitar a tus empleados en ciberseguridad.
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
          <h4 className="font-medium text-purple-900 mb-2">Proceso de creación de campaña:</h4>
          <ul className="text-sm text-purple-700 space-y-1 mb-4">
            <li>• <strong>Paso 1:</strong> Seleccionar curso del catálogo</li>
            <li>• <strong>Paso 2:</strong> Cargar lista de empleados (CSV o manual)</li>
            <li>• <strong>Paso 3:</strong> Configurar fechas de inicio y fin</li>
            <li>• <strong>Paso 4:</strong> Revisar y confirmar campaña</li>
            <li>• <strong>Paso 5:</strong> Sistema envía cursos por WhatsApp</li>
            <li>• <strong>Paso 6:</strong> Monitorear progreso en tiempo real</li>
          </ul>
          <div className="bg-purple-100 p-3 rounded-lg">
            <h5 className="font-medium text-purple-900 mb-1">Incluye automáticamente:</h5>
            <ul className="text-purple-700 text-sm">
              <li>• Módulos educativos interactivos</li>
              <li>• Cuestionarios de evaluación</li>
              <li>• Simulación de phishing con Gophish</li>
              <li>• Reportes de completación y resultados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};