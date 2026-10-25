# Guía de contribución

Gracias por colaborar con Kodenvia. Esta guía resume cómo trabajamos en el repositorio.

## Antes de empezar

1. Clona el repositorio e instala las dependencias con `bun install`.
2. Copia `.env.example` a `.env.local` y completa las variables descritas en el README.
3. Activa las comprobaciones antes de cada push:

   ```bash
   git config core.hooksPath .githooks
   ```

## Ramas

La rama principal es `main` y no se trabaja directamente sobre ella. Crea una rama por cada cambio:

- `feat/descripcion` para nuevas funciones.
- `fix/descripcion` para correcciones.
- `docs/descripcion` para documentación.

## Commits y Pull Requests

- Los títulos siguen Conventional Commits, por ejemplo: `feat: agregar sección de servicios`.
- Crea un commit por cada cambio concreto y explica qué modificaste y por qué. Conserva esos commits al fusionar la PR mediante **Create a merge commit**, sin squash.
- Cada Pull Request incrementa la versión en `package.json`:
  - `fix` o `docs`: versión de parche (por ejemplo, 2.6.1 → 2.6.2).
  - `feat`: versión menor (por ejemplo, 2.6.1 → 2.7.0).
- Describe qué cambia y cómo probarlo.
- Conserva la autoría real de cada commit y respeta el formato de `.gitmessage`, sin añadir trailers de autoría.

## Comprobaciones

Antes de abrir un Pull Request, ejecuta:

```bash
bun run lint
bun run format:check
bun run check:spell
bun run typecheck
bun run test
```

CI repite estas comprobaciones y además valida la compilación y las pruebas de navegador.

## Seguridad

Nunca subas `.env.local`, contraseñas ni credenciales al repositorio.
