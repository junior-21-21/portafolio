/**
 * Todo el contenido del portafolio vive aquí: para actualizar textos, enlaces
 * o proyectos solo hace falta editar este archivo.
 */

export interface RepoLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  icon: string;
  /** Módulos o áreas que se muestran en la miniatura de la tarjeta. */
  modules: string[];
  highlights: string[];
  tech: string[];
  repos: RepoLink[];
}

export interface Experience {
  role: string;
  company: string;
  period?: string;
  points: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  detail?: string;
}

export interface TechItem {
  name: string;
  /** Archivo en public/tech. Sin ícono se muestra una etiqueta de texto. */
  icon?: string;
  glyph?: string;
}

export interface TechGroup {
  title: string;
  items: TechItem[];
}

const GITHUB = 'https://github.com/junior-21-21';

export const PROFILE = {
  fullName: 'Cristhian Junior Quicaño Moreno',
  firstLine: 'Cristhian Junior',
  secondLine: 'Quicaño Moreno',
  shortName: 'Cristhian Quicaño',
  role: 'Desarrollador Full Stack',
  career: 'Ingeniería de Sistemas e Información',
  email: 'quicanomorenojunior21072004@gmail.com',
  phone: '+51 900 048 717',
  phoneHref: 'tel:+51900048717',
  location: 'Huamanga, Ayacucho – Perú',
  github: GITHUB,
  githubUser: 'junior-21-21',
  /** Pega aquí tu URL de LinkedIn para que aparezca en contacto y pie de página. */
  linkedin: '',
  cv: 'CV_Cristhian_Quicano.pdf',
  typed: [
    'Desarrollador Full Stack',
    'Java · Spring Boot · Angular',
    'Bases de datos relacionales',
    'Busco prácticas preprofesionales',
  ],
  intro:
    'Vengo de un taller de soldadura familiar en Huamanga, y hoy el taller cotiza todos los días con el sistema que desarrollé. Soy estudiante de noveno ciclo de Ingeniería de Sistemas e Información, desarrollador full stack y quechuahablante nativo.',
  about: [
    'Soy estudiante de noveno ciclo de Ingeniería de Sistemas e Información, con experiencia práctica en el desarrollo de aplicaciones web full stack con Java, Spring Boot y Angular, y en el diseño de bases de datos relacionales.',
    'Actualmente desarrollo y administro el sistema de cotizaciones y contratos de un taller de soldadura en producción. Soy quechuahablante nativo, con experiencia en atención al cliente y trabajo bajo presión, y busco prácticas preprofesionales donde aportar y seguir creciendo.',
  ],
};

/** Problemas que viví de cerca antes de resolverlos con software. */
export const ORIGINS = [
  {
    lived: 'Mozo en Restaurante Tinajas',
    saw: 'Atendí al público y tomé pedidos.',
    built: 'Sistema para restaurantes',
    did: 'Módulos de Mozo, Cocina, Caja y Administración.',
    slug: 'restaurante',
  },
  {
    lived: 'Taller de soldadura familiar',
    saw: 'Las cotizaciones y contratos eran un proceso manual.',
    built: 'Cotizador del Taller',
    did: 'En uso diario, con menos errores y menos tiempo de atención.',
    slug: 'cotizador-taller',
  },
];

export const EDUCATION = [
  {
    title: 'Ing. de Sistemas e Información',
    place: 'Escuela Superior La Pontificia (ELP)',
    status: 'IX ciclo – En curso',
  },
  {
    title: 'Educación secundaria',
    place: 'I.E. Pedro Crisólogo Cárdenas Orozco',
    status: 'Concluida',
  },
];

export const LANGUAGES = [
  { name: 'Quechua', level: 'Nativo' },
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'Básico' },
];

export const SOFT_SKILLS = [
  'Atención al cliente',
  'Trabajo en equipo',
  'Resolución de problemas',
  'Aprendizaje autónomo',
  'Comunicación bilingüe',
];

