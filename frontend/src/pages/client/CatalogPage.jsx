import React from 'react';

export const CatalogPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Catálogo de Cursos</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Explora nuestros cursos de ciberseguridad disponibles</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base">
            <option>Todos los niveles</option>
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4 sm:p-6 lg:p-8 text-center">
        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📚</div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Cursos Interactivos por WhatsApp</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Descubre nuestro catálogo de cursos diseñados para capacitar a tu equipo en ciberseguridad.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-left">
          <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Los cursos incluyen:</h4>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>• Módulos cortos optimizados para WhatsApp</li>
            <li>• Videos educativos y contenido multimedia</li>
            <li>• Cuestionarios interactivos con feedback</li>
            <li>• Certificación al completar el curso</li>
            <li>• Simulación de phishing con Gophish</li>
            <li>• Soporte en Español e Inglés</li>
          </ul>
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-800 text-xs sm:text-sm font-medium">
              <strong>Precio:</strong> $5.99 USD / Bs. 220 VES por empleado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};