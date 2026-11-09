"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./AyacuchoHeroBackdrop.module.css";

// Para cambiar los paisajes solo sustituye imagen1.webp ... imagen5.webp.
// Las fotos se generan desde fondos-entrada con: bun scripts/kodenvia-actualizar-fondos.mjs
const LANDSCAPES = [
  { src: "/images/kodenvia/fondos/imagen1.webp", position: "center 52%" },
  { src: "/images/kodenvia/fondos/imagen2.webp", position: "center 50%" },
  { src: "/images/kodenvia/fondos/imagen3.webp", position: "center 50%" },
  { src: "/images/kodenvia/fondos/imagen4.webp", position: "center 50%" },
  { src: "/images/kodenvia/fondos/imagen5.webp", position: "center 54%" },
] as const;

const INTERVAL_MS = 6500;

export function AyacuchoHeroBackdrop() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((previous) => (previous + 1) % LANDSCAPES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  return (
    <div className={styles.scene} aria-label="Carrusel de paisajes de KodenVia">
      {LANDSCAPES.map((landscape, index) => (
        <div
          key={landscape.src}
          aria-hidden="true"
          className={`${styles.photo} ${index === active ? styles.visible : ""}`}
        >
          <Image
            alt=""
            src={landscape.src}
            fill
            priority={index === 0}
            sizes="100vw"
            className={styles.image}
            style={{ objectPosition: landscape.position }}
          />
        </div>
      ))}
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.identity} aria-hidden="true">
        <span className={styles.identityDot} /> KodenVia · Perú
      </div>
      <div
        className={styles.pagination}
        role="group"
        aria-label="Paisajes del encabezado"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
      >
        {LANDSCAPES.map((landscape, index) => (
          <button
            key={landscape.src}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Ver imagen ${index + 1} de ${LANDSCAPES.length}`}
            aria-current={index === active ? "true" : undefined}
            className={`${styles.dot} ${index === active ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