export const EXPERIENCE: Experience[] = [
  {
    role: 'Desarrollador y administrador de sistemas',
    company: 'Taller de Soldadura (negocio familiar) – Huamanga',
    period: 'Actualidad',
    points: [
      'Diseñé y desarrollé la aplicación web del taller para generar cotizaciones y contratos, hoy en uso diario.',
      'Administro el sistema: registro de clientes y trabajos, mantenimiento y mejoras continuas.',
      'Digitalicé un proceso que antes era manual, reduciendo errores y tiempo de atención.',
    ],
  },
  {
    role: 'Asesor de atención al cliente',
    company: 'Claro Perú',
    points: [
      'Atención y resolución de consultas y reclamos de clientes sobre servicios de telecomunicaciones.',
      'Uso de sistemas internos de gestión de clientes y cumplimiento de indicadores de calidad.',
    ],
  },
  {
    role: 'Mozo',
    company: 'Restaurante Tinajas',
    points: [
      'Atención al público y toma de pedidos; experiencia que apliqué al diseñar mi sistema para restaurantes.',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    slug: 'cotizador-taller',
    title: 'Cotizador del Taller',
    category: 'En producción',
    summary:
      'Aplicación web para generar cotizaciones y contratos de un taller de soldadura, hoy en uso diario.',
    description:
      'Digitaliza un proceso que antes era manual: desde el mensaje de WhatsApp del cliente hasta la cotización, el contrato listo para firmar y la nota de venta. Los datos se guardan en un archivo Excel que el propio taller controla.',
    icon: 'flame',
    modules: ['Cotizaciones', 'Contratos', 'Ventas', 'Clientes'],
    highlights: [
      'Extrae nombre, DNI o RUC, celular y lugar a partir del mensaje de WhatsApp del cliente.',
      'Calcula cada trabajo (portones, rejas, techos…) por ancho, alto y piezas.',
      'Genera la cotización en A4 y el contrato listo para firmar, y envía el resumen por WhatsApp.',
      'Emite notas de venta con número correlativo, en ticket de 80 mm o A4, con QR.',
      'Panel mensual con lo cotizado, aceptado, cobrado y por cobrar.',
    ],
    tech: ['Angular', 'TypeScript', 'Excel', 'Capacitor'],
    repos: [{ label: 'Ver código', url: `${GITHUB}/Sistema_taller-` }],
  },
  {
    slug: 'restaurante',
    title: 'Gestión para Restaurante',
    category: 'Académico',
    summary:
      'Sistema integral con módulos de Administración, Mozo, Cocina y Caja.',
    description:
      'Sistema integral para la operación de un restaurante, inspirado en mi experiencia atendiendo al público como mozo.',
    icon: 'utensils',
    modules: ['Administración', 'Mozo', 'Cocina', 'Caja'],
    highlights: [
      'Administración: roles y auditoría.',
      'Mozo: toma de pedidos.',
      'Cocina: comandas en tiempo real.',
      'Caja: pagos, comprobantes y backups automáticos.',
    ],
    tech: ['Angular', 'Bootstrap', 'Java', 'Spring Boot', 'JSP', 'MySQL', 'PostgreSQL'],
    repos: [],
  },
  {
    slug: 'clinica-veterinaria',
    title: 'Clínica Veterinaria',
    category: 'Académico',
    summary:
      'Aplicación full stack con frontend y backend separados para gestionar pacientes, citas e historias clínicas.',
    description:
      'Aplicación full stack con frontend y backend separados, conectados por una API REST, para administrar la operación diaria de una clínica veterinaria.',
    icon: 'pulse',
    modules: ['Pacientes', 'Citas', 'Historias', 'Ventas'],
    highlights: [
      'Autenticación con JWT y vistas por rol: administrador, veterinario y vendedor.',
      'Agenda visual de citas con validación de horarios y conflictos.',
      'Historial médico centralizado y búsqueda rápida por DNI.',
      'Generación de comprobantes de cita en PDF.',
    ],
    tech: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'API REST'],
    repos: [{ label: 'Ver frontend', url: `${GITHUB}/ClinicaVeterinaria_Frontend-master` }],
  },
  {
    slug: 'puriy-ayacucho',
    title: 'Puriy Ayacucho',
    category: 'Ponti Emprende',
    summary: 'Propuesta de aplicación para promover el turismo y la cultura de Ayacucho.',
    description:
      'Proyecto de emprendimiento presentado en el programa Ponti Emprende de la Escuela Superior La Pontificia (ELP): una propuesta de aplicación para promover el turismo y la cultura de Ayacucho.',
    icon: 'map',
    modules: ['Turismo', 'Cultura', 'Ayacucho'],
    highlights: ['Presentado en el programa Ponti Emprende (ELP).'],
    tech: [],
    repos: [],
  },
  {
    slug: 'gestion-de-citas',
    title: 'Gestión de Citas',
    category: 'Prototipo',
    summary: 'Prototipo académico para la gestión de citas, desarrollado con Java.',
    description: 'Prototipo académico para la gestión de citas, con frontend y backend en repositorios separados.',
    icon: 'calendar',
    modules: ['Citas', 'Frontend', 'Backend'],
    highlights: [],
    tech: ['Java'],
    repos: [
      { label: 'Ver frontend', url: `${GITHUB}/GestionDeCitasFront` },
      { label: 'Ver backend', url: `${GITHUB}/GestionDeCitasBackend-` },
    ],
  },
  {
    slug: 'pension65',
    title: 'Pension65.Api',
    category: 'Prototipo',
    summary: 'Prototipo académico con API en C# / .NET y su frontend.',
    description: 'Prototipo académico con una API en C# / .NET y su frontend en un repositorio separado.',
    icon: 'users',
    modules: ['API', 'Frontend'],
    highlights: [],
    tech: ['C#', '.NET', 'TypeScript'],
    repos: [
      { label: 'Ver API', url: `${GITHUB}/Pension65.Api` },
      { label: 'Ver frontend', url: `${GITHUB}/Pension65-Frontend` },
    ],
  },
  {
    slug: 'botica-online',
    title: 'BoticaOnline',
    category: 'Prototipo',
    summary: 'Prototipo académico desarrollado en C# / .NET.',
    description: 'Prototipo académico desarrollado en C# / .NET.',
    icon: 'pill',
    modules: ['C#', '.NET'],
    highlights: [],
    tech: ['C#', '.NET'],
    repos: [{ label: 'Ver código', url: `${GITHUB}/BoticaOnline` }],
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    title: 'Excel Avanzado',
    issuer: 'UPC – Becas Grupo Romero',
    date: 'Abril 2024',
    detail: '10 horas académicas',
    image: 'certificados/excel-avanzado.webp',
  },
  {
    title: 'DreamBuilder',
    issuer: 'Thunderbird School of Global Management – Arizona State University',
    date: 'Julio 2023',
    image: 'certificados/dreambuilder.webp',
  },
];

