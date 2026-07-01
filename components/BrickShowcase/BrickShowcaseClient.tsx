"use client";

import dynamic from "next/dynamic";

// BrickShowcase uses WebGL — must be dynamically imported
// inside a Client Component (cannot use ssr:false in a Server Component)
const BrickShowcase = dynamic(() => import("./BrickShowcase"), { ssr: false });

export default function BrickShowcaseClient() {
  return <BrickShowcase />;
}
