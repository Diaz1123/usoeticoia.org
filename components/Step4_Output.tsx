import React, { useState } from 'react';
import { Copy, Check, FileText, Code, Info, Download } from 'lucide-react';
import { DeclarationState } from '../types';
import { generateDeclarationText, generateJSON, downloadAsFile } from '../utils';

interface Props {
  data: DeclarationState;
}

export const Step4_Output: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');
  const [copied, setCopied] = useState(false);

  const content = activeTab === 'text' ? generateDeclarationText(data) : generateJSON(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (activeTab === 'text') {
      downloadAsFile(generateDeclarationText(data), 'declaracion-ia.txt', 'text/plain');
    } else {
      downloadAsFile(generateJSON(data), 'declaracion-ia.json', 'application/json');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">¡Declaración Lista!</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Copia el formato que necesites o descárgalo para adjuntarlo a tu documentación.
        </p>
      </div>

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
      <div className="max-w-3xl mx-auto flex flex-wrap gap-3 justify-center">
        <button 
            onClick={() => downloadAsFile(generateDeclarationText(data), 'declaracion-ia.txt', 'text/plain')}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
        >
            <Download size={18} />
            Descargar como .txt
        </button>
        <button 
            onClick={() => downloadAsFile(generateJSON(data), 'declaracion-ia.json', 'application/json')}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
        >
            <Code size={18} />
            Descargar como .json
        </button>
      </div>
      
      {/* Integration Hint */}
      <div className="max-w-3xl mx-auto p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
        <Info className="flex-shrink-0 w-5 h-5 mt-0.5" />
        <div>
            <strong>Sugerencia de Integración:</strong>
            <p className="mt-1 opacity-90">
                Utiliza el formato <code>JSON</code> para sistemas automatizados o metadatos ocultos. El formato <code>Texto</code> es ideal para notas al pie, anexos metodológicos o descripciones de posts.
            </p>
        </div>
      </div>
    </div>
  );
};