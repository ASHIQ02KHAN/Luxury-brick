"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Slider.module.css";

// Dynamic import for 3D canvas (prevents SSR errors)
const SliderScene = dynamic(() => import("./SliderScene"), {
  ssr: false,
  loading: () => <div className={styles.canvasPlaceholder} />,
});

/* ─────────────────────────────────────────────
   Slide data
───────────────────────────────────────────── */
const SLIDES = [
  {
    id: "origin",
    label: "01 — Form",
    headline: ["THE", "LATTICE"],
    subtitle: "Geometric · Structural",
    body: "A grid of squares intersecting with precise symmetry. Designed to filter sunlight and channel the breeze, casting perfectly ordered shadows across the pavilion floor.",
    accent: "#00f3ff",
    bgGradient:
      "radial-gradient(ellipse 80% 80% at 60% 50%, #0a1520 0%, #050505 100%)",
    patternId: "naksha",
  },
  {
    id: "material",
    label: "02 — Geometry",
    headline: ["THE", "STAR"],
    subtitle: "Eight-Pointed · Infinite",
    body: "An octagram born from overlapping squares. Rooted in Mughal architectural traditions, this eight-pointed star geometry transforms solid clay into a mathematical tapestry.",
    accent: "#ff00ff",
    bgGradient:
      "radial-gradient(ellipse 80% 80% at 40% 50%, #1a0020 0%, #050505 100%)",
    patternId: "pankha",
  },
  {
    id: "process",
    label: "03 — Pattern",
    headline: ["THE", "WEAVE"],
    subtitle: "Interlocking · Infinite",
    body: "A woven cross-weave of diamond cutouts interlocking across every axis. Each void channels light and air through an ancient geometry of interlocking diagonals.",
    accent: "#b026ff",
    bgGradient:
      "radial-gradient(ellipse 80% 80% at 50% 60%, #100020 0%, #050505 100%)",
    patternId: "jhari",
  },
  {
    id: "artifact",
    label: "04 — Heritage",
    headline: ["THE", "QUATREFOIL"],
    subtitle: "Clover · Classic",
    body: "A four-lobed gothic clover converging around a singular core. A timeless architectural fenestration that elevates humble material into monumental elegance.",
    accent: "#39ff14",
    bgGradient:
      "radial-gradient(ellipse 80% 80% at 50% 50%, #0a1a05 0%, #050505 100%)",
    patternId: "kantha",
  },
] as const;

/* ─────────────────────────────────────────────
   Bengali Terra-Cotta SVG Pattern Components
───────────────────────────────────────────── */

/** Naksha — classic diamond lattice geometry */
function NakshaPattern({ color, uid }: { color: string; uid: string }) {
  return (
    <svg
      className={styles.patternSvg}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={uid}
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 2 L58 30 L30 58 L2 30 Z"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M30 14 L46 30 L30 46 L14 30 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
          />
          <circle cx="30" cy="30" r="3.5" fill={color} />
          <circle cx="0" cy="0" r="2" fill={color} />
          <circle cx="60" cy="0" r="2" fill={color} />
          <circle cx="0" cy="60" r="2" fill={color} />
          <circle cx="60" cy="60" r="2" fill={color} />
          <line x1="0" y1="30" x2="14" y2="30" stroke={color} strokeWidth="0.6" />
          <line x1="46" y1="30" x2="60" y2="30" stroke={color} strokeWidth="0.6" />
          <line x1="30" y1="0" x2="30" y2="14" stroke={color} strokeWidth="0.6" />
          <line x1="30" y1="46" x2="30" y2="60" stroke={color} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid})`} />
    </svg>
  );
}

/** Pankha — fan / lotus petal radiating motif */
function PankhaPattern({ color, uid }: { color: string; uid: string }) {
  return (
    <svg
      className={styles.patternSvg}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={uid}
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="40" cy="40" r="4.5" fill={color} />
          {/* 8 petals */}
          <path d="M40 40 Q50 20 40 5 Q30 20 40 40" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M40 40 Q60 50 75 40 Q60 30 40 40" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M40 40 Q50 60 40 75 Q30 60 40 40" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M40 40 Q20 50 5 40 Q20 30 40 40" fill="none" stroke={color} strokeWidth="1.3" />
          <path d="M40 40 Q56 24 65 15 Q53 27 40 40" fill="none" stroke={color} strokeWidth="0.7" />
          <path d="M40 40 Q56 56 65 65 Q53 53 40 40" fill="none" stroke={color} strokeWidth="0.7" />
          <path d="M40 40 Q24 56 15 65 Q27 53 40 40" fill="none" stroke={color} strokeWidth="0.7" />
          <path d="M40 40 Q24 24 15 15 Q27 27 40 40" fill="none" stroke={color} strokeWidth="0.7" />
          {/* Outer ring dots */}
          <circle cx="40" cy="5" r="1.5" fill={color} />
          <circle cx="75" cy="40" r="1.5" fill={color} />
          <circle cx="40" cy="75" r="1.5" fill={color} />
          <circle cx="5" cy="40" r="1.5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid})`} />
    </svg>
  );
}

