/**
 * Ejecutar desde la raíz del repositorio: bun scripts/kodenvia-actualizar-fondos.mjs
 * Coloca las fotos en ./fondos-entrada, con nombres imagen1.jpg, 2.png, imagen3.webp, etc.
 * Convierte (sin ampliar artificialmente) a public/images/kodenvia/fondos/imagenN.webp
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { resolve, join, extname, basename } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = resolve(root, "fondos-entrada");
const target = resolve(root, "public/images/kodenvia/fondos");
const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
let files;
try {
  files = (await readdir(source)).filter((name) => allowed.has(extname(name).toLowerCase()));
} catch {
  console.error("Falta la carpeta fondos-entrada en la raíz de KodenVia.");
  process.exit(1);
}
const slots = new Map();
for (const file of files) {
  const name = basename(file, extname(file)).toLowerCase().trim();
  const match = name.match(/^(?:imagen[ _-]*)?([1-5])$/);
  if (!match) {
    console.warn(`Ignorada ${file}. Usa imagen1.jpg, 2.png, imagen3.webp, etc.`);
    continue;
  }
  const num = Number(match[1]);
  if (slots.has(num)) {
    console.error(`Hay dos imágenes para el número ${num}. Conserva solo una.`);
    process.exit(1);
  }
  slots.set(num, file);
}
if (!slots.size) {
  console.error("No hay imágenes válidas en fondos-entrada (imagen1 a imagen5).");
  process.exit(1);
}
await mkdir(target, { recursive: true });
for (const [num,file] of [...slots.entries()].sort((a,b) => a[0]-b[0])) {
  const src=join(source,file);
  const dest=join(target,`imagen${num}.webp`);
  const meta=await sharp(src).metadata();
  await sharp(src).rotate().resize({width:2400,height:1350,fit:"inside",withoutEnlargement:true})
    .webp({quality:85,effort:5}).toFile(dest);
  const after=await stat(dest);
  console.log(`imagen${num}: ${meta.width}x${meta.height} -> ${Math.round(after.size/1024)} KB${meta.width<1400 ? " (resolución baja; conviene sustituir)" : ""}`);
}
console.log("Fondos actualizados. Si bun run dev ya está abierto, recarga el navegador (Ctrl+F5).");
