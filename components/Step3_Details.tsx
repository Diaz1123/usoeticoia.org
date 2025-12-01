
import React from 'react';
import { Trash2, Plus, Info } from 'lucide-react';
import { DeclarationState, HumanReviewLevel } from '../types';
import { CONTENT_USE_MODES, HUMAN_REVIEW_LEVELS } from '../constants';

interface Props {
  data: DeclarationState;
  onChange: (data: DeclarationState) => void;
}

export const Step3_Details: React.FC<Props> = ({ data, onChange }) => {
  const updateTool = (field: string, value: string) => onChange({ ...data, aiTool: { ...data.aiTool, [field]: value } });
  const updateDate = (field: 'month' | 'year', value: string) => onChange({ ...data, aiTool: { ...data.aiTool, date: { ...data.aiTool.date, [field]: parseInt(value) } } });
  
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  const addPrompt = () => onChange({ ...data, prompts: [...data.prompts, { id: generateId(), description: '' }] });
  const updatePrompt = (id: string, desc: string) => onChange({ ...data, prompts: data.prompts.map(p => p.id === id ? { ...p, description: desc } : p) });
  const removePrompt = (id: string) => onChange({ ...data, prompts: data.prompts.filter(p => p.id !== id) });
  
  const toggleMode = (mode: string) => {
    const modes = data.contentUseModes.includes(mode)
      ? data.contentUseModes.filter(m => m !== mode)
      : [...data.contentUseModes, mode];
    onChange({ ...data, contentUseModes: modes });
  };

  const setReviewLevel = (level: HumanReviewLevel) => {
      onChange({ ...data, humanReview: { ...data.humanReview, level } });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Detalles de Transparencia</h2>
        <p className="text-slate-500 mt-2">Profundiza en la metodología de uso y verificación.</p>
      </div>

      {/* 1. Tool & Purpose */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200">1</span>
                Herramienta
            </h3>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <input 
                        className="form-input block w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Nombre (ej. ChatGPT)"
                        value={data.aiTool.name}
                        onChange={(e) => updateTool('name', e.target.value)}
                    />
                    <input 
                        className="form-input block w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Versión (ej. GPT-4o)"
                        value={data.aiTool.version}
                        onChange={(e) => updateTool('version', e.target.value)}
                    />
                </div>
                <input 
                    className="form-input block w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Proveedor (ej. OpenAI, Google, Anthropic)"
                    value={data.aiTool.provider}
                    onChange={(e) => updateTool('provider', e.target.value)}
                />
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 w-24">Fecha consulta:</span>
                    <select 
                        className="form-select flex-1 rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                        value={data.aiTool.date.month}
                        onChange={(e) => updateDate('month', e.target.value)}
                    >
                        {Array.from({length: 12}, (_, i) => (
                            <option key={i} value={i+1}>{new Date(0, i).toLocaleString('es', {month: 'long'})}</option>
                        ))}
                    </select>
                    <select 
                        className="form-select w-24 rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                        value={data.aiTool.date.year}
                        onChange={(e) => updateDate('year', e.target.value)}
                    >
                        {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200">2</span>
                Propósito Académico
            </h3>
            <div className="relative">
                <textarea 
                    className="form-textarea w-full rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500 min-h-[160px] resize-none"
                    placeholder="Describe la tarea específica. Ej: 'Generar ideas para la discusión de resultados' o 'Traducir el resumen al inglés'..."
                    maxLength={600}
                    value={data.specificPurpose}
                    onChange={(e) => onChange({...data, specificPurpose: e.target.value})}
                />
                <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white px-1">
                    {data.specificPurpose.length}/600
                </div>
            </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 2. Prompts */}
      <div className="space-y-4">
         <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200">3</span>
            Prompts (Instrucciones)
            <span className="ml-auto text-xs normal-case font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-100">
                <Info size={12} /> No incluir datos privados
            </span>
        </h3>
        <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
            {data.prompts.map((p, idx) => (
                <div key={p.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2">
                    <span className="mt-2.5 text-xs text-slate-400 font-mono select-none w-4 text-right">{idx + 1}.</span>
                    <input 
                        className="form-input flex-1 rounded-lg border-slate-300 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Copia aquí la instrucción principal dada a la IA..."
                        value={p.description}
                        onChange={(e) => updatePrompt(p.id, e.target.value)}
                    />
                    {data.prompts.length > 1 && (
                        <button 
                            onClick={() => removePrompt(p.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Eliminar prompt"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            ))}
            <button 
                onClick={addPrompt}
                className="ml-6 text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 py-1"
            >
                <Plus size={16} /> Añadir prompt
            </button>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 3. Integration & Content Use */}
      <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200">4</span>
            Integración del Contenido
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <p className="text-sm text-slate-500 mb-2">¿Cómo se incorporó el resultado de la IA en el trabajo final?</p>
                {CONTENT_USE_MODES.map(mode => (
                    <div key={mode}>
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <input 
                                type="checkbox" 
                                className="form-checkbox text-primary-600 rounded border-slate-300 focus:ring-primary-500 h-4 w-4"
                                checked={data.contentUseModes.includes(mode)}
                                onChange={() => toggleMode(mode)}
                            />
                            <span className="text-sm text-slate-700">{mode}</span>
                        </label>
                        {/* Custom input for "Otro" mode */}
                        {mode === 'Otro' && data.contentUseModes.includes('Otro') && (
                             <input 
                                className="ml-9 mt-1 form-input block w-[90%] rounded-lg border-slate-300 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Especifique cómo..."
                                autoFocus
                                value={data.customContentUseMode}
                                onChange={(e) => onChange({...data, customContentUseMode: e.target.value})}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div>
                 <p className="text-sm text-slate-500 mb-2">Contexto adicional (Opcional)</p>
                 <textarea 
                    className="form-textarea w-full rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500 min-h-[120px] resize-none"
                    placeholder="Ej: 'El texto generado fue usado solo en la sección 2.3, el resto es autoría humana...'"
                    value={data.contentUseContext}
                    onChange={(e) => onChange({...data, contentUseContext: e.target.value})}
                />
            </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 4. Human Review Levels */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200">5</span>
            Nivel de Revisión Humana e Intervención
        </h3>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
            {HUMAN_REVIEW_LEVELS.map((levelOption) => {
                const isSelected = data.humanReview.level === levelOption.level;
                return (
                    <div 
                        key={levelOption.level}
                        onClick={() => setReviewLevel(levelOption.level)}
                        className={`
                            p-4 border-b last:border-0 border-slate-200 cursor-pointer transition-colors
                            ${isSelected ? 'bg-primary-50/60' : 'hover:bg-white'}
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`
                                mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${isSelected ? 'border-primary-600' : 'border-slate-300'}
                            `}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
                            </div>
                            <div>
                                <span className={`text-sm font-bold block ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>
                                    {levelOption.label}
                                </span>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {levelOption.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {data.humanReview.level > 0 && (
             <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Rol del revisor responsable:</label>
                <input 
                    className="form-input block w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Ej. Autor Principal, Editor, Comité de Ética..."
                    value={data.humanReview.reviewerRole}
                    onChange={(e) => onChange({ ...data, humanReview: { ...data.humanReview, reviewerRole: e.target.value } })}
                />
            </div>
        )}
      </div>
    </div>
  );
};
