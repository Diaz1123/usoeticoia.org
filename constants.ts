
import { ChecklistItem, UsageOption, DeclarationState, ReviewLevelOption } from './types';

export const USAGE_TYPES: UsageOption[] = [
  { 
    value: 'draft', 
    label: 'Generación de Borrador / Texto Base', 
    hint: 'La IA escribió una primera versión completa o secciones sustanciales que sirvieron de base.',
    examples: ['Generación de introducción para un paper', 'Redacción de correos formales', 'Primer borrador de capítulos teóricos']
  },
  { 
    value: 'coauthor', 
    label: 'Co-creación Sustantiva', 
    hint: 'Colaboración iterativa donde la IA y el humano construyen argumentos o narrativas conjuntamente.',
    examples: ['Diálogo socrático para refinar argumentos', 'Expansión de puntos clave definidos por el humano', 'Desarrollo de escenarios hipotéticos']
  },
  { 
    value: 'writing-support', 
    label: 'Asistencia Lingüística y de Estilo', 
    hint: 'Mejora de la forma sin alterar el fondo o las ideas principales.',
    examples: ['Parafraseo para mejorar fluidez (Tone adjustment)', 'Corrección gramatical y ortográfica', 'Adaptación de texto a formato académico estándar']
  },
  { 
    value: 'ideation', 
    label: 'Ideación y Estructuración', 
    hint: 'Apoyo en la fase previa a la escritura (brainstorming, esquemas).',
    examples: ['Generación de preguntas de investigación', 'Creación de esquemas (outlines) para tesis', 'Sugerencia de títulos o palabras clave']
  },
  { 
    value: 'analysis', 
    label: 'Procesamiento y Análisis de Datos', 
    hint: 'Uso de capacidades computacionales para sintetizar o transformar información.',
    examples: ['Resumen de papers o bibliografía', 'Extracción de entidades en textos', 'Análisis de sentimiento en corpus de datos']
  },
  { 
    value: 'coding', 
    label: 'Generación de Código / Simulación', 
    hint: 'Creación de scripts, algoritmos o modelos matemáticos.',
    examples: ['Scripts de Python/R para análisis estadístico', 'Consultas SQL complejas', 'Debugging de código de investigación']
  },
  { 
    value: 'translation', 
    label: 'Traducción Técnica', 
    hint: 'Traducción de textos académicos o técnicos entre idiomas.',
    examples: ['Traducción de abstract al inglés', 'Comprensión de bibliografía en otro idioma']
  },
  { 
    value: 'review', 
    label: 'Simulación de Revisión (Feedback)', 
    hint: 'La IA actúa como "abogado del diablo" o revisor par simulado.',
    examples: ['Detección de falacias lógicas', 'Crítica a la metodología propuesta', 'Búsqueda de lagunas en la argumentación']
  },
  { 
    value: 'other', 
    label: 'Otro uso no listado', 
    hint: 'Cualquier otro uso que no encaje en las categorías anteriores.',
    examples: []
  }
];

export const CONTENT_USE_MODES = [
  'Incorporado tal cual (Verbatim)',
  'Editado parcialmente (ajustes menores)',
  'Reescrito sustancialmente (mismas ideas, nuevas palabras)',
  'Usado solo como inspiración/referencia',
  'Sintetizado con otras fuentes humanas/documentales',
  'Otro'
];

export const HUMAN_REVIEW_LEVELS: ReviewLevelOption[] = [
  { level: 0, label: 'Nivel 0: Sin Revisión', description: 'El contenido generado se utilizó directamente sin verificación humana (No recomendado en contextos académicos).' },
  { level: 1, label: 'Nivel 1: Revisión Superficial', description: 'Lectura rápida para verificar coherencia general, sin entrar en detalles de exactitud.' },
  { level: 2, label: 'Nivel 2: Revisión Gramatical/Estilo', description: 'Corrección de errores tipográficos, sintaxis y tono, asumiendo la veracidad del contenido.' },
  { level: 3, label: 'Nivel 3: Verificación Selectiva', description: 'Comprobación aleatoria (spot-checking) de datos clave o afirmaciones dudosas.' },
  { level: 4, label: 'Nivel 4: Contrastación Documental', description: 'Verificación de citas, referencias y datos contra fuentes primarias fiables.' },
  { level: 5, label: 'Nivel 5: Validación Experta', description: 'Revisión profunda por un experto en la materia para asegurar integridad lógica y metodológica.' },
  { level: 6, label: 'Nivel 6: Revisión Crítica y Ética', description: 'Análisis exhaustivo de sesgos, originalidad, ética y precisión técnica (Estándar "Gold").' }
];

export const HELP_CHECKLIST: ChecklistItem[] = [
  { id: 'q1', q: '¿Generó texto nuevo (párrafos, capítulos) que usaste como base?', suggests: 'draft', priority: 100 },
  { id: 'q2', q: '¿Te ayudó a escribir código, scripts o fórmulas matemáticas?', suggests: 'coding', priority: 90 },
  { id: 'q3', q: '¿Resumió artículos, extrajo datos o analizó documentos PDF?', suggests: 'analysis', priority: 80 },
  { id: 'q4', q: '¿Tradujo textos técnicos o abstracts a otro idioma?', suggests: 'translation', priority: 70 },
  { id: 'q5', q: '¿Sugirió estructuras, preguntas de investigación o ideas?', suggests: 'ideation', priority: 60 },
  { id: 'q6', q: '¿Solo mejoró la redacción, el vocabulario o la ortografía?', suggests: 'writing-support', priority: 40 },
  { id: 'q7', q: '¿Evaluó tu trabajo buscando errores o debilidades?', suggests: 'review', priority: 20 }
];

export const getInitialDeclaration = (): DeclarationState => ({
  declarationId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
  selectedChecklistIds: [],
  usageTypes: [],
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
  customContentUseMode: '',
  contentUseContext: '',
  humanReview: { 
    level: 0, 
    reviewerRole: '' 
  }
});
