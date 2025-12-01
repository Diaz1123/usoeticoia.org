
import React from 'react';
import { Trash2, Plus, Info, Scale, UserCheck } from 'lucide-react';
import { DeclarationState, HumanReviewLevel } from '../types';
import { CONTENT_USE_MODES, HUMAN_REVIEW_LEVELS, CC_LICENSES } from '../constants';

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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Detalles de Transparencia</h2>
        <p className="text-lg text-slate-500 mt-2 font-light">
            Especifica la metodología, la ética de verificación y la licencia final.
        </p>
      </div>

      {/* 1. Tool & Purpose */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs border border-slate-200">1</span>
                Herramienta
            </h3>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Datos del Modelo</label>
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
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Consulta</label>
                    <div className="flex items-center gap-2">
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
                            className="form-select w-28 rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500"
                            value={data.aiTool.date.year}
                            onChange={(e) => updateDate('year', e.target.value)}
                        >
                            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs border border-slate-200">2</span>
                Propósito Académico
            </h3>
            <div className="relative h-full">
                <textarea 
                    className="form-textarea w-full h-full min-h-[220px] rounded-xl border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500 resize-none p-4 leading-relaxed"
                    placeholder="Describe la tarea específica. Ej: 'Generar ideas para la discusión de resultados' o 'Traducir el resumen al inglés'..."
                    maxLength={600}
                    value={data.specificPurpose}
                    onChange={(e) => onChange({...data, specificPurpose: e.target.value})}
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                    {data.specificPurpose.length}/600
                </div>
            </div>
        </div>
      </div>

      {/* 2. Prompts */}
      <div className="space-y-4">
         <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs border border-slate-200">3</span>
            Prompts (Instrucciones)
            <span className="ml-auto text-xs normal-case font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1 border border-amber-100">
                <Info size={14} /> Privacidad: No incluir datos personales
            </span>
        </h3>
        <div className="bg-slate-50 p-6 rounded-xl space-y-4 border border-slate-200/60">
            {data.prompts.map((p, idx) => (
                <div key={p.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2">
                    <span className="mt-3 text-xs text-slate-400 font-mono select-none w-5 text-right font-bold">{idx + 1}.</span>
                    <div className="flex-1 relative group">
                        <input 
                            className="form-input w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500 shadow-sm"
                            placeholder="Copia aquí la instrucción principal..."
                            value={p.description}
                            onChange={(e) => updatePrompt(p.id, e.target.value)}
                        />
                    </div>
                    {data.prompts.length > 1 && (
                        <button 
                            onClick={() => removePrompt(p.id)}
                            className="mt-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Eliminar prompt"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            ))}
            <button 
                onClick={addPrompt}
                className="ml-8 text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-2 py-2 px-4 hover:bg-primary-50 rounded-lg transition-colors"
            >
                <Plus size={18} /> Añadir otro prompt
            </button>
        </div>
      </div>

      {/* 3. Integration & Content Use */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs border border-slate-200">4</span>
            Integración del Contenido
        </h3>
        <div className="grid md:grid-cols-2 gap-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    ¿Cómo se incorporó el resultado?
                </label>
                <div className="space-y-2">
                    {CONTENT_USE_MODES.map(mode => (
                        <div key={mode}>
                            <label className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox text-primary-600 rounded border-slate-300 focus:ring-primary-500 h-4 w-4"
                                    checked={data.contentUseModes.includes(mode)}
                                    onChange={() => toggleMode(mode)}
                                />
                                <span className={`text-sm group-hover:text-slate-900 ${data.contentUseModes.includes(mode) ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{mode}</span>
                            </label>
                            {/* Custom input for "Otro" mode */}
                            {mode === 'Otro' && data.contentUseModes.includes('Otro') && (
                                 <input 
                                    className="ml-9 mt-1 form-input block w-[85%] rounded-lg border-slate-300 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 bg-slate-50"
                                    placeholder="Especifique cómo..."
                                    autoFocus
                                    value={data.customContentUseMode}
                                    onChange={(e) => onChange({...data, customContentUseMode: e.target.value})}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-800">Contexto Adicional</label>
                 <textarea 
                    className="form-textarea w-full rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500 min-h-[180px] resize-none leading-relaxed"
                    placeholder="Ej: 'El texto generado fue usado solo en la sección 2.3 para contrastar hipótesis. El resto del documento es autoría 100% humana...'"
                    value={data.contentUseContext}
                    onChange={(e) => onChange({...data, contentUseContext: e.target.value})}
                />
            </div>
        </div>
      </div>

      {/* 4. Human Review Levels */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs border border-slate-200">5</span>
            Nivel de Revisión Humana y Ética
        </h3>
        
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {HUMAN_REVIEW_LEVELS.map((levelOption) => {
                const isSelected = data.humanReview.level === levelOption.level;
                return (
                    <div 
                        key={levelOption.level}
                        onClick={() => setReviewLevel(levelOption.level)}
                        className={`
                            p-4 border-b last:border-0 border-slate-100 cursor-pointer transition-all duration-200
                            ${isSelected ? 'bg-primary-50' : 'hover:bg-slate-50'}
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                                mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                ${isSelected ? 'border-primary-600 bg-white' : 'border-slate-300 bg-slate-50'}
                            `}>
                                {isSelected && <div className="w-3 h-3 rounded-full bg-primary-600" />}
                            </div>
                            <div>
                                <span className={`text-base font-semibold block ${isSelected ? 'text-primary-900' : 'text-slate-700'}`}>
                                    {levelOption.label}
                                </span>
                                <p className={`text-sm mt-1 leading-relaxed ${isSelected ? 'text-primary-700' : 'text-slate-500'}`}>
                                    {levelOption.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {data.humanReview.level > 0 && (
             <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <UserCheck size={16} className="text-primary-600" />
                        Nombre del Revisor
                    </label>
                    <input 
                        className="form-input block w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500 bg-white"
                        placeholder="Ej. Juan Pérez"
                        value={data.humanReview.reviewerName}
                        onChange={(e) => onChange({ ...data, humanReview: { ...data.humanReview, reviewerName: e.target.value } })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Rol / Cargo</label>
                    <input 
                        className="form-input block w-full rounded-lg border-slate-300 py-2.5 text-sm focus:border-primary-500 focus:ring-primary-500 bg-white"
                        placeholder="Ej. Autor Principal, Comité de Ética..."
                        value={data.humanReview.reviewerRole}
                        onChange={(e) => onChange({ ...data, humanReview: { ...data.humanReview, reviewerRole: e.target.value } })}
                    />
                </div>
            </div>
        )}
      </div>

      {/* 5. Licensing */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs border border-slate-200">6</span>
            Licenciamiento del Trabajo Final
        </h3>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 rounded-lg text-slate-600">
                    <Scale size={24} />
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            ¿Bajo qué licencia liberarás este producto académico?
                        </label>
                        <p className="text-xs text-slate-500 mb-3">
                            Seleccionar una licencia abierta (Creative Commons) facilita la difusión y reutilización ética de tu trabajo.
                        </p>
                        <select 
                            className="form-select w-full rounded-lg border-slate-300 text-sm focus:border-primary-500 focus:ring-primary-500 py-2.5"
                            value={data.license}
                            onChange={(e) => onChange({ ...data, license: e.target.value })}
                        >
                            {CC_LICENSES.map(lic => (
                                <option key={lic.value} value={lic.value}>{lic.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
