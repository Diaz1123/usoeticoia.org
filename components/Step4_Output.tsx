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
    // Generate the raw text content without the hash line to compute the hash
    const rawContent = generateDeclarationText(data); 
    computeHash(rawContent).then(h => setHash(h));
  }, [data]);

  // The content displayed includes the hash once calculated
  const content = activeTab === 'text' 
    ? generateDeclarationText(data, hash || '...') 
    : generateJSON(data, hash || '...');

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">¡Declaración Lista!</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            A continuación se presenta el documento final con trazabilidad completa y código de validación.
        </p>
      </div>

      {/* Validation Certificate Card */}
      {hash && (
        <div className="bg-slate-800 rounded-xl p-4 text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-slate-700">
            <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-400 w-10 h-10" />
                <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Protocolo de Validación</h4>
                    <p className="text-sm text-slate-300">Huella Digital (Hash SHA-256)</p>
                </div>
            </div>
            <div className="text-right font-mono">
                <div className="text-xs text-slate-500 mb-1">ID: {data.declarationId}</div>
                <div className="text-lg font-bold tracking-widest text-white">{hash}</div>
            </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
            <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
                    activeTab === 'text' ? 'text-primary-700 bg-white' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <FileText size={16} /> Texto Legible
                {activeTab === 'text' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />}
            </button>
            <button
                onClick={() => setActiveTab('json')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${
                    activeTab === 'json' ? 'text-primary-700 bg-white' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                <Code size={16} /> JSON Estructurado
                {activeTab === 'json' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />}
            </button>
        </div>

        {/* Content Area */}
        <div className="relative group">
            <pre className={`
                p-6 overflow-x-auto text-sm font-mono leading-relaxed min-h-[300px] max-h-[500px]
                ${activeTab === 'text' ? 'bg-white text-slate-800 whitespace-pre-wrap' : 'bg-slate-900 text-emerald-400'}
            `}>
                {content}
            </pre>
            
            {/* Floating Copy Button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur shadow-lg border border-slate-200 rounded-lg text-sm font-medium hover:bg-white transition-all text-slate-700"
                >
                    {copied ? (
                        <>
                            <Check size={16} className="text-emerald-500" />
                            <span className="text-emerald-600">Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy size={16} />
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>

      {/* Download Actions */}
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-wrap gap-3 justify-center w-full">
            <button 
                onClick={() => downloadAsFile(generateDeclarationText(data, hash || ''), 'declaracion-ia-v3.txt', 'text/plain')}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
                <Download size={18} />
                Descargar .txt
            </button>
            <button 
                onClick={() => downloadAsFile(generateJSON(data, hash || ''), 'declaracion-ia-v3.json', 'application/json')}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
                <Code size={18} />
                Descargar .json
            </button>
        </div>

        <button 
            onClick={onReset}
            className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-2 transition-colors px-4 py-2 hover:bg-slate-50 rounded-full"
        >
            <RefreshCcw size={14} />
            Crear nueva declaración (Limpiar todo)
        </button>
      </div>
      
      {/* Integration Hint */}
      <div className="max-w-3xl mx-auto p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
        <Info className="flex-shrink-0 w-5 h-5 mt-0.5" />
        <div>
            <strong>Sugerencia de Integración:</strong>
            <p className="mt-1 opacity-90">
                El <strong>Hash de Validación</strong> garantiza que esta declaración no ha sido alterada. Inclúyelo siempre en los anexos de tu trabajo.
            </p>
        </div>
      </div>
    </div>
  );
};