import React from 'react';
import { Ticket } from 'lucide-react';

export const LicensesPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Licencias</h1>
          <p className="text-gray-600">Controla créditos, paquetes y transacciones de clientes</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Asignar Créditos
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-8 text-center">
        <div className="text-primary-600 flex justify-center mb-4">
          <Ticket className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Control de Licencias y Créditos</h3>
        <p className="text-gray-600 mb-4">
          Gestiona los créditos de capacitación por cliente y supervisa las transacciones.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
          <h4 className="font-medium text-green-900 mb-2">Funcionalidades planificadas:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Control de créditos disponibles por cliente</li>
            <li>• Histórico de compras y uso de licencias</li>
            <li>• Gestión de paquetes (50, 100, 250 personas)</li>
            <li>• Aprobación de pagos manuales</li>
            <li>• Reportes de consumo y facturación</li>
            <li>• Integración con sistema de pagos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};