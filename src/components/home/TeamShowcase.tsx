"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { TEAM_MEMBERS } from "@/lib/team";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./TeamShowcase.module.css";

// Los retratos se muestran en la pose final: evita saltos bruscos entre sprites.
// Se mantienen los textos de especialidad, resumen y formación de TEAM_MEMBERS.
const PORTRAITS = [
  { id: "noe", displayName: "Noe Santiago", src: "/images/kodenvia/noe-pose.webp", glasses: false },
  {
    id: "elvis",
    displayName: "Elvis Espino",
    src: "/images/kodenvia/elvis-pose.webp",
    glasses: true,
  },
] as const;

function TeamPortrait({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();
  const profile = TEAM_MEMBERS[index];
  const person = PORTRAITS[index];

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--ry", `${x * 5}deg`);
    event.currentTarget.style.setProperty("--rx", `${-y * 3}deg`);
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--ry", "0deg");
    event.currentTarget.style.setProperty("--rx", "0deg");
  };

  return (
    <motion.div
      ref={ref}
      className={styles.person}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      animate={reduced || inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.82, delay: index * 0.14, ease: "easeOut" }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className={styles.figure}>
        <div className={styles.halo} aria-hidden="true" />
        <Image
          src={person.src}
          alt={`Retrato conceptual de ${person.displayName} con terno y brazos cruzados, ${person.glasses ? "con lentes" : "sin lentes"}`}
          fill
          sizes="(max-width: 720px) 85vw, 380px"
          className={styles.portrait}
        />
      </div>
      <div className={styles.details}>
        <span className={styles.overline}>0{index + 1} · Equipo fundador</span>
        <h3>{person.displayName}</h3>
        <p className={styles.specialty}>{profile.specialty}</p>
        <p>{profile.summary}</p>
        <p className={styles.education}>{profile.education}</p>
      </div>
    </motion.div>
  );
}

export function TeamShowcase() {
  return (
    <div className={styles.showcase}>
      <div className={styles.people}>
        {TEAM_MEMBERS.slice(0, PORTRAITS.length).map((member, index) => (
          <TeamPortrait key={member.name} index={index} />
        ))}
      </div>
    </div>
  );
}
