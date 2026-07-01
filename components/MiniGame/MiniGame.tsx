"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MiniGame.module.css";

/* ─────────────────────────────────────────────
   NEON BRICK BREAKER — A fully playable arcade
   mini-game built on HTML Canvas.
───────────────────────────────────────────── */

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  color: string;
  glow: string;
  tier: number; // 0 = cyan, 1 = pink, 2 = purple
  hitAnim: number; // animation timer on break
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// Brick-inspired warm palette — reds, oranges, sandy clay, dark char
const COLORS = [
  { fill: "#b03a2e", glow: "rgba(176,58,46,0.7)" },   // classic terra-cotta red
  { fill: "#e25822", glow: "rgba(226,88,34,0.7)" },   // fired orange
  { fill: "#c4874a", glow: "rgba(196,135,74,0.7)" },  // desert sand clay
  { fill: "#6b1f18", glow: "rgba(107,31,24,0.8)" },   // midnight char
];

const CANVAS_W = 800;
const CANVAS_H = 500;
const PADDLE_W = 120;
const PADDLE_H = 14;
const BALL_R = 7;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_PAD = 6;
const BRICK_TOP = 50;

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const gameState = useRef({
    paddleX: CANVAS_W / 2 - PADDLE_W / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H - 60,
    ballVX: 4,
    ballVY: -4,
    bricks: [] as Brick[],
    particles: [] as Particle[],
    score: 0,
    lives: 3,
    running: false,
    launched: false,
    combo: 0,
    shakeTimer: 0,
    trailPositions: [] as { x: number; y: number; age: number }[],
  });

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);

  /* ── Initialize bricks ── */
  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    const brickW = (CANVAS_W - BRICK_PAD * (BRICK_COLS + 1)) / BRICK_COLS;
    const brickH = 22;

    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        const colorIdx = r % COLORS.length;
        bricks.push({
          x: BRICK_PAD + c * (brickW + BRICK_PAD),
          y: BRICK_TOP + r * (brickH + BRICK_PAD),
          w: brickW,
          h: brickH,
          alive: true,
          color: COLORS[colorIdx].fill,
          glow: COLORS[colorIdx].glow,
          tier: r,
          hitAnim: 0,
        });
      }
    }
    return bricks;
  }, []);

  /* ── Spawn particles on brick break ── */
  const spawnParticles = (brick: Brick) => {
    const gs = gameState.current;
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
      const speed = 2 + Math.random() * 4;
      gs.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.4 + Math.random() * 0.5,
        color: brick.color,
        size: 2 + Math.random() * 3,
      });
    }
  };

  /* ── Reset game ── */
  const resetGame = useCallback(() => {
    const gs = gameState.current;
    gs.paddleX = CANVAS_W / 2 - PADDLE_W / 2;
    gs.ballX = CANVAS_W / 2;
    gs.ballY = CANVAS_H - 60;
    gs.ballVX = 4 * (Math.random() > 0.5 ? 1 : -1);
    gs.ballVY = -4;
    gs.bricks = initBricks();
    gs.particles = [];
    gs.score = 0;
    gs.lives = 3;
    gs.running = true;
    gs.launched = false;
    gs.combo = 0;
    gs.shakeTimer = 0;
    gs.trailPositions = [];
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    setStarted(true);
  }, [initBricks]);

  /* ── Main game loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gs = gameState.current;

    /* Mouse / touch tracking */
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      gs.paddleX = Math.max(
        0,
        Math.min(
          CANVAS_W - PADDLE_W,
          (e.clientX - rect.left) * scaleX - PADDLE_W / 2
        )
      );
      // If ball not launched, follow paddle
      if (!gs.launched) {
        gs.ballX = gs.paddleX + PADDLE_W / 2;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      gs.paddleX = Math.max(
        0,
        Math.min(
          CANVAS_W - PADDLE_W,
          (e.touches[0].clientX - rect.left) * scaleX - PADDLE_W / 2
        )
      );
      if (!gs.launched) {
        gs.ballX = gs.paddleX + PADDLE_W / 2;
      }
    };

    const onClick = () => {
      if (!gs.launched && gs.running) {
        gs.launched = true;
        gs.ballVX = 4 * (Math.random() > 0.5 ? 1 : -1);
        gs.ballVY = -5;
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("click", onClick);

    /* ── Render loop ── */
    const loop = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Screen shake
      ctx.save();
      if (gs.shakeTimer > 0) {
        const intensity = gs.shakeTimer * 3;
        ctx.translate(
          (Math.random() - 0.5) * intensity,
          (Math.random() - 0.5) * intensity
        );
        gs.shakeTimer -= 0.05;
      }

      /* ── Draw background grid ── */
      ctx.strokeStyle = "rgba(0, 243, 255, 0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < CANVAS_W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_W, y);
        ctx.stroke();
      }

      /* ── Draw bricks ── */
      for (const brick of gs.bricks) {
        if (!brick.alive) {
          if (brick.hitAnim > 0) {
            // Explosion flash
            ctx.save();
            ctx.globalAlpha = brick.hitAnim;
            ctx.fillStyle = brick.color;
            ctx.shadowColor = brick.color;
            ctx.shadowBlur = 30 * brick.hitAnim;
            ctx.fillRect(
              brick.x - 4 * (1 - brick.hitAnim),
              brick.y - 4 * (1 - brick.hitAnim),
              brick.w + 8 * (1 - brick.hitAnim),
              brick.h + 8 * (1 - brick.hitAnim)
            );
            ctx.restore();
            brick.hitAnim -= 0.06;
          }
          continue;
        }

        // Brick glow
        ctx.save();
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 8;

        // Gradient fill
        const grad = ctx.createLinearGradient(
          brick.x,
          brick.y,
          brick.x,
          brick.y + brick.h
        );
        grad.addColorStop(0, brick.color);
        grad.addColorStop(1, `${brick.color}88`);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 3);
        ctx.fill();

        // Inner shine
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(brick.x + 2, brick.y + 2, brick.w - 4, brick.h / 3);

        ctx.restore();
      }

      /* ── Physics update (only when running + launched) ── */
      if (gs.running && gs.launched) {
        // Ball trail
        gs.trailPositions.push({ x: gs.ballX, y: gs.ballY, age: 1 });
        if (gs.trailPositions.length > 12) gs.trailPositions.shift();

        gs.ballX += gs.ballVX;
        gs.ballY += gs.ballVY;

        // Wall collisions
        if (gs.ballX - BALL_R <= 0 || gs.ballX + BALL_R >= CANVAS_W) {
          gs.ballVX = -gs.ballVX;
          gs.ballX = Math.max(BALL_R, Math.min(CANVAS_W - BALL_R, gs.ballX));
        }
        if (gs.ballY - BALL_R <= 0) {
          gs.ballVY = Math.abs(gs.ballVY);
          gs.ballY = BALL_R;
        }

        // Bottom — lose life
        if (gs.ballY + BALL_R >= CANVAS_H) {
          gs.lives--;
          gs.combo = 0;
          setLives(gs.lives);
          if (gs.lives <= 0) {
            gs.running = false;
            setGameOver(true);
          } else {
            gs.launched = false;
            gs.ballX = gs.paddleX + PADDLE_W / 2;
            gs.ballY = CANVAS_H - 60;
            gs.ballVY = -5;
          }
        }

        // Paddle collision
        const py = CANVAS_H - 30;
        if (
          gs.ballY + BALL_R >= py &&
          gs.ballY + BALL_R <= py + PADDLE_H + 4 &&
          gs.ballX >= gs.paddleX &&
          gs.ballX <= gs.paddleX + PADDLE_W
        ) {
          // Angle based on where ball hits paddle
          const hitPos = (gs.ballX - gs.paddleX) / PADDLE_W; // 0..1
          const angle = ((hitPos - 0.5) * Math.PI) / 2.5; // -PI/5 .. PI/5
          const speed = Math.sqrt(gs.ballVX ** 2 + gs.ballVY ** 2);
          const newSpeed = Math.min(speed + 0.05, 8);
          gs.ballVX = Math.sin(angle) * newSpeed;
          gs.ballVY = -Math.cos(angle) * newSpeed;
          gs.ballY = py - BALL_R;
          gs.combo = 0;
        }

        // Brick collisions
        for (const brick of gs.bricks) {
          if (!brick.alive) continue;
          if (
            gs.ballX + BALL_R > brick.x &&
            gs.ballX - BALL_R < brick.x + brick.w &&
            gs.ballY + BALL_R > brick.y &&
            gs.ballY - BALL_R < brick.y + brick.h
          ) {
            brick.alive = false;
            brick.hitAnim = 1;
            spawnParticles(brick);
            gs.combo++;
            const pts = 10 * (1 + Math.floor(gs.combo / 3));
            gs.score += pts;
            gs.shakeTimer = 0.3;
            setScore(gs.score);

            // Determine bounce direction
            const overlapLeft = gs.ballX + BALL_R - brick.x;
            const overlapRight = brick.x + brick.w - (gs.ballX - BALL_R);
            const overlapTop = gs.ballY + BALL_R - brick.y;
            const overlapBottom = brick.y + brick.h - (gs.ballY - BALL_R);
            const minOverlap = Math.min(
              overlapLeft,
              overlapRight,
              overlapTop,
              overlapBottom
            );
            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              gs.ballVX = -gs.ballVX;
            } else {
              gs.ballVY = -gs.ballVY;
            }
            break; // one brick per frame
          }
        }

        // Win condition
        if (gs.bricks.every((b) => !b.alive)) {
          gs.running = false;
          setWon(true);
        }
      }

      /* ── Draw ball trail ── */
      for (let i = 0; i < gs.trailPositions.length; i++) {
        const t = gs.trailPositions[i];
        t.age -= 0.08;
        if (t.age <= 0) continue;
        ctx.save();
        ctx.globalAlpha = t.age * 0.3;
        ctx.fillStyle = "#e25822";
        ctx.shadowColor = "#e25822";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(t.x, t.y, BALL_R * t.age, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      gs.trailPositions = gs.trailPositions.filter((t) => t.age > 0);

      /* ── Draw ball ── */
      ctx.save();
      ctx.fillStyle = "#fff8f0";
      ctx.shadowColor = "#f5c518"; // gold glow
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(gs.ballX, gs.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      // Inner warm core
      ctx.fillStyle = "#f5c518";
      ctx.beginPath();
      ctx.arc(gs.ballX, gs.ballY, BALL_R * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* ── Draw paddle ── */
      const paddleY = CANVAS_H - 30;
      ctx.save();
      ctx.shadowColor = "#f5c518"; // gold
      ctx.shadowBlur = 15;
      const pGrad = ctx.createLinearGradient(
        gs.paddleX,
        paddleY,
        gs.paddleX + PADDLE_W,
        paddleY
      );
      pGrad.addColorStop(0, "#c47a28");
      pGrad.addColorStop(0.5, "#f5c518");
      pGrad.addColorStop(1, "#c47a28");
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.roundRect(gs.paddleX, paddleY, PADDLE_W, PADDLE_H, 7);
      ctx.fill();
      // Paddle shine
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.roundRect(
        gs.paddleX + 4,
        paddleY + 2,
        PADDLE_W - 8,
        PADDLE_H / 3,
        4
      );
      ctx.fill();
      ctx.restore();

      /* ── Draw particles ── */
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.life -= 1 / 60 / p.maxLife;
        if (p.life <= 0) {
          gs.particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* ── HUD — score + combo ── */
      if (gs.combo >= 3) {
        ctx.save();
        ctx.font = "bold 16px 'Space Grotesk', sans-serif";
        ctx.fillStyle = "#ff00ff";
        ctx.shadowColor = "#ff00ff";
        ctx.shadowBlur = 12;
        ctx.textAlign = "center";
        ctx.fillText(`${gs.combo}x COMBO!`, CANVAS_W / 2, CANVAS_H - 8);
        ctx.restore();
      }

      ctx.restore(); // end screen-shake transform

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [started, gameOver, won]);

  /* ── Render ── */
  return (
    <section
      id="design"
      className={styles.game}
      aria-label="Neon Brick Breaker mini-game"
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>Mini-Game</span>
          <h2 className={styles.title}>
            Smash
            <br />
            <em>The Brick.</em>
          </h2>
          <p className={styles.subtitle}>
            Move your mouse to control the paddle. Click to launch. Smash
            every brick. How many can you break?
          </p>
        </div>

        {/* Game area */}
        <div className={styles.gameArea}>
          {/* HUD sidebar */}
          <div className={styles.panel} role="group" aria-label="Game stats">
            <div className={styles.panelTitle}>Status</div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Score</span>
              <span className={styles.statValue}>{score.toLocaleString()}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Lives</span>
              <span className={styles.statLives}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.heart} ${i < lives ? styles.heartActive : styles.heartDead}`}
                  >
                    ♦
                  </span>
                ))}
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Bricks Left</span>
              <span className={styles.statValue}>
                {started
                  ? gameState.current.bricks.filter((b) => b.alive).length
                  : "—"}
              </span>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                id="game-restart"
                className={styles.downloadBtn}
                onClick={resetGame}
                aria-label={started ? "Restart game" : "Start game"}
              >
                {started ? "⟳ Restart" : "▶ Start Game"}
              </button>
            </div>

            <p className={styles.hint}>
              {!started
                ? "Click 'Start Game' to begin."
                : !gameState.current.launched
                  ? "Click the canvas to launch!"
                  : "Move mouse to control paddle."}
            </p>
          </div>

          {/* Right — Canvas */}
          <div className={styles.canvasWrap}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              width={CANVAS_W}
              height={CANVAS_H}
              aria-label="Neon Brick Breaker game canvas"
              role="img"
            />

            {/* Overlay states */}
            {!started && (
              <div className={styles.overlay}>
                <div className={styles.overlayIcon}>🧱</div>
                <div className={styles.overlayTitle}>Brick Breaker</div>
                <div className={styles.overlayDesc}>
                  Click &quot;Start Game&quot; to begin
                </div>
              </div>
            )}

            {gameOver && (
              <div className={styles.overlay}>
                <div className={styles.overlayTitle}>Game Over</div>
                <div className={styles.overlayScore}>
                  Final Score: {score.toLocaleString()}
                </div>
                <button className={styles.overlayBtn} onClick={resetGame}>
                  Play Again
                </button>
              </div>
            )}

            {won && (
              <div className={styles.overlay}>
                <div className={styles.overlayIcon}>🏆</div>
                <div className={styles.overlayTitle}>You Won!</div>
                <div className={styles.overlayScore}>
                  Score: {score.toLocaleString()}
                </div>
                <button className={styles.overlayBtn} onClick={resetGame}>
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
