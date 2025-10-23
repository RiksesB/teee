import React from 'react';
import { useTranslation } from '../../utils/i18n.jsx';

export const LanguageSelector = ({ className = '' }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={`relative ${className}`}>
      {/* Switch Frame - Como una placa de interruptor real */}
      <div className="relative bg-gray-50 rounded-lg p-2 shadow-sm border border-gray-100 w-20 h-12">
        {/* Área empotrada del switch */}
        <div className="relative bg-gray-25 rounded-md w-full h-full shadow-inner border border-gray-75 flex">
          
          {/* Botón ES */}
          <button
            onClick={() => setLanguage('es')}
            className={`relative w-1/2 h-full text-xs font-bold transition-all duration-300 ease-out rounded-sm mr-0.5 ${
              language === 'es'
                ? 'text-white'
                : 'text-gray-600'
            }`}
            style={{
              transform: language === 'es' ? 'translateY(2px)' : 'translateY(-1px)',
              background: language === 'es' 
                ? 'linear-gradient(145deg, #1890ff 0%, #096dd9 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: language === 'es'
                ? 'inset 2px 2px 4px rgba(0,0,0,0.2), inset -1px -1px 2px rgba(255,255,255,0.1)'
                : '1px 1px 3px rgba(0,0,0,0.15), inset -1px -1px 2px rgba(0,0,0,0.05)'
            }}
            aria-label="Cambiar a Español"
          >
            ES
          </button>
          
          {/* Botón EN */}
          <button
            onClick={() => setLanguage('en')}
            className={`relative w-1/2 h-full text-xs font-bold transition-all duration-300 ease-out rounded-sm ml-0.5 ${
              language === 'en'
                ? 'text-white'
                : 'text-gray-600'
            }`}
            style={{
              transform: language === 'en' ? 'translateY(2px)' : 'translateY(-1px)',
              background: language === 'en' 
                ? 'linear-gradient(145deg, #1890ff 0%, #096dd9 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: language === 'en'
                ? 'inset 2px 2px 4px rgba(0,0,0,0.2), inset -1px -1px 2px rgba(255,255,255,0.1)'
                : '1px 1px 3px rgba(0,0,0,0.15), inset -1px -1px 2px rgba(0,0,0,0.05)'
            }}
            aria-label="Switch to English"
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
};
