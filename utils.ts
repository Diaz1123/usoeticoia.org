import { DeclarationState } from './types';
import { USAGE_TYPES } from './constants';

export const generateDeclarationText = (d: DeclarationState): string => {
  // Map all selected types to their labels
  const usageLabels = d.usageTypes.map(type => {
    if (type === 'other') return d.customUsageType || 'Otro';
    return USAGE_TYPES.find(u => u.value === type)?.label || type;
  }).join(', ');

  const usageHeader = usageLabels || 'NO ESPECIFICADO';
  
  const activeReviewTypes = Object.entries(d.humanReview.types)
    .filter(([, v]) => v)
    .map(([k]) => {
        const map: Record<string, string> = { factual: 'factual', technical: 'técnica', ethical: 'ética', style: 'estilística' };
        return map[k];
    })
    .join(', ');
  
  const dateStr = `${String(d.aiTool.date.month).padStart(2, '0')}/${d.aiTool.date.year}`;
  
  let text = `DECLARACIÓN DE TRANSPARENCIA: USO DE IA GENERATIVA\n`;
  text += `${'═'.repeat(60)}\n\n`;
  text += `TIPO(S) DE USO: ${usageHeader.toUpperCase()}\n\n`;
  
  text += `HERRAMIENTA:\n`;
  text += `• Nombre: ${d.aiTool.name || 'No especificado'}\n`;
  text += `• Modelo/Versión: ${d.aiTool.version || '—'}\n`;
  text += `• Proveedor: ${d.aiTool.provider || '—'}\n`;
  text += `• Fecha: ${dateStr}\n\n`;
  
  text += `PROPÓSITO:\n${d.specificPurpose || 'No especificado'}\n\n`;
  
  const validPrompts = d.prompts.filter(p => p.description.trim());
  if (validPrompts.length > 0) {
    text += `PROMPTS PRINCIPALES:\n`;
    validPrompts.forEach((p, i) => { 
        text += `${i + 1}. ${p.description}\n`; 
    });
    text += `\n`;
  }
  
  if (d.contentUseModes.length > 0) {
    text += `INTEGRACIÓN DEL CONTENIDO:\n`;
    text += `• Modos: ${d.contentUseModes.join(', ')}\n`;
    if (d.contentUseContext) text += `• Contexto: ${d.contentUseContext}\n`;
    text += `\n`;
  }
  
  text += `REVISIÓN HUMANA: ${d.humanReview.performed ? 'SÍ' : 'NO'}\n`;
  if (d.humanReview.performed) {
    if (activeReviewTypes) text += `• Alcance: ${activeReviewTypes}\n`;
    if (d.humanReview.reviewerRole) text += `• Rol del revisor: ${d.humanReview.reviewerRole}\n`;
  }
  
  return text;
};

export const generateJSON = (d: DeclarationState): string => {
  const usageLabels = d.usageTypes.map(type => {
    if (type === 'other') return d.customUsageType;
    return USAGE_TYPES.find(u => u.value === type)?.label;
  });

  const reviewTypesList = Object.entries(d.humanReview.types)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const payload = {
    declarationType: 'ai-usage-transparency',
    version: '1.1.0',
    generatedAt: new Date().toISOString(),
    usage: { 
        types: d.usageTypes, 
        labels: usageLabels,
        customDescription: d.usageTypes.includes('other') ? d.customUsageType : null 
    },
    tool: { 
        name: d.aiTool.name,
        version: d.aiTool.version,
        provider: d.aiTool.provider,
        date: `${d.aiTool.date.year}-${String(d.aiTool.date.month).padStart(2, '0')}` 
    },
    purpose: d.specificPurpose,
    prompts: d.prompts.filter(p => p.description.trim()).map(p => p.description),
    integration: { 
        modes: d.contentUseModes, 
        context: d.contentUseContext || null 
    },
    humanReview: { 
        performed: d.humanReview.performed, 
        scope: d.humanReview.performed ? reviewTypesList : [], 
        reviewerRole: d.humanReview.reviewerRole || null 
    }
  };

  return JSON.stringify(payload, null, 2);
};

export const downloadAsFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};