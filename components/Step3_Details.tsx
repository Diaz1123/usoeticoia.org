import React from 'react';
import { Trash2, Plus, Info } from 'lucide-react';
import { DeclarationState } from '../types';
import { CONTENT_USE_MODES } from '../constants';

interface Props {
  data: DeclarationState;
  onChange: (data: DeclarationState) => void;
}

export const Step3_Details: React.FC<Props> = ({ data, onChange }) => {
  // Field updaters
  const updateTool = (field: string, value: string) => onChange({ ...data, aiTool: { ...data.aiTool, [field]: value } });
  const updateDate = (field: 'month' | 'year', value: string) => onChange({ ...data, aiTool: { ...data.aiTool, date: { ...data.aiTool.date, [field]: parseInt(value) } } });
  
  // Prompt logic
  // Replaced crypto.randomUUID() for broader compatibility
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  const addPrompt = () => onChange({ ...data, prompts: [...data.prompts, { id: generateId(), description: '' }] });
  const updatePrompt = (id: string, desc: string) => onChange({ ...data, prompts: data.prompts.map(p => p.id === id ? { ...p, description: desc } : p) });
  const removePrompt = (id: string) => onChange({ ...data, prompts: data.prompts.filter(p => p.id !== id) });
  
  // Content Mode Logic
  const toggleMode = (mode: string) => {
    const modes = data.contentUseModes.includes(mode)
      ? data.contentUseModes.filter(m => m !== mode)
      : [...data.contentUseModes, mode];
    onChange({ ...data, contentUseModes: modes });
  };

  // Human Review Logic
  const updateReview = (field: string, value: any) => onChange({ ...data, humanReview: { ...data.humanReview, [field]: value } });
  const toggleReviewType = (key: keyof typeof data.humanReview.types) => {
    onChange({
        ...data, 
        humanReview: { 
            ...data.humanReview, 
            types: { ...data.humanReview.types, [key]: !data.humanReview.types[key] } 
        }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Detalles de Transparencia</h2>
        <p className="text-slate-500 mt-2">Especifica qué herramientas usaste y cómo.</p>
      </div>

      {/* Section 1: Tool & Purpose */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>
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
                        placeholder="Modelo (ej. GPT-4o)"
                        value={data.aiTool.version}
                        onChange={(e) => updateTool('version', e.target.value)}
                    />
                </div>
                <input 
                    className="form-input block w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Proveedor (ej. OpenAI, Google)"
                    value={data.aiTool.provider}
                    onChange={(e) => updateTool('provider', e.target.value)}
                />
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 w-24">Fecha de uso:</span>
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
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">2</span>
                Propósito
            </h3>
            <div className="relative">
                <textarea 
                    className="form-textarea w-full rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500 min-h-[160px] resize-none"
                    placeholder="Describe brevemente para qué tarea específica utilizaste la IA..."
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

      {/* Section 2: Prompts */}
      <div className="space-y-4">
         <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">3</span>
            Prompts Utilizados
            <span className="ml-auto text-xs normal-case font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Info size={12} /> Sin información confidencial
            </span>
        </h3>
        <div className="bg-slate-50 p-4 rounded-xl space-y-3">
            {data.prompts.map((p, idx) => (
                <div key={p.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2">
                    <span className="mt-2.5 text-xs text-slate-400 font-mono select-none w-4 text-right">{idx + 1}.</span>
                    <input 
                        className="form-input flex-1 rounded-lg border-slate-300 py-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Descripción del prompt..."
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
                <Plus size={16} /> Añadir otro prompt
            </button>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Section 3: Integration & Review */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
             <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">4</span>
                Uso del Contenido
            </h3>
            <div className="space-y-2">
                {CONTENT_USE_MODES.map(mode => (
                    <label key={mode} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                        <input 
                            type="checkbox" 
                            className="form-checkbox text-primary-600 rounded border-slate-300 focus:ring-primary-500 h-4 w-4"
                            checked={data.contentUseModes.includes(mode)}
                            onChange={() => toggleMode(mode)}
                        />
                        <span className="text-sm text-slate-700">{mode}</span>
                    </label>
                ))}
            </div>
            <input 
                className="form-input block w-full rounded-lg border-slate-300 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 mt-2"
                placeholder="Contexto adicional (opcional)"
                value={data.contentUseContext}
                onChange={(e) => onChange({...data, contentUseContext: e.target.value})}
            />
        </div>

        <div className="space-y-4">
             <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs">5</span>
                Revisión Humana
            </h3>
            <div className="flex gap-4 p-1 bg-slate-100 rounded-lg w-fit">
                <button 
                    onClick={() => updateReview('performed', true)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${data.humanReview.performed ? 'bg-white shadow text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sí, hubo revisión
                </button>
                <button 
                    onClick={() => updateReview('performed', false)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!data.humanReview.performed ? 'bg-white shadow text-slate-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    No
                </button>
            </div>

            {data.humanReview.performed && (
                <div className="bg-primary-50/50 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-semibold text-primary-800">TIPO DE REVISIÓN</p>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries({
                            factual: 'Factual', technical: 'Técnica', ethical: 'Ética', style: 'Estilo'
                        }).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    className="form-checkbox text-primary-600 rounded border-primary-200 focus:ring-primary-500 h-4 w-4"
                                    checked={(data.humanReview.types as any)[key]}
                                    onChange={() => toggleReviewType(key as any)}
                                />
                                <span className="text-sm text-slate-700">{label}</span>
                            </label>
                        ))}
                    </div>
                    <input 
                        className="form-input block w-full rounded-lg border-slate-300 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 mt-2"
                        placeholder="Rol del revisor (ej. Editor Senior)"
                        value={data.humanReview.reviewerRole}
                        onChange={(e) => updateReview('reviewerRole', e.target.value)}
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};