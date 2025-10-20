import React from 'react';
import { useTranslation } from '../../utils/i18n.jsx';

export const LanguageSelector = ({ className = '' }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          language === 'es'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-150'
        }`}
        aria-label="Cambiar a Español"
      >
        🇪🇸 ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-150'
        }`}
        aria-label="Switch to English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
};
