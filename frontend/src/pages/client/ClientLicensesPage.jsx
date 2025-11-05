import React from 'react';
import { Ticket } from 'lucide-react';

export const ClientLicensesPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Licencias</h1>
          <p className="text-gray-600">Gestiona tus créditos y compra nuevos paquetes</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Comprar Créditos
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-8 text-center">
        <div className="text-primary-600 flex justify-center mb-4">
          <Ticket className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema de Créditos por Empleado</h3>
        <p className="text-gray-600 mb-4">
          Compra créditos para capacitar a tu equipo. Cada crédito incluye curso completo de ciberseguridad.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
          <h4 className="font-medium text-green-900 mb-2">Paquetes disponibles:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800">Paquete Básico</h5>
              <p className="text-2xl font-bold text-green-600">50 créditos</p>
              <p className="text-green-700">$299 USD / Bs. 11,000 VES</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-400">
              <h5 className="font-semibold text-green-800">Paquete Pro (Recomendado)</h5>
              <p className="text-2xl font-bold text-green-600">100 créditos</p>
              <p className="text-green-700">$549 USD / Bs. 20,000 VES</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800">Paquete Enterprise</h5>
              <p className="text-2xl font-bold text-green-600">250 créditos</p>
              <p className="text-green-700">$1,299 USD / Bs. 48,000 VES</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <h5 className="font-medium text-green-900 mb-1">Métodos de pago:</h5>
            <ul className="text-green-700 text-sm">
              <li>• PayPal (procesamiento automático)</li>
              <li>• Pago Móvil Venezuela (verificación manual)</li>
              <li>• Transferencia Bancaria (verificación manual)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};