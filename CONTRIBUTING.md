\# Guía de contribución



Gracias por colaborar con Kodenvia. Esta guía resume cómo trabajamos en el repositorio.



\## Antes de empezar



1\. Clona el repositorio e instala las dependencias con `bun install`.

2\. Copia `.env.example` a `.env.local` y completa las variables descritas en el README.

3\. Activa las comprobaciones antes de cada push:



&#x20;  git config core.hooksPath .githooks



\## Ramas



La rama principal es `main` y no se trabaja directamente sobre ella. Crea una rama por cada cambio:



\- `feat/descripcion` para nuevas funciones.

\- `fix/descripcion` para correcciones.

\- `docs/descripcion` para documentación.



\## Commits y Pull Requests



\- Los títulos siguen Conventional Commits, por ejemplo: `feat: agregar sección de servicios`.

\- Cada Pull Request incrementa la versión en `package.json`:

&#x20; - `fix` o `docs`: versión de parche (2.6.0 → 2.6.1).

&#x20; - `feat`: versión menor (2.6.0 → 2.7.0).

\- Describe qué cambia y cómo probarlo.

\- Si trabajaste con otra persona, agrégala como coautora al final del mensaje del commit.



\## Comprobaciones



Antes de abrir un Pull Request, ejecuta:



&#x20;   bun run lint

&#x20;   bun run format:check

&#x20;   bun run check:spell

&#x20;   bun run typecheck

&#x20;   bun run test



CI repite estas comprobaciones y además valida la compilación y las pruebas de navegador.



\## Seguridad



Nunca subas `.env.local`, contraseñas ni credenciales al repositorio.

