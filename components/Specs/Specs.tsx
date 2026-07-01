"use client";

import { useEffect, useRef } from "react";
import styles from "./Specs.module.css";

const SPECS = [
  {
    id: "spec-sio2",
    value: "58%",
    label: "SiO₂ Content",
    desc: "Pure silica. Zero synthetic additives.",
  },
  {
    id: "spec-carbon",
    value: "0.0",
    unit: "kg CO₂",
    label: "Carbon Footprint",
    desc: "After full curing. Net zero since manufacture.",
  },
  {
    id: "spec-lifespan",
    value: "500+",
    unit: "Years",
    label: "Structural Lifespan",
    desc: "Older than most nations. Built to outlast all of them.",
  },
  {
    id: "spec-temp",
    value: "1050",
    unit: "°C",
    label: "Kiln Temperature",
    desc: "Fired at peak vitrification. Maximum density achieved.",
  },
  {
    id: "spec-weight",
    value: "2.27",
    unit: "kg",
    label: "Calibrated Mass",
    desc: "Precisely balanced. Industry-standard to the gram.",
  },
  {
    id: "spec-water",
    value: "≤8%",
    label: "Water Absorption",
    desc: "Near-impermeable surface. Weather-resistant by nature.",
  },
];

export default function Specs() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const initGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, clipPath: "inset(100% 0% 0% 0%)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.7,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          }
        );
      });
    };

    initGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs"
      className={styles.specs}
      aria-label="Product specifications"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Technical Specification</span>
          <h2 className={styles.sectionTitle}>The Numbers Don&apos;t Lie</h2>
        </div>
        <div className={styles.grid}>
          {SPECS.map((spec, i) => (
            <article
              key={spec.id}
              id={spec.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className={styles.card}
            >
              <div className={styles.cardValue}>
                {spec.value}
                {spec.unit && (
                  <span className={styles.cardUnit}>{spec.unit}</span>
                )}
              </div>
              <div className={styles.cardLabel}>{spec.label}</div>
              <p className={styles.cardDesc}>{spec.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
