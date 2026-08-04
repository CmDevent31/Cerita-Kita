import { useEffect, useRef, useState } from "react";
import FloatingParticles from "./FloatingParticles.jsx";

function getElapsed(startDate) {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function Hero({ config }) {
  const heroRef = useRef(null);
  const [elapsed, setElapsed] = useState(() =>
    config ? getElapsed(config.startDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    if (!config) return;
    const id = setInterval(() => setElapsed(getElapsed(config.startDate)), 1000);
    return () => clearInterval(id);
  }, [config]);

  // Parallax halus mengikuti kursor — hanya berarti di perangkat dengan mouse,
  // jadi tidak mengganggu di HP (event pointermove tetap aman untuk touch, efeknya kecil).
  function handlePointerMove(e) {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--mx", px.toFixed(3));
    el.style.setProperty("--my", py.toFixed(3));
  }

  const units = [
    { label: "Hari", value: elapsed.days },
    { label: "Jam", value: elapsed.hours },
    { label: "Menit", value: elapsed.minutes },
    { label: "Detik", value: elapsed.seconds },
  ];

  return (
    <section className="hero" ref={heroRef} onPointerMove={handlePointerMove}>
      <FloatingParticles />
      <p className="eyebrow hero-eyebrow">
        {config ? `${config.partnerA} & ${config.partnerB}` : "Memuat..."}
      </p>
      <h1 className="hero-title">{config?.title || "Cerita Kita"}</h1>
      <p className="hero-tagline">{config?.tagline}</p>

      <div className="counter">
        {units.map((u) => (
          <div className="counter-unit" key={u.label}>
            <span className="counter-number">{String(u.value).padStart(2, "0")}</span>
            <span className="counter-label">{u.label}</span>
          </div>
        ))}
      </div>

      <span className="scroll-hint">Gulir untuk lihat kenangan ↓</span>
    </section>
  );
}
