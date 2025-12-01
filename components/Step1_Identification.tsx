import React, { useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { DeclarationState, ChecklistItem } from '../types';
import { HELP_CHECKLIST, USAGE_TYPES } from '../constants';

interface Props {
  data: DeclarationState;
  onChange: (data: DeclarationState) => void;
}

export const Step1_Identification: React.FC<Props> = ({ data, onChange }) => {
  // Lazily initialize state based on existing selection if revisiting
  const [activeChecks, setActiveChecks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (data.usageTypes.length > 0) {
        // Pre-check items that match any selected usage type
        HELP_CHECKLIST.forEach(item => {
            if (data.usageTypes.includes(item.suggests)) {
                initial[item.id] = true;
            }
        });
    }
    return initial;
  });

  const handleChecklist = (item: ChecklistItem) => {
    const newChecks = { ...activeChecks, [item.id]: !activeChecks[item.id] };
    setActiveChecks(newChecks);
    
    // Logic: Find all checked items
    const checkedItems = HELP_CHECKLIST.filter(i => newChecks[i.id]);
    
    if (checkedItems.length === 0) {
      onChange({ ...data, usageTypes: [] });
      return;
    }

    // Logic: Sort by priority (descending) to find the "Dominant" usage
    const sortedItems = [...checkedItems].sort((a, b) => b.priority - a.priority);
    const dominantItem = sortedItems[0];

    // Reset usageTypes to just the dominant one initially for better guidance
    // (User can add more in Step 2)
    onChange({ ...data, usageTypes: [dominantItem.suggests] });
  };

  const primaryType = data.usageTypes[0];
  const currentUsageLabel = primaryType ? USAGE_TYPES.find(u => u.value === primaryType)?.label : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-900">Diagnóstico de Uso</h2>
        <p className="text-slate-500 mt-2">
          Selecciona todas las situaciones que apliquen a tu caso. 
          El sistema sugerirá la categoría principal, pero podrás seleccionar múltiples en el siguiente paso.
        </p>
      </div>

      <div className="space-y-3">
        {HELP_CHECKLIST.map((item) => {
          const isChecked = !!activeChecks[item.id];
          return (
            <label 
              key={item.id} 
              className={`
                flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200
                ${isChecked 
                  ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500 shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors
                ${isChecked ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-300 bg-white'}
              `}>
                {isChecked && <CheckCircle2 size={16} />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isChecked} 
                onChange={() => handleChecklist(item)} 
              />
              <span className={`text-sm md:text-base font-medium ${isChecked ? 'text-primary-900' : 'text-slate-700'}`}>
                {item.q}
              </span>
            </label>
          );
        })}
      </div>

      {/* Dynamic Feedback Area */}
      {currentUsageLabel && (
        <div className="mt-6 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white shadow-lg animate-in zoom-in-95 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div className="flex-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Uso Principal Detectado
                </span>
                <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-xl font-bold text-white">
                        {currentUsageLabel}
                    </h3>
                </div>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                   Basado en tus respuestas, este es el nivel de intervención más significativo. 
                   Haz clic en "Siguiente" para confirmar o añadir otros tipos de uso.
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};