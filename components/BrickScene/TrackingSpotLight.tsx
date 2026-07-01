"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TrackingSpotLightProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

export default function TrackingSpotLight({ mouseRef }: TrackingSpotLightProps) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    const mouse = mouseRef.current;

    // Smoothly track mouse position (projected to 3D space)
    lightRef.current.position.x +=
      (mouse.x * 5 - lightRef.current.position.x) * 0.05;
    lightRef.current.position.y +=
      (mouse.y * 3 + 4 - lightRef.current.position.y) * 0.05;
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[2, 5, 4]}
        intensity={60}
        angle={0.38}
        penumbra={0.75}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        color={0x00f3ff}
        target-position={[0, 0, 0]}
      />
      <object3D ref={targetRef} position={[0, 0, 0]} />
    </>
  );
}