export const TECH_GROUPS: TechGroup[] = [
  {
    title: 'Lenguajes',
    items: [
      { name: 'Java', icon: 'java' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'C#', icon: 'csharp' },
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css3' },
      { name: 'SQL', glyph: 'SQL' },
    ],
  },
  {
    title: 'Frameworks',
    items: [
      { name: 'Spring Boot', icon: 'spring' },
      { name: 'Angular', icon: 'angular' },
      { name: '.NET', icon: 'dotnetcore' },
      { name: 'Bootstrap', icon: 'bootstrap' },
      { name: 'JSP / JSF', glyph: 'JSP' },
      { name: 'API REST', glyph: 'API' },
    ],
  },
  {
    title: 'Bases de datos',
    items: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'SQL Server', icon: 'microsoftsqlserver' },
    ],
  },
  {
    title: 'Herramientas',
    items: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Maven', icon: 'maven' },
      { name: 'IntelliJ IDEA', icon: 'intellij' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'Excel', glyph: 'XLS' },
      { name: 'LaTeX', icon: 'latex' },
    ],
  },
];

export const TECH_ICON_BY_NAME: Record<string, string> = Object.fromEntries(
  TECH_GROUPS.flatMap((g) => g.items)
    .filter((i) => i.icon)
    .map((i) => [i.name, i.icon as string]),
);

export const STATS = [
  { value: PROJECTS.length, label: 'Proyectos', note: 'Incluye prototipos' },
  { value: CERTIFICATES.length, label: 'Certificados', note: 'UPC y Thunderbird' },
  { value: 1, label: 'En producción', note: 'Uso diario en el taller' },
];
