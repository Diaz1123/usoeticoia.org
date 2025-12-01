
import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, Code, Info, Download, ShieldCheck, RefreshCcw } from 'lucide-react';
import { DeclarationState } from '../types';
import { generateDeclarationText, generateJSON, downloadAsFile, computeHash } from '../utils';

interface Props {
  data: DeclarationState;
  onReset: () => void;
}

export const Step4_Output: React.FC<Props> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');
  const [copied, setCopied] = useState(false);
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const rawContent = generateDeclarationText(data); 
    computeHash(rawContent).then(h => setHash(h));
  }, [data]);

  const content = activeTab === 'text' 
    ? generateDeclarationText(data, hash || '...') 
    : generateJSON(data, hash || '...');

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Check size={40} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">¡Declaración Lista!</h2>
        <p className="text-lg text-slate-500 mt-3 max-w-lg mx-auto font-light leading-relaxed">
            Tu documento ha sido generado con trazabilidad completa y código de validación único.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Validation Certificate Card */}
        {hash && (
            <div className="bg-slate-800 rounded-xl p-5 text-slate-200 flex items-center justify-between gap-4 shadow-lg border border-slate-700 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 text-slate-700/20 group-hover:text-slate-700/30 transition-colors">
                    <ShieldCheck size={140} />
                </div>
                <div className="relative z-10">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Certificado de Integridad</h4>
                    <div className="text-sm text-slate-400 font-mono">ID: {data.declarationId}</div>
                    <div className="text-xl font-bold tracking-widest text-white font-mono mt-1">{hash}</div>
                </div>
            </div>
        )}

        {/* License Badge */}
        {data.license && data.license !== 'None' && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="text-slate-800 font-bold text-2xl border-2 border-slate-800 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    CC
                 </div>
                 <div>
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Licencia del Producto</h4>
                     <p className="text-lg font-semibold text-slate-900">{data.license}</p>
                 </div>
            </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
            <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all relative ${
                    activeTab === 'text' ? 'text-primary-700 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
            >
                <FileText size={18} /> Texto Legible
                {activeTab === 'text' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />}
            </button>
            <button
                onClick={() => setActiveTab('json')}
                className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all relative ${
                    activeTab === 'json' ? 'text-primary-700 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
            >
                <Code size={18} /> JSON Estructurado
                {activeTab === 'json' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />}
            </button>
        </div>

        {/* Content Area */}
        <div className="relative group">
            <pre className={`
                p-8 overflow-x-auto text-sm font-mono leading-relaxed min-h-[400px] max-h-[600px]
                ${activeTab === 'text' ? 'bg-white text-slate-800 whitespace-pre-wrap' : 'bg-slate-900 text-emerald-400'}
            `}>
                {content}
            </pre>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur shadow-lg border border-slate-200 rounded-lg text-sm font-medium hover:bg-white transition-all text-slate-700 hover:text-primary-700 transform hover:scale-105"
                >
                    {copied ? (
                        <>
                            <Check size={16} className="text-emerald-500" />
                            <span className="text-emerald-600">Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            <span>Copiar al portapapeles</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>

      {/* Download Actions */}
      <div className="flex flex-col gap-8 items-center pt-6">
        <div className="flex flex-wrap gap-4 justify-center w-full">
            <button 
                onClick={() => downloadAsFile(generateDeclarationText(data, hash || ''), 'declaracion-ia-v4.txt', 'text/plain')}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-md hover:shadow-lg text-sm font-medium transform hover:-translate-y-0.5"
            >
                <Download size={18} />
                Descargar Texto (.txt)
            </button>
            <button 
                onClick={() => downloadAsFile(generateJSON(data, hash || ''), 'declaracion-ia-v4.json', 'application/json')}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl transition-all shadow-sm hover:shadow-md text-sm font-medium transform hover:-translate-y-0.5"
            >
                <Code size={18} />
                Descargar JSON (.json)
            </button>
        </div>

        <div className="w-full h-px bg-slate-200 max-w-lg mx-auto" />

        <button 
            onClick={onReset}
            className="group flex items-center gap-2 px-5 py-2.5 text-slate-500 hover:text-primary-600 bg-transparent hover:bg-primary-50 rounded-full transition-all text-sm font-medium"
        >
            <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            Crear nueva declaración
        </button>
      </div>
      
      {/* Integration Hint */}
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-blue-900/80 flex items-start gap-3">
        <Info className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-600" />
        <div>
            <strong>Recomendación Académica:</strong>
            <p className="mt-1 opacity-90 leading-relaxed">
                Adjunte el archivo <code>.json</code> como metadato digital y copie el texto de la declaración en el apartado de "Metodología" o "Anexos" de su trabajo. El Hash de validación permite a los revisores certificar que la información no ha sido manipulada.
            </p>
        </div>
      </div>
    </div>
  );
};
