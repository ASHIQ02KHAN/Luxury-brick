"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Configurator.module.css";

const EDITIONS = [
  {
    id: "standard",
    name: "Standard",
    desc: "The definitive plain red brick. Fired at 1050°C for exactly 32 hours. No synthetic additives. No excuses.",
    price: 49,
  },
  {
    id: "numbered",
    name: "Hand-Numbered",
    desc: "Each unit individually numbered in white ink by the artisan. Certificates of geological provenance included.",
    price: 149,
  },
];

export default function Configurator() {
  const [qty, setQty] = useState(1);
  const [edition, setEdition] = useState<"standard" | "numbered">("standard");
  const [acquired, setAcquired] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedEdition = EDITIONS.find((e) => e.id === edition)!;
  const total = selectedEdition.price * qty;

  useEffect(() => {
    const initGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        }
      );
    };

    initGSAP();
  }, []);

  const handleAcquire = () => {
    setAcquired(true);
    setTimeout(() => setAcquired(false), 4000);
  };

  return (
    <section
      ref={sectionRef}
      id="acquire"
      className={styles.configurator}
      aria-label="Product configurator"
    >
      <div className={styles.container}>
        <div ref={contentRef} className={styles.inner}>
          {/* Left: Info */}
          <div className={styles.info}>
            <span className={styles.sectionLabel}>Configure &amp; Acquire</span>
            <h2 className={styles.title}>
              THE
              <br />
              MONOLITH
            </h2>
            <p className={styles.tagline}>
              A single brick. An entire philosophy.
            </p>

            <div className={styles.priceDisplay}>
              <span className={styles.priceCurrency}>$</span>
              <span className={styles.priceAmount} id="price-value">
                {total.toLocaleString()}
              </span>
              {qty > 1 && (
                <span className={styles.priceNote}>
                  ${selectedEdition.price} × {qty} units
                </span>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className={styles.controls}>
            {/* Edition Toggle */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.fieldLabel}>Select Edition</legend>
              <div className={styles.editionGrid} role="radiogroup">
                {EDITIONS.map((e) => (
                  <label
                    key={e.id}
                    id={`edition-${e.id}`}
                    className={`${styles.editionCard} ${edition === e.id ? styles.selected : ""}`}
                    htmlFor={`edition-input-${e.id}`}
                  >
                    <input
                      id={`edition-input-${e.id}`}
                      type="radio"
                      name="edition"
                      value={e.id}
                      checked={edition === e.id}
                      onChange={() =>
                        setEdition(e.id as "standard" | "numbered")
                      }
                      className={styles.srOnly}
                    />
                    <div className={styles.editionName}>{e.name}</div>
                    <div className={styles.editionPrice}>
                      ${e.price.toLocaleString()}
                    </div>
                    <p className={styles.editionDesc}>{e.desc}</p>
                    {edition === e.id && (
                      <div className={styles.selectedIndicator} aria-hidden="true" />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Quantity */}
            <div className={styles.qtyRow}>
              <span className={styles.fieldLabel}>Quantity</span>
              <div className={styles.qtyControl}>
                <button
                  id="qty-decrease"
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span className={styles.qtyValue} aria-live="polite">
                  {qty}
                </span>
                <button
                  id="qty-increase"
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              id="acquire-btn"
              className={`${styles.cta} ${acquired ? styles.ctaSuccess : ""}`}
              onClick={handleAcquire}
              aria-label={
                acquired ? "Order confirmed" : "Acquire The Monolith"
              }
            >
              {acquired ? (
                <span className={styles.successMsg}>
                  ✓ BRICK SECURED — CONFIRMATION INCOMING
                </span>
              ) : (
                <span>ACQUIRE THE MONOLITH</span>
              )}
              {!acquired && <div className={styles.ctaSheen} />}
            </button>

            <p className={styles.disclaimer}>
              Free shipping on all orders. Sustainably fired. Ships within
              3–5 business days wrapped in archival tissue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
