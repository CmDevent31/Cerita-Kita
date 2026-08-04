import { useEffect, useRef, useState } from "react";

function getDaysTogether(startDate) {
  if (!startDate) return 0;
  const diff = Date.now() - new Date(startDate).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function useCountUp(target, start) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const duration = 1100;
    const t0 = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return value;
}

function StatCard({ icon, label, value, suffix, start }) {
  const shown = useCountUp(value, start);
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">
        {shown.toLocaleString("id-ID")}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function FunStats({ config }) {
  const [stats, setStats] = useState([]);
  const [start, setStart] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch("/api/fun-stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  // Mulai animasi hitung begitu section terlihat di layar
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const days = getDaysTogether(config?.startDate);
  const autoStats = [
    { icon: "📅", label: "Hari Bersama", value: days, suffix: "" },
    { icon: "🗓️", label: "Minggu Bersama", value: Math.floor(days / 7), suffix: "" },
  ];

  return (
    <section className="section" ref={sectionRef}>
      <p className="eyebrow">Iseng-Iseng Berhadiah</p>
      <h2 className="section-title">Statistik Lucu</h2>
      <p className="section-sub">Angka-angka receh yang bikin senyum kalau dibaca ulang.</p>

      <div className="stats-grid">
        {[...autoStats, ...stats].map((s, i) => (
          <StatCard key={i} {...s} start={start} />
        ))}
      </div>
    </section>
  );
}