/** Jhari — flowing water / wave curls (water-pot pattern) */
function JhariPattern({ color, uid }: { color: string; uid: string }) {
  return (
    <svg
      className={styles.patternSvg}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={uid}
          x="0"
          y="0"
          width="100"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          {/* Primary wave */}
          <path
            d="M0 30 C20 10, 30 10, 50 30 S80 50, 100 30"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
          />
          {/* Upper echo wave */}
          <path
            d="M0 14 C20 4, 30 4, 50 14 S80 24, 100 14"
            fill="none"
            stroke={color}
            strokeWidth="0.7"
          />
          {/* Lower echo wave */}
          <path
            d="M0 46 C20 36, 30 36, 50 46 S80 56, 100 46"
            fill="none"
            stroke={color}
            strokeWidth="0.7"
          />
          {/* Accent nodes */}
          <circle cx="0" cy="30" r="2.5" fill={color} />
          <circle cx="50" cy="30" r="2.5" fill={color} />
          <circle cx="100" cy="30" r="2.5" fill={color} />
          <circle cx="25" cy="19" r="1.5" fill={color} />
          <circle cx="75" cy="41" r="1.5" fill={color} />
          <circle cx="25" cy="41" r="1" fill={color} opacity="0.5" />
          <circle cx="75" cy="19" r="1" fill={color} opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid})`} />
    </svg>
  );
}

/** Kantha — hand-stitched running stitch embroidery pattern */
function KanthaPattern({ color, uid }: { color: string; uid: string }) {
  return (
    <svg
      className={styles.patternSvg}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={uid}
          x="0"
          y="0"
          width="120"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          {/* Main running stitch — long dashes */}
          {[0, 16, 32, 48, 64, 80, 96, 112].map((x) => (
            <line
              key={x}
              x1={x}
              y1="25"
              x2={x + 9}
              y2="25"
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}
          {/* Upper stitch row */}
          {[8, 28, 48, 68, 88, 108].map((x) => (
            <line
              key={x}
              x1={x}
              y1="12"
              x2={x + 7}
              y2="12"
              stroke={color}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
          ))}
          {/* Lower stitch row */}
          {[8, 28, 48, 68, 88, 108].map((x) => (
            <line
              key={x}
              x1={x}
              y1="38"
              x2={x + 7}
              y2="38"
              stroke={color}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
          ))}
          {/* Diamond cross accents */}
          <path
            d="M22 18 L28 25 L22 32 L16 25 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <path
            d="M82 18 L88 25 L82 32 L76 25 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle cx="22" cy="25" r="2" fill={color} />
          <circle cx="82" cy="25" r="2" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid})`} />
    </svg>
  );
}

const PATTERN_MAP = {
  naksha: NakshaPattern,
  pankha: PankhaPattern,
  jhari: JhariPattern,
  kantha: KanthaPattern,
} as const;

/* ─────────────────────────────────────────────
   Main Slider Component
───────────────────────────────────────────── */
type SliderObserver = { enable(): void; disable(): void; kill(): void };

