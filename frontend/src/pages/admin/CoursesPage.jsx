import React from 'react';

export const CoursesPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Administra el contenido educativo y módulos interactivos</p>
        </div>
        <button className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden sm:inline">Nuevo Curso</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4 sm:p-6 lg:p-8 text-center">
        <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">📚</div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Gestión de Cursos</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Aquí podrás administrar todos los cursos de ciberseguridad que se envían por WhatsApp.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-left">
          <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Funcionalidades planificadas:</h4>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>• CRUD de cursos con módulos educativos</li>
            <li>• Editor de contenido multiidioma (ES/EN)</li>
            <li>• Gestión de videos y materiales multimedia</li>
            <li>• Creación de cuestionarios interactivos</li>
            <li>• Configuración de niveles (básico, intermedio, avanzado)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};