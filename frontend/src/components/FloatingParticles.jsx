import { useMemo } from "react";

// Partikel dekoratif di background hero — dibuat sekali dengan useMemo
// supaya posisi & delay tiap partikel konsisten selama komponen hidup.
export default function FloatingParticles({ count = 22 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 12,
    }));
  }, [count]);

  return (
    <div className="hero-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            bottom: -20,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
