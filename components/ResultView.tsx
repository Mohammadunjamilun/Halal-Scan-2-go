import React from 'react';
import { AnalysisResult, IngredientStatus, Language } from '../types';
import { TRANSLATIONS, ICONS } from '../constants';

interface Props {
  result: AnalysisResult;
  language: Language;
  onReset: () => void;
}

const ResultView: React.FC<Props> = ({ result, language, onReset }) => {
  const t = TRANSLATIONS[language];

  const getStatusColor = (status: IngredientStatus) => {
    switch (status) {
      case IngredientStatus.HALAL: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case IngredientStatus.HARAM: return 'text-red-600 bg-red-50 border-red-200';
      case IngredientStatus.MUSHBOOH: return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: IngredientStatus) => {
    switch (status) {
      case IngredientStatus.HALAL: return <ICONS.CheckCircle className="w-5 h-5 text-emerald-600" />;
      case IngredientStatus.HARAM: return <ICONS.XCircle className="w-5 h-5 text-red-600" />;
      case IngredientStatus.MUSHBOOH: return <ICONS.HelpCircle className="w-5 h-5 text-amber-600" />;
      default: return <ICONS.HelpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const overallStatusColor = 
    result.overallStatus === IngredientStatus.HALAL ? 'bg-emerald-100 text-emerald-800' :
    result.overallStatus === IngredientStatus.HARAM ? 'bg-red-100 text-red-800' :
    'bg-amber-100 text-amber-800';

  const overallMessage = 
    result.overallStatus === IngredientStatus.HALAL ? t.overallSafe :
    result.overallStatus === IngredientStatus.HARAM ? t.overallUnsafe :
    t.overallDoubt;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in">
      <button 
        onClick={onReset}
        className="mb-4 flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
      >
        <ICONS.ChevronLeft className={`w-5 h-5 ${language === Language.ARABIC ? 'rotate-180' : ''}`} />
        <span className="mx-1">{t.backButton}</span>
      </button>

      {/* Summary Card */}
      <div className={`p-6 rounded-2xl mb-6 text-center ${overallStatusColor} shadow-sm border border-opacity-20`}>
        <div className="flex justify-center mb-3">
          {result.overallStatus === IngredientStatus.HALAL && <ICONS.CheckCircle className="w-16 h-16" />}
          {result.overallStatus === IngredientStatus.HARAM && <ICONS.XCircle className="w-16 h-16" />}
          {(result.overallStatus === IngredientStatus.MUSHBOOH || result.overallStatus === IngredientStatus.UNKNOWN) && <ICONS.HelpCircle className="w-16 h-16" />}
        </div>
        <h2 className="text-2xl font-bold mb-2">{overallMessage}</h2>
        <p className="text-sm opacity-90 max-w-md mx-auto">{result.summary}</p>
      </div>

      {/* Ingredients List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 flex justify-between">
            <span>{t.ingredientName}</span>
            <span>{t.ingredientStatus}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {result.ingredients.map((ing, idx) => (
            <div key={idx} className="p-4 flex items-start justify-between hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{ing.name}</div>
                {ing.reason && (
                  <div className="text-xs text-gray-500 mt-1">{ing.reason}</div>
                )}
              </div>
              <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ing.status)}`}>
                 {getStatusIcon(ing.status)}
                 <span>
                    {ing.status === IngredientStatus.HALAL ? t.statusHalal :
                     ing.status === IngredientStatus.HARAM ? t.statusHaram :
                     ing.status === IngredientStatus.MUSHBOOH ? t.statusMushbooh :
                     t.statusUnknown}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