export default function Slider() {
  const sliderRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mouse tracking ref for 3D interaction
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs that live inside the GSAP closure
  const animatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const observerRef = useRef<SliderObserver | null>(null);
  const gotoRef = useRef<((index: number, dir: number) => void) | null>(null);

  useEffect(() => {
    if (!sliderRef.current) return;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { Observer } = await import("gsap/Observer");
      gsap.registerPlugin(Observer);

      const slides = slideRefs.current;

      // ── Initial states ──────────────────────────
      slides.forEach((s, i) => {
        gsap.set(s, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 });
        const bg = s.querySelector<HTMLElement>('[data-layer="bg"]');
        const pt = s.querySelector<HTMLElement>('[data-layer="pattern"]');
        const ct = s.querySelector<HTMLElement>('[data-layer="content"]');
        if (bg) gsap.set(bg, { y: "0vh" });
        if (pt) gsap.set(pt, { y: "0vh", opacity: i === 0 ? 0.1 : 0 });
        if (ct) gsap.set(ct, { y: "0vh" });
      });

      // ── Animate in first slide text ─────────────
      const firstItems = slides[0]?.querySelectorAll("[data-anim]");
      if (firstItems?.length) {
        gsap.fromTo(
          firstItems,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.85,
            ease: "power2.out",
            delay: 0.5,
          }
        );
      }

      // ── Core transition function ────────────────
      const gotoSection = (index: number, dir: number) => {
        if (animatingRef.current) return;
        if (index < 0 || index >= SLIDES.length) {
          // At boundary — release scroll to page
          observerRef.current?.disable();
          return;
        }
        if (index === currentIndexRef.current) return;

        animatingRef.current = true;
        const outIdx = currentIndexRef.current;
        const dFactor = dir > 0 ? 1 : -1;

        const outSlide = slides[outIdx];
        const inSlide = slides[index];

        const outBg = outSlide.querySelector<HTMLElement>('[data-layer="bg"]');
        const outPt = outSlide.querySelector<HTMLElement>('[data-layer="pattern"]');
        const outCt = outSlide.querySelector<HTMLElement>('[data-layer="content"]');
        const inBg = inSlide.querySelector<HTMLElement>('[data-layer="bg"]');
        const inPt = inSlide.querySelector<HTMLElement>('[data-layer="pattern"]');
        const inCt = inSlide.querySelector<HTMLElement>('[data-layer="content"]');
        const inItems = inCt?.querySelectorAll("[data-anim]");

        // Set initial positions for INCOMING slide layers
        gsap.set(inSlide, { autoAlpha: 1, zIndex: 10 });
        if (inBg) gsap.set(inBg, { y: `${25 * dFactor}vh` });
        if (inPt) gsap.set(inPt, { y: `${50 * dFactor}vh`, opacity: 0 });
        if (inCt) gsap.set(inCt, { y: `${100 * dFactor}vh`, opacity: 1 });
        if (inItems) gsap.set(inItems, { opacity: 0, y: 30 * dFactor });

        const tl = gsap.timeline({
          defaults: { duration: 1.2, ease: "power2.inOut" },
          onComplete: () => {
            animatingRef.current = false;
            gsap.set(outSlide, { autoAlpha: 0, zIndex: 0 });
            // Reset outgoing positions for re-entry
            if (outBg) gsap.set(outBg, { clearProps: "y" });
            if (outPt) gsap.set(outPt, { y: "0vh", opacity: 0 });
            if (outCt) gsap.set(outCt, { clearProps: "y,opacity" });
          },
        });

        // OUTGOING — parallax at reduced speed
        if (outBg) tl.to(outBg, { y: `${-22 * dFactor}vh` }, 0);
        if (outPt) tl.to(outPt, { y: `${-40 * dFactor}vh`, opacity: 0, duration: 0.7 }, 0);
        if (outCt) tl.to(outCt, { y: `${-85 * dFactor}vh`, opacity: 0, duration: 0.8 }, 0);

        // INCOMING — parallax lands at 0
        if (inBg) tl.to(inBg, { y: "0vh" }, 0);
        if (inPt) tl.to(inPt, { y: "0vh", opacity: 0.1, duration: 1.1 }, 0.08);
        if (inCt) tl.to(inCt, { y: "0vh", duration: 1.0 }, 0.1);

        // Text items stagger in
        if (inItems?.length) {
          tl.to(
            inItems,
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.55,
              ease: "power2.out",
            },
            0.48
          );
        }

        currentIndexRef.current = index;
        setActiveIndex(index);
      };

      gotoRef.current = gotoSection;

      // ── GSAP Observer (scroll-jacking) ──────────
      const gsapObserver = Observer.create({
        type: "wheel,touch",
        onDown: () => gotoSection(currentIndexRef.current + 1, 1),
        onUp: () => gotoSection(currentIndexRef.current - 1, -1),
        tolerance: 10,
        preventDefault: true,
      });
      gsapObserver.disable(); // start disabled, enabled by IntersectionObserver below
      observerRef.current = gsapObserver;

      // ── Keyboard navigation ────────────────────
      const onKey = (e: KeyboardEvent) => {
        if (!isVisible) return;
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          gotoSection(currentIndexRef.current + 1, 1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          gotoSection(currentIndexRef.current - 1, -1);
        }
      };

      // ── IntersectionObserver ───────────────────
      let isVisible = false;
      const io = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.85;
          if (isVisible) {
            gsapObserver.enable();
          } else {
            gsapObserver.disable();
          }
        },
        { threshold: [0, 0.85, 1] }
      );
      io.observe(sliderRef.current!);

      window.addEventListener("keydown", onKey);

      const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = {
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1,
        };
      };
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      cleanup = () => {
        gsapObserver.kill();
        io.disconnect();
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    };

    init();
    return () => cleanup?.();
  }, []);

  // Dot click — uses stable ref to gotoSection
  const handleDotClick = (i: number) => {
    animatingRef.current = false; // Unlock if stuck
    observerRef.current?.enable();
    const dir = i > currentIndexRef.current ? 1 : -1;
    gotoRef.current?.(i, dir);
  };

  return (
    <section
      ref={sliderRef}
      id="heritage"
      className={styles.slider}
      aria-label="Heritage story — 4 slides"
    >
      {/* ── 3D Slider Scene ── */}
      <div className={styles.canvasWrap} aria-hidden="true">
        <SliderScene activeIndex={activeIndex} mouseRef={mouseRef} />
      </div>

      {/* ── Slide counter ── */}
      <div className={styles.counter} aria-hidden="true">
        <span className={styles.counterCurrent}>
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className={styles.counterDivider}>/</span>
        <span className={styles.counterTotal}>
          {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Progress dots ── */}
      <nav className={styles.dots} aria-label="Slide navigation">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            id={`slider-dot-${i}`}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            style={i === activeIndex ? { backgroundColor: SLIDES[i].accent } : {}}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to: ${slide.label}`}
            aria-current={i === activeIndex ? "true" : undefined}
          />
        ))}
      </nav>

      {/* ── Scroll hint ── */}
      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine}>
          <div className={styles.scrollDrop} />
        </div>
        <span className={styles.scrollText}>SCROLL</span>
      </div>

      {/* ── Slides ── */}
      {SLIDES.map((slide, i) => {
        const PatternComp = PATTERN_MAP[slide.patternId];
        return (
          <div
            key={slide.id}
            ref={(el) => {
              if (el) slideRefs.current[i] = el;
            }}
            className={styles.slide}
            aria-hidden={i !== activeIndex}
          >
            {/* Layer 1 — Background gradient (slowest parallax) */}
            <div
              className={styles.slideBg}
              data-layer="bg"
              style={{ background: slide.bgGradient }}
            >
              {/* Large ghost number — editorial depth */}
              <span
                className={styles.ghostNumber}
                style={{ color: slide.accent }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Layer 2 — Pattern overlay (medium parallax) */}
            <div className={styles.slidePattern} data-layer="pattern">
              <PatternComp color={slide.accent} uid={`sp-${slide.patternId}-${i}`} />
            </div>

            {/* Layer 3 — Typography content (full speed) */}
            <div className={styles.slideContent} data-layer="content">
              <div className={styles.slideInner}>
                {/* Eyebrow label */}
                <span className={styles.slideLabel} data-anim>
                  {slide.label}
                </span>

                {/* Main headline */}
                <h2 className={styles.slideTitle}>
                  {slide.headline.map((line, li) => (
                    <span key={li} className={styles.slideLine} data-anim>
                      {line}
                    </span>
                  ))}
                </h2>

                {/* Accent rule */}
                <div
                  className={styles.accentRule}
                  data-anim
                  style={{ backgroundColor: slide.accent }}
                />

                {/* Subtitle */}
                <p
                  className={styles.slideSubtitle}
                  data-anim
                  style={{ color: slide.accent }}
                >
                  {slide.subtitle}
                </p>

                {/* Body */}
                <p className={styles.slideBody} data-anim>
                  {slide.body}
                </p>
              </div>

              {/* Right-side accent column */}
              <div
                className={styles.accentColumn}
                data-anim
                style={{ backgroundColor: slide.accent }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
