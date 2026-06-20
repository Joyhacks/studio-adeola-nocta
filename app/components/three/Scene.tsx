"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import Watch from "./Watch";

export default function Scene() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 1.2, 4.5], fov: 35 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: 3,
        toneMappingExposure: 1.1,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        // Keep the browser from giving up on a lost context — ask it to recover.
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          console.warn("WebGL context lost — attempting recovery");
        });
      }}
    >
      {/* Subtle ambient — just lifts the pure blacks */}
      <ambientLight intensity={0.15} />

      {/* KEY LIGHT — main light, top-right. No castShadow: we use ContactShadows
          instead of real-time shadow maps to keep GPU cost down. */}
      <directionalLight position={[6, 8, 6]} intensity={3.5} />

      {/* FILL LIGHT — soft, opposite side */}
      <directionalLight position={[-5, 3, 5]} intensity={1.0} color="#ffffff" />

      {/* RIM LIGHT — gold-tinted, behind the watch for a warm edge halo */}
      <directionalLight position={[0, 2, -8]} intensity={1.5} color="#C9A961" />

      {/* TOP-DOWN — subtle point light mimicking the dial highlight the HDRI
          used to provide (Environment removed to avoid GPU context loss). */}
      <pointLight position={[0, 5, 2]} intensity={0.8} color="#ffffff" />

      <Watch />

      {/* CONTACT SHADOW — soft grounding shadow on an invisible floor below the
          watch. Half-res (256) is plenty for a soft blob and cheaper on GPU. */}
      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.4}
        scale={6}
        blur={2.5}
        far={2}
        resolution={256}
        color="#000000"
      />
    </Canvas>
  );
}
