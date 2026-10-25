# Publicación de Kodenvia

Kodenvia está publicada en [kodenvia.vercel.app](https://kodenvia.vercel.app), con PostgreSQL en Supabase. El CD requiere configurar las credenciales indicadas abajo. Vercel reserva Hobby para uso personal no comercial; revisa sus [condiciones de uso](https://vercel.com/docs/limits/fair-use-guidelines) al elegir el plan.

## 1. Crear la base de datos

Crea un proyecto independiente llamado `kodenvia` en [Supabase](https://supabase.com/dashboard). Guarda la contraseña en tu gestor de contraseñas. Elige una región cercana al servidor de Vercel y evita reutilizar una base de otro proyecto.

Desde **Connect**, obtén la conexión **Session pooler**, puerto `5432`, para la aplicación, las migraciones y la inicialización. En este proyecto las consultas paralelas quedaron bloqueadas con Transaction pooler, mientras que las mismas consultas con Session pooler terminaron en menos de dos segundos. Supabase documenta un posible conflicto entre el envío encadenado de consultas de Postgres.js y su pooler de transacciones. No cambies a Transaction pooler sin verificarlo con las consultas reales: [guía de Postgres.js](https://supabase.com/docs/guides/database/postgres-js).

Session pooler permite conexiones IPv4 desde GitHub Actions. Conserva la conexión completa como secreto; no la publiques en issues, commits ni mensajes. Sustituye `[YOUR-PASSWORD]`, codifica los caracteres especiales de la contraseña y comprueba que la ruta de base sea `/postgres`, sin comillas sobrantes.

Este sitio consulta PostgreSQL desde el servidor y no necesita la Data API de Supabase. Desactiva la Data API para este proyecto antes de cargar los datos, para evitar exponer las tablas del administrador mediante una API pública. Consulta [las conexiones de Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres).

## 2. Crear el proyecto de Vercel

Crea el proyecto `kodenvia` para el repositorio `seeb-fault/KodenVia`, con Next.js y la raíz del repositorio como directorio de trabajo. No selecciones la copia local anidada `KodenVia/`. La configuración del repositorio desactiva los despliegues automáticos de la integración Git para que GitHub Actions publique solo después de CI.

Configura las siguientes variables de **Production** en Vercel:

| Variable                               | Valor                                                           |
| -------------------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`                         | Conexión Session pooler de Supabase.                            |
| `NEXT_PUBLIC_SITE_URL`                 | `https://kodenvia.vercel.app` o dominio propio confirmado.      |
| `AUTH_SECRET`                          | Secreto aleatorio nuevo para producción.                        |
| `ADMIN_GITHUB_LOGIN`                   | `seeb-fault`, administrador elegido para producción.            |
| `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` | Credenciales de una aplicación OAuth de GitHub para producción. |
| `REVALIDATE_SECRET`                    | Secreto aleatorio nuevo para la actualización de contenido.     |

Registra la URL de callback `https://kodenvia.vercel.app/api/auth/callback/github` en la aplicación OAuth. Configura `BLOB_READ_WRITE_TOKEN` para subir imágenes y las variables de Resend para enviar notificaciones. Las credenciales locales de OAuth no se sustituyen automáticamente. Los secretos de la aplicación permanecen en Vercel: el CD solicita una compilación remota para utilizar también las variables de tipo Secret, que no se pueden descargar como variables normales.

## 3. Activar CD en GitHub

En el repositorio, configura estos **Actions secrets**, a nivel de repositorio o en el entorno `production`:

| Secreto                  | Uso                                               |
| ------------------------ | ------------------------------------------------- |
| `VERCEL_TOKEN`           | Token de Vercel con acceso al proyecto.           |
| `VERCEL_ORG_ID`          | Identificador de la cuenta o equipo del proyecto. |
| `VERCEL_PROJECT_ID`      | Identificador del proyecto de Vercel.             |
| `DATABASE_MIGRATION_URL` | Conexión Session pooler de Supabase.              |

Los identificadores de Vercel se obtienen al vincular el proyecto con Vercel CLI, mediante su API o desde sus ajustes. Crea un token dedicado para CD, limitado al equipo del proyecto y con una fecha de expiración; al renovarlo actualiza `VERCEL_TOKEN` en GitHub. No subas `.vercel/`, `.env.cd.local` ni `.env.production.local` al repositorio.

Configura las **Actions variables**:

| Variable              | Valor                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| `PRODUCTION_SITE_URL` | La misma URL HTTPS de `NEXT_PUBLIC_SITE_URL` en Vercel.               |
| `CD_ENABLED`          | `true`, únicamente cuando el resto de la configuración esté completo. |

El archivo `.github/workflows/deploy.yml` publica el commit exacto aprobado por CI para un push a `main`. Comprueba que sigue siendo el último commit y que tiene una ejecución de CI aprobada, ejecuta las migraciones, inicializa una base vacía, solicita la compilación webpack en Vercel, despliega y comprueba las rutas públicas. Los PRs no reciben credenciales de producción ni ejecutan migraciones sobre ella. Los despliegues se ejecutan en serie y no se cancelan a mitad de una migración.

Para repetir un despliegue desde GitHub, abre **Actions > CD > Run workflow**, selecciona `main` y ejecútalo. El modo manual también exige que el commit actual de `main` haya aprobado CI para un push; no permite saltarse los controles. Puedes desactivar nuevas ejecuciones poniendo `CD_ENABLED=false`.

## 4. Datos y comprobación

La inicialización carga el contenido de Kodenvia incluido en el código y conserva el contenido cuando ya existe un perfil. No copia automáticamente las ediciones de la base local. Antes del primer despliegue, revisa si hay cambios locales que deban migrarse por separado; conserva una copia de seguridad y no transfieras sesiones de autenticación ni secretos.

Comprueba la portada, los proyectos, la experiencia, los testimonios de demostración correctamente identificados y el acceso al administrador. Verifica también la URL canónica, OAuth y las funciones de subida y correo si están configuradas.

Antes de futuras migraciones, conserva una copia de seguridad de producción. Si falla la comprobación posterior al despliegue, el workflow marca el fallo, pero no revierte automáticamente ni el despliegue ni las migraciones. El rollback del código debe coordinarse con la compatibilidad del esquema.

Referencia del flujo de despliegue: [GitHub Actions con Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel).
