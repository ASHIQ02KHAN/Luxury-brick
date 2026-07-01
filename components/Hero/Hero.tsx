"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./Hero.module.css";

// Dynamic import to prevent SSR of WebGL canvas
const BrickScene = dynamic(() => import("@/components/BrickScene/BrickScene"), {
  ssr: false,
  loading: () => <div className={styles.canvasPlaceholder} />,
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wireframeLabelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const initGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Pin the hero for 2× viewport scroll distance
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          scrub: 1.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollRef.current = self.progress;
          },
        });

        // Fade out overlay text during first 25% of scroll
        gsap.to(overlayRef.current, {
          opacity: 0,
          y: -50,
          ease: "power2.in",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=50%",
            scrub: 1,
          },
        });

        // Wireframe label fades IN after 55% scroll
        gsap.fromTo(
          wireframeLabelRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "55% top",
              end: "75% top",
              scrub: true,
            },
          }
        );
      }, heroRef);
    };

    initGSAP();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      ctx?.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        <span className={styles.navBrand}>THE MONOLITH</span>
        <div className={styles.navRight}>
          <span className={styles.navTag}>Est. ~3000 BCE</span>
          <a href="#acquire" id="nav-cta" className={styles.navCta}>
            ACQUIRE
          </a>
        </div>
      </nav>

      {/* 3D Canvas — fills the entire hero */}
      <BrickScene scrollRef={scrollRef} mouseRef={mouseRef} />

      {/* Overlay text — fades out on scroll */}
      <div ref={overlayRef} className={styles.overlay} aria-label="Hero content">
        <div className={styles.eyebrowRow}>
          <span className={styles.line} />
          <p className={styles.eyebrow}>Fired Clay · Hand Sourced · Terra-Cotta</p>
          <span className={styles.line} />
        </div>

        <h1 className={styles.headline}>
          THE
          <br />
          MONOLITH
        </h1>

        <p className={styles.subheadline}>
          One plain red brick.
          <br />
          Sold as the world&apos;s finest luxury artifact.
        </p>

        <div className={styles.scrollIndicator} aria-hidden="true">
          <span className={styles.scrollText}>Scroll to discover</span>
          <div className={styles.scrollBar}>
            <div className={styles.scrollProgress} />
          </div>
        </div>
      </div>

      {/* Wireframe label — fades in during scroll */}
      <div
        ref={wireframeLabelRef}
        className={styles.wireframeLabel}
        aria-hidden="true"
      >
        <span className={styles.line} />
        <span>STRUCTURAL ANALYSIS MODE</span>
        <span className={styles.line} />
      </div>

      {/* Bottom spec line */}
      <div className={styles.specBar} aria-hidden="true">
        <span>SiO₂ 58%</span>
        <span>Al₂O₃ 22%</span>
        <span>Fe₂O₃ 7%</span>
        <span>FIRED AT 1050°C</span>
        <span>215 × 102.5 × 65 mm</span>
      </div>
    </section>
  );
}
