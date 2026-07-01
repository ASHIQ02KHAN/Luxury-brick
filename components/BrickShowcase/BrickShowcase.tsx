"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import styles from "./BrickShowcase.module.css";

/* ─────────────────────────────────────────────
   Brick variant data
───────────────────────────────────────────── */
const BRICKS = [
  {
    id: "standard",
    name: "Classic Fired",
    edition: "Standard Issue",
    price: "$49",
    color: "#b03a2e",   // rich terra-cotta red
    roughness: 0.92,
    metalness: 0.0,
    position: [-3.4, 0, 0] as [number, number, number],
    rotation: [0.25, -0.5, 0.1] as [number, number, number],
    floatSpeed: 1.2,
    floatIntensity: 0.5,
  },
  {
    id: "aged",
    name: "Midnight Char",
    edition: "Kiln-Darkened",
    price: "$89",
    color: "#6b1f18",   // deep dark-fired brick
    roughness: 0.97,
    metalness: 0.04,
    position: [0, 0.3, 0.5] as [number, number, number],
    rotation: [0.15, 0.3, -0.08] as [number, number, number],
    floatSpeed: 0.9,
    floatIntensity: 0.65,
  },
  {
    id: "gold",
    name: "Desert Sand",
    edition: "Limited Edition",
    price: "$249",
    color: "#c4874a",   // warm sandy clay — rare mineral deposit
    roughness: 0.85,
    metalness: 0.06,
    position: [3.4, -0.2, 0] as [number, number, number],
    rotation: [0.2, 0.6, 0.05] as [number, number, number],
    floatSpeed: 1.5,
    floatIntensity: 0.4,
  },
] as const;

/* ─────────────────────────────────────────────
   Mouse-tracking hook shared across bricks
───────────────────────────────────────────── */
function useMouse() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  if (typeof window !== "undefined") {
    // Passive listener — no re-renders
  }

  return { mouse, smoothMouse };
}

/* ─────────────────────────────────────────────
   Single brick mesh
───────────────────────────────────────────── */
interface BrickMeshProps {
  color: string;
  roughness: number;
  metalness: number;
  position: [number, number, number];
  baseRotation: [number, number, number];
  floatSpeed: number;
  floatIntensity: number;
  mouseRef: React.RefObject<THREE.Vector2>;
  index: number;
}

function BrickMesh({
  color,
  roughness,
  metalness,
  position,
  baseRotation,
  floatSpeed,
  floatIntensity,
  mouseRef,
  index,
}: BrickMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const t = performance.now() * 0.001;

    // Float oscillation (unique phase per brick)
    const phase = index * 1.3;
    meshRef.current.position.y =
      position[1] +
      Math.sin(t * floatSpeed + phase) * floatIntensity * 0.15;

    // Subtle mouse tracking — each brick responds slightly differently
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;
    const strength = 0.18 + index * 0.04;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      baseRotation[0] + my * strength,
      delta * 2.5
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      baseRotation[1] + mx * strength,
      delta * 2.5
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      baseRotation[2] + mx * 0.04,
      delta * 2.0
    );
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      {/* Real-world brick proportions: 215×102.5×65mm → scale 2.15:1.025:0.65 */}
      <boxGeometry args={[2.15, 0.65, 1.025]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        envMapIntensity={metalness > 0.5 ? 1.8 : 0.6}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Scene — lights + bricks + mouse listener
───────────────────────────────────────────── */
function Scene() {
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  // Update mouse ref on pointer move (no state = no re-renders)
  useFrame(({ pointer }) => {
    mouseRef.current.set(pointer.x, pointer.y);
  });

  return (
    <>
      {/* Lighting — warm gallery spotlights with neon rim accent */}
      <ambientLight intensity={0.2} color="#fff5e6" />

      {/* Key light — warm gallery spot */}
      <spotLight
        position={[5, 8, 4]}
        angle={0.35}
        penumbra={0.8}
        intensity={60}
        color="#fff5e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Neon Cyan rim — dramatic contrast against red brick */}
      <spotLight
        position={[-6, 4, 3]}
        angle={0.4}
        penumbra={0.9}
        intensity={30}
        color="#00f3ff"
      />
      {/* Neon Pink under-rim — adds depth */}
      <directionalLight
        position={[0, -3, -6]}
        intensity={3}
        color="#ff00ff"
      />

      <Environment preset="city" />

      {/* Bricks */}
      {BRICKS.map((b, i) => (
        <Float
          key={b.id}
          speed={b.floatSpeed}
          rotationIntensity={0}
          floatIntensity={b.floatIntensity}
        >
          <BrickMesh
            color={b.color}
            roughness={b.roughness}
            metalness={b.metalness}
            position={b.position}
            baseRotation={b.rotation}
            floatSpeed={b.floatSpeed}
            floatIntensity={b.floatIntensity}
            mouseRef={mouseRef}
            index={i}
          />
        </Float>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────── */
export default function BrickShowcase() {
  return (
    <section
      id="showcase"
      className={styles.showcase}
      aria-label="Three brick editions in 3D"
    >
      {/* Section header */}
      <div className={styles.header}>
        <span className={styles.label}>The Collection</span>
        <h2 className={styles.title}>
          Three Editions.
          <br />
          <em>One Philosophy.</em>
        </h2>
      </div>

      {/* R3F Canvas */}
      <div className={styles.canvasWrap} aria-hidden="true">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.2, 7], fov: 42 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Brick labels below canvas */}
      <div className={styles.labels}>
        {BRICKS.map((b) => (
          <div key={b.id} className={styles.brickLabel}>
            <span className={styles.brickEdition}>{b.edition}</span>
            <span className={styles.brickName}>{b.name}</span>
            <span className={styles.brickPrice}>{b.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
