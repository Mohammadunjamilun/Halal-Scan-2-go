import React, { useState, useEffect } from 'react';
import { ICONS, TRANSLATIONS } from './constants';
import { AppState, Language, AnalysisResult } from './types';
import LanguageSelector from './components/LanguageSelector';
import CameraCapture from './components/CameraCapture';
import ResultView from './components/ResultView';
import { analyzeImage } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [language, setLanguage] = useState<Language>(Language.ARABIC);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const t = TRANSLATIONS[language];

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === Language.ARABIC ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        processImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image: string) => {
    setAppState('analyzing');
    try {
      const result = await analyzeImage(base64Image, language);
      setAnalysisResult(result);
      setAppState('results');
    } catch (error) {
      console.error(error);
      setAppState('error');
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'idle':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-8 animate-fade-in">
            <div className="bg-emerald-100 p-6 rounded-full shadow-inner mb-4">
              <ICONS.ScanLine className="w-16 h-16 text-emerald-600" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              {t.appTitle}
            </h1>
            
            <div className="flex flex-col w-full max-w-xs space-y-4">
              <button
                onClick={() => setAppState('camera')}
                className="group relative flex items-center justify-center w-full px-6 py-4 text-lg font-bold text-white bg-emerald-600 rounded-2xl shadow-lg hover:bg-emerald-700 hover:shadow-emerald-500/30 transition-all active:scale-95"
              >
                <ICONS.Camera className="w-6 h-6 mx-2" />
                {t.scanButton}
              </button>
              
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageInput}
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-6 py-4 text-lg font-semibold text-emerald-800 bg-white border-2 border-emerald-100 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors active:scale-95"
                >
                  <ICONS.Upload className="w-6 h-6 mx-2" />
                  {t.uploadButton}
                </label>
              </div>
            </div>
          </div>
        );

      case 'camera':
        return (
          <CameraCapture 
            onCapture={processImage} 
            onClose={() => setAppState('idle')}
            language={language}
          />
        );

      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-pulse">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              <ICONS.ScanLine className="absolute inset-0 m-auto w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.analyzing}</h2>
            <p className="text-gray-500">{t.analyzingSub}</p>
          </div>
        );

      case 'results':
        return analysisResult ? (
          <ResultView 
            result={analysisResult} 
            language={language}
            onReset={() => setAppState('idle')}
          />
        ) : null;

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <ICONS.XCircle className="w-20 h-20 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.errorTitle}</h2>
            <p className="text-gray-500 mb-8">{t.errorMessage}</p>
            <button
              onClick={() => setAppState('idle')}
              className="flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <ICONS.RotateCcw className="w-5 h-5 mx-2" />
              {t.retry}
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen font-sans ${language === Language.ARABIC ? 'font-arabic' : ''}`}>
      {/* Header */}
      {appState !== 'camera' && (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer"
              onClick={() => setAppState('idle')}
            >
              <div className="bg-emerald-600 rounded-lg p-1.5">
                <ICONS.CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">HalalScanner</span>
            </div>
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
