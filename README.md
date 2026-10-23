# Kodenvia

**Tecnología que impulsa tu negocio.**

Sitio web empresarial de Kodenvia, una compañía fundada por **Noe Santiago y Brayam Espino** en Perú. Presenta nuestros servicios de desarrollo web, aplicaciones a medida y automatización, junto con el equipo y su trayectoria individual.

![Logo de Kodenvia](assets/logo.svg)

## Qué incluye

- Presentación de la empresa, equipo, servicios y contacto.
- Proyectos con responsable, rol, periodo, tecnologías y estado: desarrollo, prototipo o propuesta académica.
- Experiencia individual de cada socio. La trayectoria de Brayam está pendiente de incorporar.
- Tecnologías utilizadas por Noe y preguntas frecuentes.
- Testimonios con tarjetas animadas y formulario público. Las referencias reales requieren aprobación en el administrador; mientras no haya aprobadas se muestran cinco ejemplos identificados como demostración.
- Administrador protegido con GitHub OAuth para editar contenido y controlar la visibilidad de las secciones.
- Tema claro, oscuro y del sistema, paletas de color y metadatos para buscadores.

Los proyectos no se presentan como productos terminados ni clientes oficiales cuando esa condición no está confirmada. Los enlaces públicos se muestran únicamente cuando se han proporcionado.

## Tecnologías

Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, PostgreSQL, Drizzle ORM y Auth.js. Bun gestiona dependencias y comandos. Las imágenes subidas usan Vercel Blob y las notificaciones por correo usan Resend cuando se configuran estos servicios.

## Desarrollo local

Necesitas Bun, Node.js compatible con Next.js 16 y una base de datos PostgreSQL accesible.

```powershell
bun install
Copy-Item .env.example .env.local
```

Si `.env.local` ya existe, conserva sus valores. Completa las variables antes de iniciar el sitio:

| Variable                                               | Uso                                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `DATABASE_URL`                                         | Conexión a PostgreSQL. Obligatoria para iniciar y compilar.                         |
| `NEXT_PUBLIC_SITE_URL`                                 | URL canónica. En desarrollo: `http://localhost:4000`.                               |
| `AUTH_SECRET`                                          | Secreto aleatorio para las sesiones del administrador.                              |
| `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`                 | Credenciales de la aplicación OAuth de GitHub.                                      |
| `ADMIN_GITHUB_LOGIN`                                   | Usuario de GitHub autorizado para acceder al administrador.                         |
| `GITHUB_TOKEN`                                         | Opcional; mejora los límites de consulta de repositorios confirmados.               |
| `BLOB_READ_WRITE_TOKEN`                                | Necesario para subir imágenes a Vercel Blob.                                        |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL` | Notificaciones de nuevas referencias; el remitente debe estar verificado en Resend. |
| `REVALIDATE_SECRET`                                    | Secreto del endpoint de actualización de contenido.                                 |
| `NEXT_PUBLIC_GTAG_ID`                                  | Opcional; identificador de Google Analytics.                                        |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION_TOKEN`                | Opcional; verificación de Search Console.                                           |

Puedes generar `AUTH_SECRET` con `openssl rand -base64 32`. Nunca subas `.env.local` ni credenciales al repositorio.

Aplica las migraciones, carga el contenido inicial y levanta el servidor:

```powershell
bun --env-file=.env.local run db:migrate
bun --env-file=.env.local run db:seed
bun run dev
```

Abre [localhost:4000](http://localhost:4000). La carga inicial conserva el contenido si ya existe un perfil de empresa.

En el entorno local ya preparado, PostgreSQL está en el contenedor `portfolio-nextjs-db`, puerto `55432`, con almacenamiento persistente. Puedes iniciarlo con `docker start portfolio-nextjs-db`; las credenciales están en tu `.env.local`.

## Administración y contenido

Accede a `/login` con el usuario indicado en `ADMIN_GITHUB_LOGIN` y entra a `/admin`. Registra `http://localhost:4000/api/auth/callback/github` como callback de la aplicación OAuth para desarrollo. Ajusta la URL al dominio real en producción.

| Archivo o carpeta                                  | Contenido                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| `src/lib/seo/site.ts`                              | Marca, lema, correo, teléfono y WhatsApp.                                |
| `src/lib/team.ts`                                  | Perfiles de los socios.                                                  |
| `src/lib/company-socials.ts`                       | Redes incluidas en la carga inicial.                                     |
| `src/db/company-portfolio.ts`                      | Proyectos y tecnologías de la carga inicial.                             |
| `src/lib/demo-references.ts`                       | Textos ilustrativos de testimonios, separados de las referencias reales. |
| `src/app/admin/`                                   | Edición del contenido guardado en PostgreSQL.                            |
| `src/db/schema.ts`, `drizzle/`                     | Modelo de datos y migraciones.                                           |
| `src/components/home/`, `src/components/sections/` | Secciones públicas del sitio.                                            |

Editar los archivos de carga inicial no sobrescribe automáticamente la base de datos existente. Usa el administrador para las ediciones habituales. El comando local `bun --env-file=.env.local run src/db/load-company-portfolio.ts` permite volver a importar la trayectoria proporcionada: respalda los datos y actualiza proyectos, experiencias y tecnologías. Úsalo solo cuando quieras reemplazar esos contenidos.

## Comandos y comprobaciones

```powershell
bun run dev
bun run lint
bun run format:check
bun run check:spell
bun run typecheck
bun run test
bun run build
bun run start
```

El servidor de desarrollo usa el puerto `4000`; producción usa `3000` por defecto. La compilación utiliza **webpack** por compatibilidad con `sharp` y necesita una base de datos migrada y con contenido porque genera la portada durante el build.

Con producción en marcha, ejecuta `bun run check:routes` y `bun run check:vitals`. Puedes configurar `BASE_URL` para otro puerto. Los presupuestos de rendimiento se comprueban contra producción.

Para activar las comprobaciones antes de cada push:

```powershell
git config core.hooksPath .githooks
```

## Publicación

Configura una base PostgreSQL de producción, las variables del entorno y el dominio definitivo en `NEXT_PUBLIC_SITE_URL`. Aplica las migraciones y carga el contenido inicial antes del primer build. Configura OAuth, Blob y correo para habilitar las funciones que los usan.

El proyecto incluye configuración para Vercel. Los cambios desde el administrador actualizan el sitio; la regeneración periódica está fijada en 12 horas para controlar consultas y costes de base de datos. No publiques los testimonios de demostración como referencias verificadas.

## Contacto

- Correo: [sebbfaultsoul@gmail.com](mailto:sebbfaultsoul@gmail.com)
- WhatsApp: [+51 945 984 518](https://wa.me/51945984518)
- GitHub de Noe: [santiago-noe](https://github.com/santiago-noe)
- LinkedIn de Noe: [Santiago Noe](https://www.linkedin.com/in/santiago-noe/)
- Instagram de Noe: [santiago_nys](https://www.instagram.com/santiago_nys/)
- Telegram: [+51 945 984 518](https://t.me/+51945984518)

## Licencia

Este proyecto deriva de un portafolio distribuido bajo licencia MIT. Se conserva íntegramente el archivo [LICENSE](LICENSE), incluido el aviso de copyright original.
