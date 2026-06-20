"use client";

import dynamic from "next/dynamic";

// Three.js can't run on the server. This client boundary lets us lazy-load
// the Canvas with ssr: false, which next/dynamic only permits in a Client Component.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneClient() {
  return <Scene />;
}
