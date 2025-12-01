
import React from 'react';
import { DeclarationState, UsageTypeKey } from '../types';
import { USAGE_TYPES } from '../constants';
import { Check } from 'lucide-react';

interface Props {
  data: DeclarationState;
  onChange: (data: DeclarationState) => void;
}

export const Step2_UsageType: React.FC<Props> = ({ data, onChange }) => {
  const toggleUsageType = (typeValue: UsageTypeKey) => {
    const currentTypes = data.usageTypes;
    let newTypes: UsageTypeKey[];

    if (currentTypes.includes(typeValue)) {
      newTypes = currentTypes.filter(t => t !== typeValue);
    } else {
      newTypes = [...currentTypes, typeValue];
    }
    onChange({ ...data, usageTypes: newTypes });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-900">Categorización del Uso</h2>
        <p className="text-slate-500 mt-2">
            Confirma o añade categorías. Si tu trabajo es académico, sé preciso con la naturaleza de la contribución de la IA.
        </p>
      </div>

      <div className="grid gap-4">
        {USAGE_TYPES.map((type) => {
            const isSelected = data.usageTypes.includes(type.value);
            return (
                <div 
                    key={type.value}
                    onClick={() => toggleUsageType(type.value as UsageTypeKey)}
                    className={`
                        relative group cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                        ${isSelected 
                            ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500 shadow-sm z-10' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                        }
                    `}
                >
                    <div className="flex items-start gap-4">
                        <div className={`
                            flex-shrink-0 w-6 h-6 mt-1 rounded border-2 flex items-center justify-center transition-colors
                            ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 bg-white'}
                        `}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-semibold text-lg ${isSelected ? 'text-primary-900' : 'text-slate-800'}`}>
                                {type.label}
                            </h3>
                            <p className="text-slate-600 mt-1 mb-3 text-sm leading-relaxed">
                                {type.hint}
                            </p>
                            
                            {type.examples.length > 0 && (
                                <div className="bg-white/60 p-3 rounded-lg border border-slate-100/50">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ejemplos típicos:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {type.examples.map((ex, i) => (
                                            <li key={i} className="text-sm text-slate-600">{ex}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {type.value === 'other' && isSelected && (
                                <div className="mt-4 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Describa detalladamente el uso:
                                    </label>
                                    <textarea
                                        autoFocus
                                        rows={2}
                                        placeholder="Ej: La IA generó variantes de diseño experimental..."
                                        value={data.customUsageType}
                                        onChange={(e) => onChange({ ...data, customUsageType: e.target.value })}
                                        className="w-full p-2.5 text-sm border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none border resize-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};
