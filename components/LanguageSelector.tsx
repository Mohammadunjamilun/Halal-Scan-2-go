import React from 'react';
import { Language } from '../types';

interface Props {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex space-x-2 rtl:space-x-reverse">
      <button
        onClick={() => onLanguageChange(Language.ARABIC)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          currentLanguage === Language.ARABIC
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
        }`}
      >
        العربية
      </button>
      <button
        onClick={() => onLanguageChange(Language.ENGLISH)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          currentLanguage === Language.ENGLISH
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
        }`}
      >
        English
      </button>
      <button
        onClick={() => onLanguageChange(Language.GERMAN)}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          currentLanguage === Language.GERMAN
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
        }`}
      >
        Deutsch
      </button>
    </div>
  );
};

export default LanguageSelector;
