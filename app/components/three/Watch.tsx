"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A stylized luxury watch built entirely from primitive geometries.
// Geometry from 8A; materials from 8B; this pass (8C) adds idle ambient motion.
export default function Watch() {
  // The 12 (top), 3, 6, and 9 o'clock markers are the thicker "cardinal" markers.
  const cardinalMarkers = new Set([0, 3, 6, 9]);

  // Refs driven by useFrame for the continuous idle motion.
  const watchGroupRef = useRef<THREE.Group>(null!);
  const hourHandRef = useRef<THREE.Group>(null!);
  const minuteHandRef = useRef<THREE.Group>(null!);
  const secondHandRef = useRef<THREE.Group>(null!);

  // Resting pose: the dial face tilts up ~14° toward the camera. The useFrame
  // logic layers breathing + parallax on top of this base, lerping to absolute
  // values each frame so the base tilt never drifts away.
  const BASE_TILT_X = -0.25;

  useFrame((state, delta) => {
    void delta; // reserved for future scroll-driven / damped motion (not used yet)
    const t = state.clock.elapsedTime;

    // 1. Cursor parallax — watch tilts subtly toward the mouse. state.pointer is
    //    R3F's normalized Vector2 (-1..1 across the viewport). Kept gentle.
    const targetRotationX = state.pointer.y * 0.15; // mouse-y → tilt x
    const targetRotationY = state.pointer.x * 0.15; // mouse-x → tilt y

    // 2. Idle rotation of the entire watch — barely perceptible breathing, like
    //    a luxury object resting on a slow display turntable. Blended with the
    //    base resting tilt and the parallax above into a single absolute target.
    if (watchGroupRef.current) {
      const breathX = Math.sin(t * 0.1) * 0.04;
      const breathY = Math.sin(t * 0.15) * 0.08;

      const combinedX = BASE_TILT_X + breathX + targetRotationX;
      const combinedY = breathY + targetRotationY;

      // Smooth lerp toward the target — soft, weighted, momentum-like motion.
      watchGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        watchGroupRef.current.rotation.x,
        combinedX,
        0.05
      );
      watchGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        watchGroupRef.current.rotation.y,
        combinedY,
        0.05
      );
    }

    // 3. Watch hands — moving like a real mechanical watch.
    // Real second hand: ticks 60 times per minute = 1 tick per second.
    // Math.floor gives the stepped "tick" feel rather than a glide.
    if (secondHandRef.current) {
      const seconds = Math.floor(t) % 60;
      secondHandRef.current.rotation.y = -(seconds / 60) * Math.PI * 2;
    }

    // Minute hand: smooth, sped up so users see it move within a visit —
    // one full revolution every 12 seconds (a real watch would take 60 min).
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.y = (-(t / 12) * Math.PI * 2) % (Math.PI * 2);
    }

    // Hour hand: very slow — one revolution every 144 seconds in the demo.
    if (hourHandRef.current) {
      hourHandRef.current.rotation.y = (-(t / 144) * Math.PI * 2) % (Math.PI * 2);
    }
  });

  return (
    <group ref={watchGroupRef}>
      {/* CASE — brushed-steel outer ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.3, 64]} />
        <meshPhysicalMaterial
          color="#3a3a3c"
          metalness={1}
          roughness={0.25}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* DIAL — matte black enamel face */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.3}
          roughness={0.85}
          clearcoat={0.2}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* SAPPHIRE CRYSTAL — transparent glass cover over the dial.
          No transmission/thickness/ior (the GPU-expensive parts); clearcoat +
          opacity give the glass sheen at ~10x lower cost. */}
      <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.12, 1.12, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* HOUR MARKERS — 12 polished gold rectangles around the dial */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const isCardinal = cardinalMarkers.has(i);
        return (
          <mesh
            key={`marker-${i}`}
            position={[Math.sin(angle) * 0.95, 0.19, Math.cos(angle) * 0.95]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry
              args={isCardinal ? [0.06, 0.02, 0.22] : [0.04, 0.02, 0.18]}
            />
            <meshPhysicalMaterial
              color="#C9A961"
              metalness={1}
              roughness={0.15}
              clearcoat={0.6}
              clearcoatRoughness={0.2}
            />
          </mesh>
        );
      })}

      {/* HOUR HAND — polished silver-cream; group pivots around the watch center */}
      <group ref={hourHandRef} position={[0, 0.18, 0]}>
        <mesh position={[0, 0, 0.225]}>
          <boxGeometry args={[0.04, 0.04, 0.45]} />
          <meshPhysicalMaterial
            color="#E8E8E2"
            metalness={1}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.25}
          />
        </mesh>
      </group>

      {/* MINUTE HAND — longer, thinner; same polished silver-cream */}
      <group ref={minuteHandRef} position={[0, 0.19, 0]}>
        <mesh position={[0, 0, 0.35]}>
          <boxGeometry args={[0.025, 0.04, 0.7]} />
          <meshPhysicalMaterial
            color="#E8E8E2"
            metalness={1}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.25}
          />
        </mesh>
      </group>

      {/* SECOND HAND — very thin polished gold sweep */}
      <group ref={secondHandRef} position={[0, 0.20, 0]}>
        <mesh position={[0, 0, 0.425]}>
          <boxGeometry args={[0.01, 0.04, 0.85]} />
          <meshPhysicalMaterial
            color="#C9A961"
            metalness={1}
            roughness={0.15}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </mesh>
      </group>

      {/* CENTER PIN — polished gold cylinder where the hands meet */}
      <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 32]} />
        <meshPhysicalMaterial
          color="#C9A961"
          metalness={1}
          roughness={0.15}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* CROWN — slightly lighter steel knob so it reads as a separate part */}
      <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
        <meshPhysicalMaterial
          color="#4a4a4c"
          metalness={1}
          roughness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* STRAP STUBS — matte leather connectors at top and bottom of the case */}
      <mesh position={[0, 0, 1.2]}>
        <boxGeometry args={[0.4, 0.15, 0.3]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.05}
          roughness={0.95}
          clearcoat={0.1}
          clearcoatRoughness={0.8}
        />
      </mesh>
      <mesh position={[0, 0, -1.2]}>
        <boxGeometry args={[0.4, 0.15, 0.3]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.05}
          roughness={0.95}
          clearcoat={0.1}
          clearcoatRoughness={0.8}
        />
      </mesh>
    </group>
  );
}
