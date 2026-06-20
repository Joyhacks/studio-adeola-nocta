import SceneClient from "../three/SceneClient";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* 3D background layer */}
      <div className="absolute inset-0 z-0">
        <SceneClient />
      </div>

      {/* Foreground content. pointer-events-none lets drags reach the canvas
          for OrbitControls verification. */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-32 md:px-12 md:py-48">
        <p className="eyebrow">Case Study — Nocta Watches, 2025</p>

        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl">Hero</h1>

        <div className="flex justify-between text-sm text-muted">
          <div>
            <p className="eyebrow">Client</p>
            <p className="mt-2">Nocta Watches</p>
          </div>
          <div className="text-right">
            <p className="eyebrow">Year</p>
            <p className="mt-2">2025</p>
          </div>
        </div>
      </div>
    </section>
  );
}
