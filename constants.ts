
import { ChecklistItem, UsageOption, DeclarationState, ReviewLevelOption, Preset, GlossaryTerm } from './types';

export const USAGE_TYPES: UsageOption[] = [
  { 
    value: 'draft', 
    label: 'Generación de Borrador', 
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
    label: 'Asistencia de Estilo y Redacción', 
    hint: 'Mejora de la forma sin alterar el fondo o las ideas principales.',
    examples: ['Parafraseo para mejorar fluidez (Tone adjustment)', 'Corrección gramatical y ortográfica', 'Adaptación de texto a formato académico estándar']
  },
  { 
    value: 'ideation', 
    label: 'Ideación y Estructura', 
    hint: 'Apoyo en la fase previa a la escritura (brainstorming, esquemas).',
    examples: ['Generación de preguntas de investigación', 'Creación de esquemas (outlines) para tesis', 'Sugerencia de títulos o palabras clave']
  },
  { 
    value: 'analysis', 
    label: 'Análisis de Datos', 
    hint: 'Uso de capacidades computacionales para sintetizar o transformar información.',
    examples: ['Resumen de papers o bibliografía', 'Extracción de entidades en textos', 'Análisis de sentimiento en corpus de datos']
  },
  { 
    value: 'coding', 
    label: 'Generación de Código', 
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
  'Reescrito sustancialmente',
  'Usado solo como inspiración/referencia',
  'Sintetizado con otras fuentes',
  'Otro'
];

export const HUMAN_REVIEW_LEVELS: ReviewLevelOption[] = [
  { level: 0, label: 'Nivel 0: Sin Revisión', description: 'El contenido generado se utilizó directamente sin verificación humana (RIESGO ALTO).' },
  { level: 1, label: 'Nivel 1: Revisión Superficial', description: 'Lectura rápida para verificar coherencia general, sin entrar en detalles de exactitud.' },
  { level: 2, label: 'Nivel 2: Revisión Gramatical', description: 'Corrección de errores tipográficos, sintaxis y tono, asumiendo la veracidad del contenido.' },
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

export const CC_LICENSES = [
  { value: 'CC BY 4.0', label: 'CC BY (Atribución)' },
  { value: 'CC BY-SA 4.0', label: 'CC BY-SA (Atribución - Compartir Igual)' },
  { value: 'CC BY-NC 4.0', label: 'CC BY-NC (Atribución - No Comercial)' },
  { value: 'CC BY-ND 4.0', label: 'CC BY-ND (Atribución - Sin Derivadas)' },
  { value: 'CC0 1.0', label: 'CC0 (Dominio Público)' },
  { value: 'Copyright', label: 'Todos los derechos reservados (Copyright)' },
  { value: 'None', label: 'No especificar / No aplica' }
];

export const PRESETS: Preset[] = [
  {
    id: 'thesis-edit',
    name: 'Corrección de Tesis',
    description: 'Uso de IA solo para mejorar redacción y ortografía.',
    data: {
      usageTypes: ['writing-support'],
      specificPurpose: 'Mejorar la claridad, cohesión y ortografía de los capítulos de resultados y discusión, sin alterar los datos ni las conclusiones.',
      contentUseModes: ['Editado parcialmente (ajustes menores)'],
      humanReview: { level: 5, reviewerRole: 'Autor Principal', reviewerName: '' }
    }
  },
  {
    id: 'coding-assist',
    name: 'Análisis de Datos (R/Python)',
    description: 'Generación de scripts para procesar datos.',
    data: {
      usageTypes: ['coding', 'analysis'],
      specificPurpose: 'Generación de scripts en Python para limpieza de dataset y visualización de gráficos exploratorios (Matplotlib).',
      contentUseModes: ['Incorporado tal cual (Verbatim)', 'Editado parcialmente (ajustes menores)'],
      humanReview: { level: 6, reviewerRole: 'Investigador de Datos', reviewerName: '' }
    }
  },
  {
    id: 'translation',
    name: 'Traducción de Abstract',
    description: 'Traducción de resúmenes académicos.',
    data: {
      usageTypes: ['translation'],
      specificPurpose: 'Traducción del resumen ejecutivo del español al inglés para publicación internacional.',
      contentUseModes: ['Editado parcialmente (ajustes menores)'],
      humanReview: { level: 4, reviewerRole: 'Autor / Traductor', reviewerName: '' }
    }
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'Prompt', definition: 'La instrucción o texto de entrada que se le da a la IA para generar una respuesta.' },
  { term: 'Alucinación', definition: 'Fenómeno donde la IA genera información falsa o inventada con apariencia de ser real.' },
  { term: 'Sesgo (Bias)', definition: 'Prejuicios o inclinaciones injustas presentes en los datos de entrenamiento de la IA que se reflejan en sus respuestas.' },
  { term: 'Verbatim', definition: 'Copia textual, palabra por palabra, del contenido generado.' },
  { term: 'LLM (Large Language Model)', definition: 'Modelo de lenguaje grande (como GPT, Claude, Gemini) entrenado con vastas cantidades de texto.' }
];

export const getInitialDeclaration = (): DeclarationState => ({
  declarationId: Math.random().toString(36).substring(2, 10).toUpperCase(),
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
    reviewerRole: '',
    reviewerName: ''
  },
  license: 'None'
});
