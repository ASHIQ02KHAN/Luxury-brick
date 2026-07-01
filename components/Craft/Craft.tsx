"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Craft.module.css";

export default function Craft() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        imageRef.current,
        { opacity: 0, x: -60, clipPath: "inset(0% 100% 0% 0%)" },
        { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power3.out" }
      ).fromTo(
        textRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      // Animate individual text items
      const items = textRef.current?.querySelectorAll(`.${styles.animItem}`);
      if (items) {
        tl.fromTo(
          items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
          "-=0.4"
        );
      }
    };

    initGSAP();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className={styles.craft}
      aria-label="The craft behind the brick"
    >
      <div className={styles.container}>
        {/* Image Side */}
        <div ref={imageRef} className={styles.imageWrap}>
          <Image
            src="/brick-texture.png"
            alt="Extreme close-up of THE MONOLITH brick surface, showing carbon core grain"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority={false}
          />
          <div className={styles.imageCaption}>
            <span>Surface Detail · 12× Magnification</span>
          </div>
        </div>

        {/* Text Side */}
        <div ref={textRef} className={styles.textContent}>
          <span className={`${styles.sectionLabel} ${styles.animItem}`}>
            The Craft
          </span>
          <h2 className={`${styles.title} ${styles.animItem}`}>
            Raw Earth.
            <br />
            <em>Perfected.</em>
          </h2>
          <p className={`${styles.body} ${styles.animItem}`}>
            Every MONOLITH begins as hand-sourced alluvial clay, harvested from
            a single geological deposit. No synthetic binders. No industrial
            shortcuts.
          </p>
          <p className={`${styles.body} ${styles.animItem}`}>
            It is extruded, wire-cut, and then fired in a tunnel kiln at{" "}
            <strong>1,050°C</strong> for exactly 32 hours — the precise
            threshold at which silica undergoes vitrification, locking in
            structural perfection for half a millennium.
          </p>

          <div className={`${styles.statRow} ${styles.animItem}`}>
            {[
              { val: "32h", lbl: "Kiln Duration" },
              { val: "1050°", lbl: "Peak Temperature" },
              { val: "0", lbl: "Synthetic Additives" },
            ].map((s) => (
              <div key={s.lbl} className={styles.stat}>
                <div className={styles.statVal}>{s.val}</div>
                <div className={styles.statLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
