"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    // Track mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation loop using GSAP ticker
    const animateCursor = () => {
      // Smooth follow for the main cursor ring
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Slightly delayed/softer follow for the inner neon glow
      gsap.to(glow, {
        x: mouseX,
        y: mouseY,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    gsap.ticker.add(animateCursor);

    // Add hover effects for interactive elements
    const handleHoverIn = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.3, borderColor: "var(--color-neon-pink)", backgroundColor: "rgba(255, 0, 255, 0.1)" });
      gsap.to(glow, { scale: 1.5, opacity: 0.6, backgroundColor: "var(--color-neon-pink)", duration: 0.3 });
    };

    const handleHoverOut = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, borderColor: "var(--color-neon-cyan)", backgroundColor: "transparent" });
      gsap.to(glow, { scale: 1, opacity: 0.4, backgroundColor: "var(--color-neon-cyan)", duration: 0.3 });
    };

    const interactables = document.querySelectorAll("a, button, input, textarea, select");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverIn);
      el.addEventListener("mouseleave", handleHoverOut);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(animateCursor);
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverIn);
        el.removeEventListener("mouseleave", handleHoverOut);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={styles.cursorRing} />
      <div ref={glowRef} className={styles.cursorGlow} />
    </>
  );
}
