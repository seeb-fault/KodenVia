import type { ProjectDetails } from "../lib/project-details";

type PortfolioEntry = {
  repo: string;
  title: string;
  description: string;
  tags: string[];
  featured: boolean;
  details: ProjectDetails;
};

export const COMPANY_PORTFOLIO: PortfolioEntry[] = [
  {
    repo: "noe-crm-circulo-abogados",
    title: "CRM para el Círculo de Abogados",
    description:
      "Plataforma web de gestión institucional en desarrollo, con gestión de contactos, campañas, comunicaciones y datos de estudiantes y diplomados. Incluye trabajo de integración con WhatsApp Cloud API.",
    tags: ["CRM", "WhatsApp Cloud API"],
    featured: true,
    details: {
      contributor: "Noe Santiago",
      role: "Desarrollador principal y responsable técnico",
      period: "2026 - actualidad",
      status: "development",
      context: "Proyecto institucional",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Desarrollo de la plataforma y decisiones técnicas.",
        "Gestión de contactos, campañas y comunicaciones.",
        "Gestión de información de estudiantes y programas de diplomados.",
        "Diseño de interfaces administrativas y mejoras de experiencia de usuario.",
        "Trabajo de integración con WhatsApp Cloud API.",
        "Planificación de una evolución hacia un CRM SaaS multiempresa; suscripciones y planes todavía en planificación.",
      ],
    },
  },
  {
    repo: "noe-qatu",
    title: "Qatu - Marketplace de productos y servicios",
    description:
      "Proyecto independiente de comercio electrónico dirigido inicialmente a Ayacucho. Contempla compra y venta, alquiler de bienes y contratación de servicios, con mecanismos de confianza y resolución de incidencias en diseño.",
    tags: ["Angular", "Git", "GitHub"],
    featured: true,
    details: {
      contributor: "Noe Santiago",
      role: "Creador, desarrollador y responsable de arquitectura",
      period: "2025 - 2026",
      status: "development",
      context: "Proyecto independiente",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Diseño de módulos de compra, venta, alquiler y contratación de servicios.",
        "Desarrollo del frontend con Angular.",
        "Organización de arquitectura y contratos de API.",
        "Diseño de garantías, evidencias fotográficas y resolución de incidencias.",
        "Planificación de recomendaciones y búsqueda asistida por inteligencia artificial.",
      ],
    },
  },
  {
    repo: "noe-ceba-lt",
    title: "CEBA-LT - Gestión educativa",
    description:
      "Aplicación web de gestión educativa en desarrollo, con API REST, interfaz web y servicios de infraestructura configurados mediante contenedores.",
    tags: ["Go", "Next.js", "React", "PostgreSQL", "Redis", "Docker"],
    featured: true,
    details: {
      contributor: "Noe Santiago",
      role: "Desarrollador Full Stack",
      period: "2024",
      status: "development",
      context: "Proyecto de gestión educativa",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Desarrollo de API REST con Go e interfaz con Next.js y React.",
        "Configuración de PostgreSQL, Redis y entornos Docker.",
        "Gestión de migraciones y endpoints de verificación de salud.",
        "Organización y automatización de tareas mediante Makefile.",
      ],
    },
  },
  {
    repo: "noe-botcrm",
    title: "BotCRM - CRM y automatización",
    description:
      "Prototipo funcional en entorno local para explorar gestión de clientes, automatización y comunicación empresarial. No cuenta con un despliegue público confirmado.",
    tags: ["PostgreSQL", "Docker", "RustFS", "S3"],
    featured: false,
    details: {
      contributor: "Noe Santiago",
      role: "Desarrollador y responsable de integración",
      period: "2026",
      status: "prototype",
      context: "Prototipo local",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Configuración y puesta en funcionamiento del panel administrativo y API.",
        "Integración de PostgreSQL y configuración de servicios mediante contenedores.",
        "Preparación de almacenamiento compatible con S3 mediante RustFS.",
        "Pruebas de servicios y endpoints; exploración de automatización empresarial.",
      ],
    },
  },
  {
    repo: "noe-calmia",
    title: "CalmIA - Bienestar estudiantil",
    description:
      "Propuesta académica de investigación en fase de planteamiento y diseño. Explora una solución tecnológica orientada al bienestar estudiantil y al estrés relacionado con el autosabotaje académico.",
    tags: ["Inteligencia artificial", "IoT", "Diseño de solución"],
    featured: false,
    details: {
      contributor: "Noe Santiago",
      role: "Investigador y diseñador de la solución tecnológica",
      period: "2026",
      status: "research",
      context: "Investigación académica; componentes propuestos",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Planteamiento de asistencia personalizada mediante inteligencia artificial.",
        "Propuesta de una aplicación móvil gamificada y sensores IoT.",
        "Evaluación de un asistente de voz, con Alexa como una alternativa.",
        "Los componentes descritos corresponden a la propuesta; no se presenta como producto implementado ni validado.",
      ],
    },
  },
  {
    repo: "noe-portafolio",
    title: "Portafolio profesional de desarrollo",
    description:
      "Desarrollo y configuración de un sitio profesional para presentar proyectos, tecnologías y trayectoria. Trabajo frontend con Next.js y React, entorno de desarrollo con Bun y control de versiones con Git.",
    tags: ["Next.js", "React", "Bun", "Git"],
    featured: false,
    details: {
      contributor: "Noe Santiago",
      role: "Desarrollador frontend",
      period: "Octubre de 2026 - actualidad",
      status: "development",
      context: "Proyecto personal",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Configuración de Next.js y React para la presentación profesional.",
        "Gestión de dependencias y ejecución del entorno mediante Bun.",
        "Organización del código con Git. Publicación pendiente.",
      ],
    },
  },
  {
    repo: "brayam-academiapp-v2",
    title: "AcademiApp v2 - Tutor inteligente",
    description:
      "Nueva versión de AcademiApp, desarrollada como parte de una tesis de pregrado en la UNSCH. Acompaña al estudiante con un modelo de su dominio del conocimiento, recomendaciones adaptativas y un tutor que responde con conocimiento validado.",
    tags: ["Flutter", "Dart", "Firebase", "Clean Architecture", "RAG"],
    featured: true,
    details: {
      contributor: "Brayam Espino",
      role: "Desarrollador principal y responsable de arquitectura",
      period: "Octubre de 2026 - actualidad",
      status: "development",
      context: "Tesis de pregrado, UNSCH",
      repositoryUrl: "https://github.com/elvisllampasi27-oss/academiapp_v2",
      projectUrl: null,
      highlights: [
        "Arquitectura limpia organizada por módulos: identidad, matrícula, evaluación, modelo del estudiante, motor adaptativo y tutor.",
        "Modelo del estudiante con Bayesian Knowledge Tracing para estimar el dominio de cada tema.",
        "Tutor con recuperación aumentada (RAG) que responde solo con conocimiento validado; generación con LLM todavía pendiente.",
        "Registro, inicio de sesión y perfiles con roles en Firebase Auth y Cloud Firestore, con pruebas automatizadas.",
      ],
    },
  },
  {
    repo: "brayam-academiapp",
    title: "AcademiApp - Plataforma de estudio móvil",
    description:
      "Aplicación móvil de preparación académica con contenido por cursos, exámenes, tutor con inteligencia artificial, planes premium y panel de administración, construida sobre servicios en la nube de Firebase.",
    tags: ["Flutter", "Dart", "Firebase", "Cloud Functions", "Gemini"],
    featured: true,
    details: {
      contributor: "Brayam Espino",
      role: "Desarrollador principal",
      period: "2026 - actualidad",
      status: "development",
      context: "Proyecto independiente; en mejora continua",
      repositoryUrl: "https://github.com/elvisllampasi27-oss/academiapp",
      projectUrl: null,
      highlights: [
        "Módulos de contenido, exámenes, quizzes, rendimiento y notificaciones push.",
        "Tutor con inteligencia artificial mediante Gemini, siempre a través de Cloud Functions.",
        "Pagos con Culqi y Yape, con revisión de comprobantes desde un panel de administración.",
        "Reglas de seguridad en Firestore y Storage, y documentación por especificaciones (SDD).",
      ],
    },
  },
  {
    repo: "brayam-gestion-dental",
    title: "Sistema de gestión para clínica dental",
    description:
      "Sistema web de gestión para una clínica dental, con panel administrativo, control de acceso por roles y una página pública para los pacientes.",
    tags: ["React", "Node.js", "Express", "MySQL", "Docker"],
    featured: false,
    details: {
      contributor: "Brayam Espino",
      role: "Desarrollador principal",
      period: "2026",
      status: "prototype",
      context: "Proyecto para una clínica; nombre reservado",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Gestión de pacientes, citas, tratamientos, pagos e historial clínico.",
        "Roles de administrador, doctor y personal, con permisos diferenciados y registro de actividad.",
        "API REST con Node.js y Express sobre MySQL, panel en React y despliegue con Docker Compose.",
        "Integración continua con Jenkins y análisis de calidad con SonarQube.",
      ],
    },
  },
  {
    repo: "brayam-yachayai",
    title: "YachayAI - Práctica para hablar en público",
    description:
      "Aplicación móvil en etapa de especificación para que las personas practiquen y mejoren su forma de hablar en público.",
    tags: ["Flutter", "Dart", "Inteligencia artificial"],
    featured: false,
    details: {
      contributor: "Brayam Espino",
      role: "Creador y diseñador de la solución",
      period: "2026",
      status: "research",
      context: "Documentación por especificaciones (SDD); desarrollo no iniciado",
      repositoryUrl: null,
      projectUrl: null,
      highlights: [
        "Definición de requisitos y especificaciones mediante desarrollo guiado por especificaciones (SDD).",
        "Planteamiento de una app móvil en Flutter para practicar presentaciones orales.",
        "Los componentes descritos corresponden a la propuesta; no se presenta como producto implementado.",
      ],
    },
  },
  {
    repo: "brayam-gestion-academica-hexagonal",
    title: "Sistema de gestión académica - Arquitectura hexagonal",
    description:
      "Aplicación de consola en Java para gestionar estudiantes y cursos aplicando puertos y adaptadores. Los datos se guardan en JSON o en PostgreSQL sin modificar los casos de uso.",
    tags: ["Java", "Maven", "PostgreSQL", "Arquitectura hexagonal"],
    featured: false,
    details: {
      contributor: "Brayam Espino",
      role: "Desarrollador",
      period: "Octubre de 2026",
      status: "prototype",
      context: "Laboratorio de Arquitectura de Software, UNSCH",
      repositoryUrl: "https://github.com/elvisllampasi27-oss/SistemaGestionAcademica-Hexagonal",
      projectUrl: null,
      highlights: [
        "Separación en dominio, aplicación, infraestructura y presentación con puertos de entrada y salida.",
        "Adaptadores de persistencia intercambiables para JSON y PostgreSQL.",
        "Validación de identificadores duplicados e inexistentes en los casos de uso.",
        "Desarrollo por ramas de funcionalidad integradas en la rama principal.",
      ],
    },
  },
  {
    repo: "brayam-sistema-gestion-academica",
    title: "Sistema de gestión académica - Arquitectura en capas",
    description:
      "Sistema de consola en Java para gestionar estudiantes, docentes, cursos, matrículas y calificaciones, con generación de reportes y una arquitectura de tres capas.",
    tags: ["Java", "Maven", "JSON"],
    featured: false,
    details: {
      contributor: "Brayam Espino",
      role: "Desarrollador",
      period: "Septiembre de 2026",
      status: "prototype",
      context: "Curso de Construcción y Evolución de Software, UNSCH",
      repositoryUrl: "https://github.com/elvisllampasi27-oss/sistema-gestion-academica",
      projectUrl: null,
      highlights: [
        "Arquitectura de presentación, lógica de negocio y acceso a datos con responsabilidades separadas.",
        "Gestión de matrículas y calificaciones con reportes agregados.",
        "Persistencia en archivos JSON mediante repositorios.",
        "Historial de versiones documentado con releases y registro de cambios.",
      ],
    },
  },
];

