import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RefreshCcw } from 'lucide-react';
import { DeclarationState } from './types';
import { getInitialDeclaration } from './constants';
import { Step1_Identification } from './components/Step1_Identification';
import { Step2_UsageType } from './components/Step2_UsageType';
import { Step3_Details } from './components/Step3_Details';
import { Step4_Output } from './components/Step4_Output';

const STEPS_LABELS = ['Identificación', 'Clasificación', 'Detalles', 'Resultado'];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<DeclarationState>(getInitialDeclaration());
  const [isClient, setIsClient] = useState(false);
  // formKey is used to force a full re-render of the step components when resetting
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Validation Logic
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Step 1: Just need a usage type selected
        return data.usageTypes.length > 0;
      case 1: // Step 2: Need at least one type, and if 'other' is selected, custom text needed
        if (data.usageTypes.length === 0) return false;
        if (data.usageTypes.includes('other') && data.customUsageType.length < 3) return false;
        return true;
      case 2: // Step 3
        return data.aiTool.name.length > 1 && data.specificPurpose.length > 5;
      default:
        return true;
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  
  const resetForm = () => {
      if (window.confirm('¿Estás seguro de que quieres empezar de nuevo? Se perderán los datos actuales.')) {
          // 1. Reset Data
          setData(getInitialDeclaration());
          // 2. Go to start
          setCurrentStep(0);
          // 3. Force UI rebuild
          setFormKey(prev => prev + 1); 
      }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    AI
                </div>
                <h1 className="font-bold text-lg tracking-tight text-slate-800">Declarador<span className="text-slate-400 font-light">.io</span></h1>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={resetForm}
                    className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    title="Empezar de nuevo"
                >
                    <RefreshCcw size={16} />
                    <span className="hidden sm:inline">Reiniciar</span>
                </button>
                <div className="text-xs font-medium text-slate-400 border border-slate-100 bg-slate-50 px-3 py-1 rounded-full hidden sm:block">
                    Beta v1.1
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col">
        
        {/* Stepper */}
        <nav aria-label="Progreso" className="mb-10">
            <div className="relative flex justify-between">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -mt-0.5 rounded-full" />
                <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -z-10 -mt-0.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                />
                
                {STEPS_LABELS.map((label, idx) => {
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;
                    
                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                                ${isActive ? 'bg-primary-600 text-white ring-4 ring-primary-100 scale-110 shadow-md' : ''}
                                ${isCompleted ? 'bg-primary-500 text-white' : ''}
                                ${!isActive && !isCompleted ? 'bg-slate-200 text-slate-500' : ''}
                            `}>
                                {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span className={`text-xs font-medium hidden sm:block transition-colors ${isActive ? 'text-primary-700' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </nav>

        {/* Dynamic Step Component - key={formKey} ensures full reset */}
        <div key={formKey} className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-20 md:mb-0">
            {currentStep === 0 && <Step1_Identification data={data} onChange={setData} />}
            {currentStep === 1 && <Step2_UsageType data={data} onChange={setData} />}
            {currentStep === 2 && <Step3_Details data={data} onChange={setData} />}
            {currentStep === 3 && <Step4_Output data={data} />}
        </div>

      </main>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            {currentStep > 0 ? (
                <button 
                    onClick={prevStep}
                    className="flex items-center gap-2 px-5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium text-sm"
                >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">Anterior</span>
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
                            flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm text-white shadow-lg shadow-primary-500/20 transition-all
                            ${canProceed() 
                                ? 'bg-primary-600 hover:bg-primary-700 hover:translate-y-[-1px]' 
                                : 'bg-slate-300 cursor-not-allowed shadow-none'
                            }
                        `}
                    >
                        Siguiente <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}