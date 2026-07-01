import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.top}>
          <span className={styles.brand}>THE MONOLITH</span>
          <p className={styles.tagline}>Built from earth. Lasts forever.</p>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.legal}>
            &copy; {new Date().getFullYear()} THE MONOLITH. All rights reserved.
            No bricks were harmed in the making of this website.
          </p>
          <div className={styles.links}>
            <a href="#specs" className={styles.link}>Specifications</a>
            <a href="#craft" className={styles.link}>Craft</a>
            <a href="#manifesto" className={styles.link}>Manifesto</a>
            <a href="#acquire" className={styles.link}>Acquire</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
