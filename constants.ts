import { ChecklistItem, UsageOption, DeclarationState } from './types';

export const USAGE_TYPES: UsageOption[] = [
  { 
    value: 'draft', 
    label: 'Borrador inicial', 
    hint: 'La IA generó una primera versión que luego fue modificada por humanos.',
    examples: ['Generación de un primer borrador de artículo', 'Creación de código base para software', 'Redacción de correos o comunicaciones preliminares']
  },
  { 
    value: 'coauthor', 
    label: 'Coautoría sustantiva', 
    hint: 'La IA contribuyó significativamente al contenido final junto al humano.',
    examples: ['Escribir capítulos enteros de un reporte', 'Desarrollo conjunto de argumentos', 'Generación de diálogos o narrativas complejas']
  },
  { 
    value: 'writing-support', 
    label: 'Apoyo a la redacción', 
    hint: 'Mejoras de forma: estilo, gramática, traducción o claridad.',
    examples: ['Corrección ortográfica y gramatical', 'Reformulación para tono (ej. más formal)', 'Traducción de fragmentos']
  },
  { 
    value: 'ideation', 
    label: 'Ideación y estructura', 
    hint: 'Brainstorming, esquemas o planificación, pero el contenido final es humano.',
    examples: ['Lluvia de ideas para títulos', 'Creación de índices o esquemas', 'Planificación de calendario editorial']
  },
  { 
    value: 'analysis', 
    label: 'Análisis de datos/texto', 
    hint: 'Resumen, extracción de entidades o transformación de datos.',
    examples: ['Resumir documentos largos', 'Extraer puntos clave de reuniones', 'Clasificar sentimientos en comentarios']
  },
  { 
    value: 'review', 
    label: 'Revisión / Feedback', 
    hint: 'Sugerencias no vinculantes sobre un texto escrito por humanos.',
    examples: ['Solicitar críticas a un argumento', 'Simular un lector objetivo', 'Detectar huecos lógicos']
  },
  { 
    value: 'other', 
    label: 'Otro', 
    hint: 'Un caso de uso diferente a los anteriores.',
    examples: []
  }
];

export const CONTENT_USE_MODES = [
  'Usado tal cual (sin cambios)',
  'Editado parcialmente',
  'Sustancialmente reescrito',
  'Referencia / Inspiración',
  'Combinado con otras fuentes'
];

// Priorities: 
// 100: Draft (Creation)
// 80: Analysis (Processing)
// 60: Ideation (Structure)
// 40: Writing Support (Refinement)
// 20: Review (Feedback)
export const HELP_CHECKLIST: ChecklistItem[] = [
  { id: 'q1', q: '¿La IA generó párrafos o secciones completas que utilizaste?', suggests: 'draft', priority: 100 },
  { id: 'q2', q: '¿La IA procesó datos, resumió textos o extrajo información?', suggests: 'analysis', priority: 80 },
  { id: 'q3', q: '¿La IA te ayudó a generar ideas, esquemas o estructura?', suggests: 'ideation', priority: 60 },
  { id: 'q4', q: '¿Solo corrigió ortografía, gramática o mejoró el estilo?', suggests: 'writing-support', priority: 40 },
  { id: 'q5', q: '¿La IA actuó como revisor dándote feedback u opiniones?', suggests: 'review', priority: 20 }
];

// Changed to a function to ensure a fresh object reference on every reset
export const getInitialDeclaration = (): DeclarationState => ({
  usageTypes: [], // Initialize as empty array
  customUsageType: '',
  aiTool: { 
    name: '', 
    version: '', 
    provider: '', 
    date: { month: new Date().getMonth() + 1, year: new Date().getFullYear() } 
  },
  specificPurpose: '',
  prompts: [{ id: '1', description: '' }],
  contentUseModes: [],
  contentUseContext: '',
  humanReview: { 
    performed: false, 
    types: { factual: false, technical: false, ethical: false, style: false }, 
    reviewerRole: '' 
  }
});