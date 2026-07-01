import * as THREE from 'three';

const EXTRUDE_SETTINGS = {
  depth: 0.45,
  bevelEnabled: true,
  bevelSegments: 3,
  steps: 1,
  bevelSize: 0.015,
  bevelThickness: 0.015
};

export function getLatticeGeometries() {
  if (typeof window === 'undefined') return []; 

  const geometries: THREE.ExtrudeGeometry[] = [];

  const S = 0.7; // half-size of the outer square

  // 1. Square Lattice (Slide 0) — grid of square cutouts
  const shape0 = new THREE.Shape();
  shape0.moveTo(-S, -S);
  shape0.lineTo(S, -S);
  shape0.lineTo(S, S);
  shape0.lineTo(-S, S);
  shape0.lineTo(-S, -S);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cx = -0.48 + i * 0.32;
      const cy = -0.48 + j * 0.32;
      const hs = 0.11; // half-size of each hole
      const hole = new THREE.Path();
      hole.moveTo(cx - hs, cy + hs);
      hole.lineTo(cx + hs, cy + hs);
      hole.lineTo(cx + hs, cy - hs);
      hole.lineTo(cx - hs, cy - hs);
      hole.lineTo(cx - hs, cy + hs);
      shape0.holes.push(hole);
    }
  }
  const geo0 = new THREE.ExtrudeGeometry(shape0, EXTRUDE_SETTINGS);
  geo0.center();
  geometries.push(geo0);

  // 2. Star Lattice (Slide 1) — 8-pointed star with corner triangles
  const shape1 = new THREE.Shape();
  shape1.moveTo(-S, -S);
  shape1.lineTo(S, -S);
  shape1.lineTo(S, S);
  shape1.lineTo(-S, S);
  shape1.lineTo(-S, -S);

  const star = new THREE.Path();
  for (let i = 0; i <= 16; i++) {
    const angle = -(i * Math.PI * 2) / 16;
    const r = (i % 2 === 0) ? 0.42 : 0.22;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) star.moveTo(x, y);
    else star.lineTo(x, y);
  }
  shape1.holes.push(star);

  const corners1 = [
    [-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]
  ];
  corners1.forEach(c => {
    const tri = new THREE.Path();
    const sx = Math.sign(c[0]);
    const sy = Math.sign(c[1]);
    tri.moveTo(c[0], c[1]);
    tri.lineTo(c[0], c[1] - sy * 0.3);
    tri.lineTo(c[0] - sx * 0.3, c[1]);
    tri.lineTo(c[0], c[1]);
    shape1.holes.push(tri);
  });
  
  const edgeDiamonds = [
    [0, 0.52], [0, -0.52], [0.52, 0], [-0.52, 0]
  ];
  edgeDiamonds.forEach(d => {
    const diamond = new THREE.Path();
    diamond.moveTo(d[0], d[1] + 0.1);
    diamond.lineTo(d[0] + 0.1, d[1]);
    diamond.lineTo(d[0], d[1] - 0.1);
    diamond.lineTo(d[0] - 0.1, d[1]);
    diamond.lineTo(d[0], d[1] + 0.1);
    shape1.holes.push(diamond);
  });

  const geo1 = new THREE.ExtrudeGeometry(shape1, EXTRUDE_SETTINGS);
  geo1.center();
  geometries.push(geo1);

  // 3. Woven Cross-Weave Lattice (Slide 2) — interlocking diagonal bands
  const shape2 = new THREE.Shape();
  shape2.moveTo(-S, -S);
  shape2.lineTo(S, -S);
  shape2.lineTo(S, S);
  shape2.lineTo(-S, S);
  shape2.lineTo(-S, -S);

  // Create diamond-shaped cutouts arranged in a cross-weave pattern
  const diamondPositions = [
    // Center diamond
    { cx: 0, cy: 0, r: 0.18 },
    // Inner ring of 4
    { cx: 0.32, cy: 0, r: 0.12 },
    { cx: -0.32, cy: 0, r: 0.12 },
    { cx: 0, cy: 0.32, r: 0.12 },
    { cx: 0, cy: -0.32, r: 0.12 },
    // Diagonal ring of 4
    { cx: 0.28, cy: 0.28, r: 0.1 },
    { cx: -0.28, cy: 0.28, r: 0.1 },
    { cx: 0.28, cy: -0.28, r: 0.1 },
    { cx: -0.28, cy: -0.28, r: 0.1 },
    // Outer ring of 4
    { cx: 0.52, cy: 0.28, r: 0.08 },
    { cx: -0.52, cy: 0.28, r: 0.08 },
    { cx: 0.52, cy: -0.28, r: 0.08 },
    { cx: -0.52, cy: -0.28, r: 0.08 },
    { cx: 0.28, cy: 0.52, r: 0.08 },
    { cx: -0.28, cy: 0.52, r: 0.08 },
    { cx: 0.28, cy: -0.52, r: 0.08 },
    { cx: -0.28, cy: -0.52, r: 0.08 },
    // Edge diamonds
    { cx: 0.52, cy: 0, r: 0.08 },
    { cx: -0.52, cy: 0, r: 0.08 },
    { cx: 0, cy: 0.52, r: 0.08 },
    { cx: 0, cy: -0.52, r: 0.08 },
  ];

  diamondPositions.forEach(({ cx, cy, r }) => {
    const d = new THREE.Path();
    d.moveTo(cx, cy + r);
    d.lineTo(cx + r, cy);
    d.lineTo(cx, cy - r);
    d.lineTo(cx - r, cy);
    d.lineTo(cx, cy + r);
    shape2.holes.push(d);
  });

  const geo2 = new THREE.ExtrudeGeometry(shape2, EXTRUDE_SETTINGS);
  geo2.center();
  geometries.push(geo2);

  // 4. Quatrefoil / Gothic Clover Lattice (Slide 3)
  const shape3 = new THREE.Shape();
  shape3.moveTo(-S, -S);
  shape3.lineTo(S, -S);
  shape3.lineTo(S, S);
  shape3.lineTo(-S, S);
  shape3.lineTo(-S, -S);

  const lr = 0.18; // lobe radius
  const ld = 0.32; // lobe center distance from origin
  const clover = new THREE.Path();
  clover.moveTo(0, ld - lr);
  clover.absarc(0, ld, lr, -Math.PI / 2, Math.PI + Math.PI / 2, true);
  clover.lineTo(-(ld - lr), 0);
  clover.absarc(-ld, 0, lr, 0, Math.PI * 2, true);
  clover.lineTo(0, -(ld - lr));
  clover.absarc(0, -ld, lr, Math.PI / 2, Math.PI * 2 + Math.PI / 2, true);
  clover.lineTo(ld - lr, 0);
  clover.absarc(ld, 0, lr, Math.PI, Math.PI * 3, true);
  clover.lineTo(0, ld - lr);
  
  shape3.holes.push(clover);

  // Add small corner arches
  const cCorners = [
    { cx: -0.52, cy: -0.52 }, { cx: 0.52, cy: -0.52 },
    { cx: 0.52, cy: 0.52 }, { cx: -0.52, cy: 0.52 }
  ];
  cCorners.forEach(({ cx, cy }) => {
    const corner = new THREE.Path();
    corner.absarc(cx, cy, 0.12, 0, Math.PI * 2, true);
    shape3.holes.push(corner);
  });

  const geo3 = new THREE.ExtrudeGeometry(shape3, EXTRUDE_SETTINGS);
  geo3.center();
  geometries.push(geo3);

  return geometries;
}
