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
