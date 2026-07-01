"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import BrickMesh from "./BrickMesh";
import Particles from "./Particles";
import TrackingSpotLight from "./TrackingSpotLight";
import styles from "./BrickScene.module.css";

interface BrickSceneProps {
  scrollRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

export default function BrickScene({ scrollRef, mouseRef }: BrickSceneProps) {
  return (
    <div className={styles.canvas} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [1.2, 0.7, 4.2], fov: 38 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient — very low to keep it moody */}
          <ambientLight intensity={0.15} />

          {/* Warm gallery key light — illuminates the red clay beautifully */}
          <pointLight
            position={[0, 4, 3]}
            intensity={25}
            color="#fff5e0"
            distance={12}
          />

          {/* Neon Cyan rim light from left — dramatic contrast */}
          <pointLight
            position={[-4, 2, 2]}
            intensity={10}
            color="#00f3ff"
            distance={15}
          />
          
          {/* Neon Magenta fill light from bottom right */}
          <pointLight
            position={[3, -2, 1]}
            intensity={12}
            color="#ff00ff"
            distance={15}
          />

          {/* Tracking spotlight — follows mouse */}
          <TrackingSpotLight mouseRef={mouseRef} />

          <BrickMesh scrollRef={scrollRef} mouseRef={mouseRef} />
          <Particles />

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
