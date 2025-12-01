
import { DeclarationState } from './types';
import { USAGE_TYPES, HUMAN_REVIEW_LEVELS, HELP_CHECKLIST, CC_LICENSES } from './constants';

// --- HASHING UTILITY ---
export const computeHash = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 16).toUpperCase(); 
};

export const generateDeclarationText = (d: DeclarationState, hash?: string): string => {
  const usageLabels = d.usageTypes.map(type => {
    if (type === 'other') return d.customUsageType || 'Otro uso';
    return USAGE_TYPES.find(u => u.value === type)?.label || type;
  }).join('; ');

  const reviewLevel = HUMAN_REVIEW_LEVELS.find(r => r.level === d.humanReview.level);
  const licenseLabel = CC_LICENSES.find(l => l.value === d.license)?.label || d.license;
  
  const contentModes = d.contentUseModes.map(m => {
      if (m === 'Otro') return d.customContentUseMode || 'Otro';
      return m;
  }).join(', ');

  const dateStr = `${String(d.aiTool.date.month).padStart(2, '0')}/${d.aiTool.date.year}`;
  
  // Get Diagnostic Answers for Traceability
  const diagnosticAnswers = d.selectedChecklistIds.length > 0
    ? d.selectedChecklistIds.map(id => {
        const item = HELP_CHECKLIST.find(i => i.id === id);
        return item ? `   [x] ${item.q}` : null;
      }).filter(Boolean).join('\n')
    : '   (Selección manual directa)';

  let text = `DECLARACIÓN DE TRANSPARENCIA ACADÉMICA: USO DE IA GENERATIVA\n`;
  text += `${'═'.repeat(65)}\n\n`;
  
  text += `0. DIAGNÓSTICO DE ORIGEN (TRAZABILIDAD)\n`;
  text += `${diagnosticAnswers}\n\n`;

  text += `1. CLASIFICACIÓN DEL USO\n`;
  text += `   ${usageLabels.toUpperCase()}\n\n`;
  
  text += `2. HERRAMIENTA UTILIZADA\n`;
  text += `   • Nombre: ${d.aiTool.name || 'No especificado'}\n`;
  text += `   • Versión/Modelo: ${d.aiTool.version || '—'}\n`;
  text += `   • Proveedor: ${d.aiTool.provider || '—'}\n`;
  text += `   • Fecha de consulta: ${dateStr}\n\n`;
  
  text += `3. PROPÓSITO ESPECÍFICO\n`;
  text += `   ${d.specificPurpose || 'No descrito'}\n\n`;
  
  const validPrompts = d.prompts.filter(p => p.description.trim());
  if (validPrompts.length > 0) {
    text += `4. PROMPTS (Instrucciones) PRINCIPALES\n`;
    validPrompts.forEach((p, i) => { 
        text += `   ${i + 1}. "${p.description}"\n`; 
    });
    text += `\n`;
  }
  
  if (d.contentUseModes.length > 0) {
    text += `5. INTEGRACIÓN EN EL PRODUCTO FINAL\n`;
    text += `   • Modo de uso: ${contentModes}\n`;
    if (d.contentUseContext) text += `   • Contexto adicional: ${d.contentUseContext}\n`;
    text += `\n`;
  }
  
  text += `6. NIVEL DE REVISIÓN HUMANA Y ÉTICA\n`;
  text += `   • Nivel ${d.humanReview.level}: ${reviewLevel?.label.split(':')[1]?.trim() || 'Desconocido'}\n`;
  text += `   • Descripción: ${reviewLevel?.description}\n`;
  if (d.humanReview.level > 0) {
      if (d.humanReview.reviewerName) text += `   • Revisado por: ${d.humanReview.reviewerName}\n`;
      if (d.humanReview.reviewerRole) text += `   • Rol/Cargo: ${d.humanReview.reviewerRole}\n`;
  }

  if (d.license && d.license !== 'None') {
      text += `\n7. LICENCIA DEL PRODUCTO FINAL\n`;
      text += `   • ${licenseLabel}\n`;
  }

  if (hash) {
      text += `\n${'-'.repeat(65)}\n`;
      text += `ID REGISTRO: ${d.declarationId}\n`;
      text += `HASH VALIDACIÓN: ${hash}\n`;
  }
  
  return text;
};

export const generateJSON = (d: DeclarationState, hash?: string): string => {
  const usageLabels = d.usageTypes.map(type => {
    if (type === 'other') return d.customUsageType;
    return USAGE_TYPES.find(u => u.value === type)?.label;
  });

  const reviewLevel = HUMAN_REVIEW_LEVELS.find(r => r.level === d.humanReview.level);

  const contentModes = d.contentUseModes.map(m => {
    if (m === 'Otro') return d.customContentUseMode;
    return m;
  });

  const payload = {
    declarationType: 'academic-ai-transparency',
    version: '4.0.0',
    generatedAt: new Date().toISOString(),
    id: d.declarationId,
    validationHash: hash || 'pending',
    license: d.license !== 'None' ? d.license : null,
    traceability: {
        diagnosticIds: d.selectedChecklistIds
    },
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
        modes: contentModes, 
        context: d.contentUseContext || null 
    },
    humanReview: { 
        level: d.humanReview.level,
        label: reviewLevel?.label,
        description: reviewLevel?.description,
        reviewerName: d.humanReview.reviewerName || null,
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
