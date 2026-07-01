"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BrickMeshProps {
  scrollRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

export default function BrickMesh({ scrollRef, mouseRef }: BrickMeshProps) {
  const brickRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Real-world brick proportions: 215mm × 102.5mm × 65mm → scaled to scene units
  const geometry = useMemo(
    () => new THREE.BoxGeometry(2.15, 1.025, 0.65),
    []
  );

  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry, 15),
    [geometry]
  );

  const brickMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xb03a2e), // Warm terra-cotta red
        roughness: 0.92,
        metalness: 0.0,
      }),
    []
  );

  const edgesMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(0xf5c518), // Gold wireframe — warm luxury
        transparent: true,
        opacity: 0,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!brickRef.current || !edgesRef.current || !groupRef.current) return;

    const scroll = scrollRef.current;
    const mouse = mouseRef.current;

    // Target rotation: scroll drives Y-axis rotation (full turn), mouse adds tilt
    const targetY = scroll * Math.PI * 2.5 + mouse.x * 0.25;
    const targetX = mouse.y * 0.2;

    // Smooth lerp — 0.06 factor = fluid, non-jittery response
    brickRef.current.rotation.y +=
      (targetY - brickRef.current.rotation.y) * Math.min(delta * 4, 0.08);
    brickRef.current.rotation.x +=
      (targetX - brickRef.current.rotation.x) * Math.min(delta * 4, 0.08);

    // Sync edges rotation
    edgesRef.current.rotation.y = brickRef.current.rotation.y;
    edgesRef.current.rotation.x = brickRef.current.rotation.x;

    // Wireframe fades in after 55% scroll progress
    const wireTarget = scroll > 0.55 ? Math.min((scroll - 0.55) / 0.35, 1) : 0;
    edgesMaterial.opacity += (wireTarget - edgesMaterial.opacity) * 0.06;

    // Subtle floating bob
    groupRef.current.position.y =
      Math.sin(Date.now() * 0.001) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={brickRef}
        geometry={geometry}
        material={brickMaterial}
        castShadow
        receiveShadow
      />
      <lineSegments
        ref={edgesRef}
        geometry={edgesGeometry}
        material={edgesMaterial}
      />
    </group>
  );
}
