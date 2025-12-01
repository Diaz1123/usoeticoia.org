
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, FilePlus, HelpCircle, BookOpen, X } from 'lucide-react';
import { DeclarationState, Preset } from './types';
import { getInitialDeclaration, PRESETS, GLOSSARY_TERMS } from './constants';
import { Step1_Identification } from './components/Step1_Identification';
import { Step2_UsageType } from './components/Step2_UsageType';
import { Step3_Details } from './components/Step3_Details';
import { Step4_Output } from './components/Step4_Output';

const STEPS_LABELS = ['Diagnóstico', 'Clasificación', 'Detalles', 'Resultado'];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<DeclarationState>(getInitialDeclaration());
  const [isClient, setIsClient] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.usageTypes.length > 0;
      case 1:
        if (data.usageTypes.length === 0) return false;
        if (data.usageTypes.includes('other') && data.customUsageType.length < 3) return false;
        return true;
      case 2:
        return data.aiTool.name.length > 1 && data.specificPurpose.length > 5;
      default:
        return true;
    }
  };

  const nextStep = () => {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
  };

  const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 0));
      window.scrollTo(0, 0);
  };
  
  const handleNewDeclaration = () => {
      if (currentStep < 3 && !window.confirm('¿Deseas borrar todo y comenzar una nueva declaración?')) {
          return;
      }
      setData(getInitialDeclaration());
      setCurrentStep(0);
      setFormKey(prev => prev + 1);
      window.scrollTo(0, 0);
  };

  const loadPreset = (preset: Preset) => {
      if (currentStep > 0 && !window.confirm('Cargar una plantilla sobrescribirá los datos actuales. ¿Continuar?')) {
          return;
      }
      const newData = { ...getInitialDeclaration(), ...preset.data };
      // Preserve ID to be unique
      newData.declarationId = getInitialDeclaration().declarationId;
      
      setData(newData as DeclarationState);
      setCurrentStep(2); // Jump to details to verify
      setFormKey(prev => prev + 1);
      setShowPresets(false);
      window.scrollTo(0, 0);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans text-slate-900 selection:bg-primary-100">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                    AI
                </div>
                <div>
                    <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none">Declarador<span className="text-primary-600">.io</span></h1>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Transparencia Académica</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
                 {/* Preset Loader */}
                <div className="relative">
                    <button 
                        onClick={() => setShowPresets(!showPresets)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                    >
                        <BookOpen size={18} />
                        <span className="hidden sm:inline">Plantillas</span>
                    </button>
                    
                    {showPresets && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                            <div className="p-3 bg-slate-50 border-b border-slate-100">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cargar Caso de Uso</h4>
                            </div>
                            {PRESETS.map(preset => (
                                <button 
                                    key={preset.id}
                                    onClick={() => loadPreset(preset)}
                                    className="w-full text-left p-3 hover:bg-primary-50 transition-colors border-b border-slate-100 last:border-0"
                                >
                                    <div className="font-semibold text-slate-800 text-sm">{preset.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{preset.description}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => setShowHelp(true)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-colors text-sm font-medium"
                >
                    <HelpCircle size={18} />
                    <span className="hidden sm:inline">Ayuda</span>
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

                <button 
                    onClick={handleNewDeclaration}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm hover:shadow-md text-sm font-medium"
                >
                    <FilePlus size={16} />
                    <span className="hidden sm:inline">Nueva</span>
                </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-10 flex flex-col">
        
        {/* Stepper */}
        <nav aria-label="Progreso" className="mb-12 px-2">
            <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -mt-0.5 rounded-full" />
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 -mt-0.5 rounded-full transition-all duration-700 ease-in-out" 
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                />
                
                {STEPS_LABELS.map((label, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    
                    return (
                        <div key={idx} className="flex flex-col items-center gap-3 bg-[#F9FAFB] px-2 md:px-4 cursor-default">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
                                ${isActive ? 'bg-primary-600 text-white border-primary-600 scale-110 shadow-lg shadow-primary-500/30' : ''}
                                ${isCompleted ? 'bg-white text-primary-600 border-primary-600' : ''}
                                ${!isActive && !isCompleted ? 'bg-white text-slate-300 border-slate-200' : ''}
                            `}>
                                {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </nav>

        {/* Dynamic Step Component */}
        <div key={formKey} className="flex-1 bg-white rounded-2xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12 mb-24 md:mb-0">
            {currentStep === 0 && <Step1_Identification data={data} onChange={setData} />}
            {currentStep === 1 && <Step2_UsageType data={data} onChange={setData} />}
            {currentStep === 2 && <Step3_Details data={data} onChange={setData} />}
            {currentStep === 3 && <Step4_Output data={data} onReset={handleNewDeclaration} />}
        </div>

      </main>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            {currentStep > 0 ? (
                <button 
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors font-semibold text-sm"
                >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Paso Anterior</span>
                </button>
            ) : (
                <div /> /* Spacer */
            )}

            <div className="flex gap-3">
                {currentStep < 3 && (
                    <button 
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className={`
                            flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white shadow-xl transition-all transform hover:-translate-y-0.5
                            ${canProceed() 
                                ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/25' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }
                        `}
                    >
                        Siguiente <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen size={20} className="text-primary-600" />
                        Glosario para No Expertos
                    </h3>
                    <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {GLOSSARY_TERMS.map((term, idx) => (
                        <div key={idx} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{term.term}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{term.definition}</p>
                        </div>
                    ))}
                    <div className="p-4 bg-primary-50 rounded-xl text-xs text-primary-800 mt-4 leading-relaxed">
                        <strong>Tip Ético:</strong> La transparencia no juzga el uso de la IA, solo lo hace visible. Un uso honesto y declarado siempre es mejor académicamente que un uso oculto.
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 text-center">
                    <button onClick={() => setShowHelp(false)} className="text-sm font-medium text-primary-600 hover:text-primary-800">
                        Cerrar Glosario
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
