"use client";

import { useEffect, useRef } from "react";
import styles from "./Manifesto.module.css";

const PILLARS = [
  {
    id: "pillar-1",
    stat: "NET ZERO",
    sub: "Since the Neolithic Era.",
    body: "Fired clay releases no volatile compounds. No synthetic resin. No petroleum-derived binder. The brick's carbon story ends the moment it leaves the kiln.",
  },
  {
    id: "pillar-2",
    stat: "∞ RECYCLABLE",
    sub: "Fully closed-loop material.",
    body: "At end of life, THE MONOLITH can be crushed into hardcore aggregate, returned to earth, or repurposed in perpetuity. Zero landfill obligation.",
  },
  {
    id: "pillar-3",
    stat: "PASSIVE",
    sub: "Thermal mass, naturally.",
    body: "High thermal mass absorbs daytime heat and releases it at night — reducing HVAC load by up to 22% in Mediterranean climates without a single watt of energy.",
  },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const initGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Dramatic headline reveal
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        }
      );

      // Pillars stagger in
      pillarsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
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
      id="manifesto"
      className={styles.manifesto}
      aria-label="Sustainability manifesto"
    >
      <div className={styles.container}>
        {/* Big Statement */}
        <div ref={headlineRef} className={styles.statement}>
          <span className={styles.sectionLabel}>Sustainability</span>
          <h2 className={styles.headline}>
            The greenest building material
            <br />
            <em>ever invented by accident.</em>
          </h2>
          <p className={styles.intro}>
            Long before carbon credits existed, the brick had already solved the
            problem. It is the original sustainable material — born from earth,
            built without chemistry, and designed to return to earth when its
            work is done.
          </p>
        </div>

        {/* Pillars */}
        <div className={styles.pillars}>
          {PILLARS.map((p, i) => (
            <article
              key={p.id}
              id={p.id}
              ref={(el) => {
                if (el) pillarsRef.current[i] = el;
              }}
              className={styles.pillar}
            >
              <div className={styles.pillarStat}>{p.stat}</div>
              <div className={styles.pillarSub}>{p.sub}</div>
              <p className={styles.pillarBody}>{p.body}</p>
            </article>
          ))}
        </div>

        {/* Large centered quote */}
        <blockquote className={styles.quote}>
          <p>
            &ldquo;Built from earth.
            <br />
            Lasts forever.&rdquo;
          </p>
          <cite>— THE MONOLITH Brand Manifesto, 2026</cite>
        </blockquote>
      </div>
    </section>
  );
}