export const COMPANY_TECHNOLOGIES = [
  { name: "JavaScript", iconPath: "/skills/javascript.svg", category: "Lenguajes" },
  { name: "TypeScript", iconPath: "/skills/typescript.svg", category: "Lenguajes" },
  { name: "Python", iconPath: "/skills/python.svg", category: "Lenguajes" },
  { name: "Go", iconPath: "/skills/go.svg", category: "Lenguajes" },
  { name: "Java", iconPath: "/skills/java.svg", category: "Lenguajes" },
  { name: "Angular", iconPath: "/skills/angular.svg", category: "Interfaces web" },
  { name: "React", iconPath: "/skills/react.svg", category: "Interfaces web" },
  { name: "Next.js", iconPath: "/skills/nextjs.png", category: "Interfaces web" },
  { name: "PostgreSQL", iconPath: "/skills/postgresql.svg", category: "Datos e infraestructura" },
  { name: "Redis", iconPath: "/skills/redis.svg", category: "Datos e infraestructura" },
  { name: "Docker", iconPath: "/skills/docker.png", category: "Datos e infraestructura" },
  { name: "Git", iconPath: "/skills/git.svg", category: "Herramientas de desarrollo" },
  { name: "GitHub", iconPath: "/skills/github.svg", category: "Herramientas de desarrollo" },
];
