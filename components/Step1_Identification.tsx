
import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DeclarationState, ChecklistItem } from '../types';
import { HELP_CHECKLIST } from '../constants';

interface Props {
  data: DeclarationState;
  onChange: (data: DeclarationState) => void;
}

export const Step1_Identification: React.FC<Props> = ({ data, onChange }) => {
  const [activeChecks, setActiveChecks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (data.selectedChecklistIds.length > 0) {
        data.selectedChecklistIds.forEach(id => initial[id] = true);
    }
    return initial;
  });

  const handleChecklist = (item: ChecklistItem) => {
    const newChecks = { ...activeChecks, [item.id]: !activeChecks[item.id] };
    setActiveChecks(newChecks);
    
    // Get all selected IDs
    const checkedIds = Object.keys(newChecks).filter(id => newChecks[id]);
    const checkedItems = HELP_CHECKLIST.filter(i => checkedIds.includes(i.id));
    
    if (checkedItems.length === 0) {
      onChange({ ...data, selectedChecklistIds: [], usageTypes: [] });
      return;
    }

    // Sort by priority to determine the MAIN usage type for Step 2
    const sortedItems = [...checkedItems].sort((a, b) => b.priority - a.priority);
    const dominantItem = sortedItems[0];
    
    onChange({ 
        ...data, 
        selectedChecklistIds: checkedIds,
        usageTypes: [dominantItem.suggests] // We seed Step 2 with the most significant one
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-900">Diagnóstico de Uso Académico</h2>
        <p className="text-slate-500 mt-2">
          Selecciona todas las acciones que realizaste con la IA durante tu investigación o redacción.
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
    </div>
  );
};
