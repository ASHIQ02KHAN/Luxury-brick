"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { getLatticeGeometries } from "./Geometries";

interface SliderSceneProps {
  activeIndex: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

/* ─────────────────────────────────────────────
   Procedural Texture Generators
───────────────────────────────────────────── */

// 1. Raw Earth / Clay noise texture for Slide 0
function createClayNoiseTexture() {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 512);

  // Grainy noise
  for (let i = 0; i < 60000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2 + 1;
    const val = Math.floor(Math.random() * 60) - 30;
    ctx.fillStyle = `rgb(${128 + val},${128 + val},${128 + val})`;
    ctx.fillRect(x, y, size, size);
  }

  // Soft organic bumps
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 30 + 10;
    const val = Math.floor(Math.random() * 30) - 15;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${128 + val},${128 + val},${128 + val}, 0.4)`);
    grad.addColorStop(1, "rgba(128,128,128,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  return texture;
}

// 2. Kiln Heat Glow / Crackle texture for Slide 2
function createKilnGlowTexture() {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#000000"; // base non-emissive
  ctx.fillRect(0, 0, 512, 512);

  // Draw glowing cracks/veins
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      x += (Math.random() - 0.5) * 35;
      y += Math.random() * 40 + 20;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Add some glowing pockets
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 25 + 5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    grad.addColorStop(0.5, "rgba(255, 100, 0, 0.3)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3. Gold leaf / logo mask for Slide 3 (Artifact)
function createGoldLeafMaskTexture() {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background: black (non-emissive/non-metallic)
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 512, 512);

  // Draw sleek modern stripes
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(248, 0, 16, 512); 
  ctx.fillRect(100, 400, 312, 4);

  // Draw "M" monogram logo
  ctx.font = "bold 96px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M", 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/* ─────────────────────────────────────────────
   Individual Interactive Brick
───────────────────────────────────────────── */
interface SliderBrickProps {
  activeIndex: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

function SliderBrick({ activeIndex, mouseRef }: SliderBrickProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const wireframeMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  // Load new lattice geometries
  const geometries = useMemo(() => getLatticeGeometries(), []);
  const fallbackGeometry = useMemo(() => new THREE.BoxGeometry(2.15, 2.15, 0.45), []);
  const currentGeometry = geometries[activeIndex] || fallbackGeometry;
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(currentGeometry, 15), [currentGeometry]);

  // We don't map this onto the extrude geometry because it causes severe UV stretching.
  // Instead, we use it only where UVs are perfect, or we rely on procedural clay.
  const brickTexture = useTexture("/brick-texture.png");
  useMemo(() => {
    brickTexture.wrapS = THREE.RepeatWrapping;
    brickTexture.wrapT = THREE.RepeatWrapping;
  }, [brickTexture]);

  // Procedural textures
  const [clayBumpTex, setClayBumpTex] = useState<THREE.Texture | null>(null);
  const [kilnGlowTex, setKilnGlowTex] = useState<THREE.Texture | null>(null);
  const [goldMaskTex, setGoldMaskTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    setClayBumpTex(createClayNoiseTexture());
    setKilnGlowTex(createKilnGlowTexture());
    setGoldMaskTex(createGoldLeafMaskTexture());
  }, []);

  // Update material maps — use procedural noise to avoid UV stretching!
  useEffect(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    mat.map = null; // NEVER use the 2D image here; it stretches horribly on ExtrudeGeometry sides.
    mat.bumpMap = clayBumpTex; // Procedural noise (no UV stretching)
    mat.bumpScale = 0.05; // Subtle, realistic grainy clay feel
    mat.roughnessMap = null;
    mat.metalnessMap = null;
    mat.emissiveMap = null;
    mat.emissive.setRGB(0, 0, 0);
    mat.emissiveIntensity = 0;
    
    mat.needsUpdate = true;
  }, [activeIndex, clayBumpTex]);

  // Material state variables for transition LERPing
  const currentProps = useRef({
    x: 1.3,
    y: 0.0,
    z: 0.0,
    rotX: 0.0,
    rotY: 0.0,
    colorR: 0.54, // #8b3010
    colorG: 0.18,
    colorB: 0.06,
    roughness: 0.98,
    metalness: 0.0,
    emissiveIntensity: 0.0,
    wireframeOpacity: 0.0,
    scale: 1.0,
  });

  // Calculate target properties based on slide
  const targetProps = useMemo(() => {
    // Warm, rich terra-cotta red — the real brick color
    const baseColor = { r: 0.69, g: 0.23, b: 0.18 }; // #b03a2e

    switch (activeIndex) {
      case 0: // Square lattice
        return {
          x: 1.0,
          y: 0.0,
          z: 0.0,
          rotX: 0.15,
          rotY: -0.35,
          colorR: baseColor.r,
          colorG: baseColor.g,
          colorB: baseColor.b,
          roughness: 0.95,
          metalness: 0.0,
          emissiveIntensity: 0.0,
          wireframeOpacity: 0.0,
          scale: 0.75,
        };
      case 1: // Star lattice
        return {
          x: 1.0,
          y: 0.1,
          z: 0.0,
          rotX: 0.25,
          rotY: 0.5,
          colorR: baseColor.r * 0.95,
          colorG: baseColor.g * 0.9,
          colorB: baseColor.b * 0.85,
          roughness: 0.92,
          metalness: 0.0,
          emissiveIntensity: 0.0,
          wireframeOpacity: 0.0,
          scale: 0.75,
        };
      case 2: // Woven cross-weave
        return {
          x: 1.1,
          y: -0.1,
          z: 0.0,
          rotX: -0.1,
          rotY: 0.9,
          colorR: baseColor.r * 1.05,
          colorG: baseColor.g * 0.95,
          colorB: baseColor.b * 0.9,
          roughness: 0.9,
          metalness: 0.02,
          emissiveIntensity: 0.0,
          wireframeOpacity: 0.0,
          scale: 0.75,
        };
      case 3: // Quatrefoil clover
        return {
          x: 1.0,
          y: 0.0,
          z: 0.0,
          rotX: 0.2,
          rotY: 1.8,
          colorR: baseColor.r * 0.9,
          colorG: baseColor.g * 0.85,
          colorB: baseColor.b * 0.8,
          roughness: 0.88,
          metalness: 0.03,
          emissiveIntensity: 0.0,
          wireframeOpacity: 0.0,
          scale: 0.75,
        };
      default:
        return {
          x: 1.0,
          y: 0.0,
          z: 0.0,
          rotX: 0.0,
          rotY: 0.0,
          colorR: baseColor.r,
          colorG: baseColor.g,
          colorB: baseColor.b,
          roughness: 0.95,
          metalness: 0.0,
          emissiveIntensity: 0.0,
          wireframeOpacity: 0.0,
          scale: 0.75,
        };
    }
  }, [activeIndex]);

  const { viewport } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    const t = performance.now() * 0.001;
    const mouse = mouseRef.current;

    // Smoothly lerp properties
    const ease = Math.min(delta * 4.2, 0.08); // dynamic frame-rate-independent scale
    const p = currentProps.current;
    const tg = targetProps;

    p.x += (tg.x - p.x) * ease;
    p.y += (tg.y - p.y) * ease;
    p.z += (tg.z - p.z) * ease;
    p.rotX += (tg.rotX - p.rotX) * ease;
    p.rotY += (tg.rotY - p.rotY) * ease;
    p.colorR += (tg.colorR - p.colorR) * ease;
    p.colorG += (tg.colorG - p.colorG) * ease;
    p.colorB += (tg.colorB - p.colorB) * ease;
    p.roughness += (tg.roughness - p.roughness) * ease;
    p.metalness += (tg.metalness - p.metalness) * ease;
    p.emissiveIntensity += (tg.emissiveIntensity - p.emissiveIntensity) * ease;
    p.wireframeOpacity += (tg.wireframeOpacity - p.wireframeOpacity) * ease;
    p.scale += (tg.scale - p.scale) * ease;

    // Apply viewport adjustments for mobile
    const isMobile = viewport.width < 6.0;
    const finalX = isMobile ? 0 : p.x;
    const finalY = isMobile ? -0.1 : p.y;
    const finalScale = isMobile ? p.scale * 0.75 : p.scale;

    // Set group position with a gentle floating bob
    groupRef.current.position.set(
      finalX,
      finalY + Math.sin(t * 1.5) * 0.04,
      p.z
    );
    groupRef.current.scale.setScalar(finalScale);

    // Apply rotation: target rotation + mouse coordinates tilt
    // INCREASED tilt strength for more prominent interactive feel
    const mouseTiltStrengthX = 0.5;
    const mouseTiltStrengthY = 0.8;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      p.rotX + mouse.y * mouseTiltStrengthX,
      delta * 5
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      p.rotY + mouse.x * mouseTiltStrengthY,
      delta * 5
    );

    // Sync edges rotation
    if (edgesRef.current) {
      edgesRef.current.rotation.x = meshRef.current.rotation.x;
      edgesRef.current.rotation.y = meshRef.current.rotation.y;
    }

    // Dynamic material properties
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.color.setRGB(p.colorR, p.colorG, p.colorB);
    mat.roughness = p.roughness;

    // All slides use the same natural clay look — no emissive
    mat.metalness = p.metalness;
    mat.emissive.setRGB(0, 0, 0);
    mat.emissiveIntensity = 0;

    // Set wireframe basic material opacity
    if (wireframeMaterialRef.current) {
      wireframeMaterialRef.current.opacity = p.wireframeOpacity;
    }
  });

  return (
    <group ref={groupRef}>
      {/* The main solid brick */}
      <mesh ref={meshRef} geometry={currentGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          roughness={0.92}
          metalness={0.0}
          bumpScale={0.05}
        />
      </mesh>

      {/* Wireframe overlay for structural analysis mode */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          ref={wireframeMaterialRef}
          color={new THREE.Color(0xf5f0eb)}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Spotlight tracking mouse cursor
───────────────────────────────────────────── */
function TrackingSpotLight({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame((_, delta) => {
    if (!lightRef.current) return;
    const mouse = mouseRef.current;

    // Interpolate light position based on mouse coordinate
    const targetX = 3 + mouse.x * 5;
    const targetY = 4 + mouse.y * 3;

    lightRef.current.position.x += (targetX - lightRef.current.position.x) * delta * 4;
    lightRef.current.position.y += (targetY - lightRef.current.position.y) * delta * 4;
  });

  return (
    <spotLight
      ref={lightRef}
      position={[3, 4, 3]}
      angle={0.4}
      penumbra={0.8}
      intensity={12}
      color="#00f3ff"
      castShadow
      shadow-mapSize={[512, 512]}
    />
  );
}

/* ─────────────────────────────────────────────
   Main 3D Scene Wrapper
───────────────────────────────────────────── */
export default function SliderScene({ activeIndex, mouseRef }: SliderSceneProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.0], fov: 42 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          {/* Subtle ambient lighting */}
          <ambientLight intensity={0.12} />

          {/* Warm gallery key light — illuminates the red clay */}
          <directionalLight
            position={[0, 5, 4]}
            intensity={2.0}
            color="#fff8f0"
          />

          {/* Neon Magenta dramatic fill from left */}
          <directionalLight
            position={[-4, 1, 1]}
            intensity={1.2}
            color="#ff00ff"
          />

          {/* Neon Cyan bottom rim glow */}
          <pointLight
            position={[0, -2, -2]}
            intensity={4}
            color="#00f3ff"
            distance={10}
          />

          {/* Mouse tracking spotlight */}
          <TrackingSpotLight mouseRef={mouseRef} />

          {/* Interactive brick */}
          <SliderBrick activeIndex={activeIndex} mouseRef={mouseRef} />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
