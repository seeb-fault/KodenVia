# Colaboración en GitHub

Repositorio: [seeb-fault/KodenVia](https://github.com/seeb-fault/KodenVia). Rama principal: `main`.

## Ramas y Pull Requests

1. Actualiza `main` con `git pull --ff-only` y crea una rama, por ejemplo `git switch -c feat/nueva-funcion`.
2. Realiza un cambio concreto y actualiza `version` en `package.json`.
3. Ejecuta lint, formato, ortografía, tipos y pruebas. Para cambios que afecten a la aplicación, comprueba también la compilación y las pruebas de navegador.
4. Publica la rama y abre una PR hacia `main`. Describe el problema, el resultado y la validación.
5. Usa un título Conventional Commit de hasta 50 caracteres, por ejemplo `fix: correct contact link`.
6. Espera a que pasen `quality`, `package.json version bumped` y `PR title`. Revisa el diff y solicita la revisión del otro socio cuando corresponda.
7. Fusiona con squash. Elimina la rama cuando la PR esté integrada.

Las plantillas de Issues permiten reportar errores y proponer mejoras. La plantilla de PR pide un resumen y su validación; las etiquetas se asignan según los archivos modificados.

## Integración continua

El workflow CI usa Node.js 24, Bun 1.4.2 y PostgreSQL 16 temporal. Ejecuta las comprobaciones del código, las pruebas unitarias y de componentes, migraciones, carga inicial, build con webpack, comprobaciones de rutas y rendimiento, y pruebas de Chromium contra producción. Los datos y contraseñas de CI son temporales y no son credenciales de producción.

El informe de Playwright queda disponible como artefacto durante siete días. CI se ejecuta al abrir o actualizar PRs, al publicar cambios en `main` y manualmente desde Actions. Las releases automáticas solo se generan después de un CI aprobado sobre un push a `main`.

## Configuración que requiere al propietario

La cuenta que prepara esta publicación, `santiago-noe`, tiene acceso de escritura pero no de administración. El propietario `seeb-fault` debe configurar estas opciones si desea que GitHub las haga obligatorias:

- En Settings, Rules o Branches, protege `main` y exige Pull Requests, resolución de conversaciones y los checks `quality`, `package.json version bumped` y `PR title`. Desactiva force pushes y eliminación de la rama principal.
- En Settings, General, permite squash merge y desactiva los otros métodos si quieres imponer un historial lineal.
- Cuando ambos socios tengan acceso de escritura y puedan revisar, exige una aprobación por PR.
- Activa Discussions en Settings, General si van a usar preguntas y respuestas de la comunidad.

Estas opciones son recomendaciones de configuración; no están aplicadas por los archivos YAML. La cuenta administradora debe comprobar que los workflows están habilitados y que las protecciones corresponden al plan y visibilidad del repositorio.

## Badges y logros

El badge de CI del README refleja el resultado real de GitHub Actions. El de licencia identifica la licencia MIT conservada en `LICENSE`.

Los Achievements son logros del perfil, distintos de esos badges. GitHub los concede automáticamente según eventos y contribuciones de una cuenta. Un workflow no puede asignarlos y su aparición no se garantiza. Las PRs y commits deben representar trabajo real, con la autoría de quien lo realizó. Las contribuciones de esta publicación corresponden a `santiago-noe`; ser propietario del repositorio no transfiere la autoría de las PRs a `seeb-fault`.

Para avanzar de forma natural, publica mejoras mediante PRs, colabora con el otro socio y participa con respuestas útiles cuando Discussions esté habilitado. La documentación oficial permite [consultar los logros del perfil](https://docs.github.com/en/account-and-profile/reference/profile-reference) y [gestionar su visibilidad](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements).
