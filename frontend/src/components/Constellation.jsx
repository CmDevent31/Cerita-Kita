import { useEffect, useMemo, useState } from "react";

const WIDTH = 800;
const HEIGHT = 480;

// Hash sederhana supaya posisi tiap bintang konsisten (tidak acak ulang tiap render)
// tapi tetap terlihat organik, bukan grid kaku.
function seededPos(seed, index, total) {
  const angleSeed = (seed * 9301 + 49297) % 233280;
  const rand = angleSeed / 233280;

  // Sebar horizontal berurutan sesuai kronologi, vertikal sedikit acak (zig-zag)
  const x = 60 + (index / Math.max(1, total - 1)) * (WIDTH - 120);
  const y = HEIGHT / 2 + Math.sin(seed * 1.7 + index) * (HEIGHT / 2 - 70) * (0.4 + rand * 0.6);
  return { x, y };
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Constellation({ timeline }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const stars = useMemo(() => {
    return timeline.map((item, i) => ({
      ...item,
      ...seededPos(item.id * 13.37, i, timeline.length),
    }));
  }, [timeline]);

  const active = activeIndex !== null ? stars[activeIndex] : null;

  function select(index) {
    setActiveIndex((current) => (current === index ? null : index));
  }

  function step(delta) {
    setActiveIndex((current) => {
      if (current === null) return delta > 0 ? 0 : stars.length - 1;
      return (current + delta + stars.length) % stars.length;
    });
  }

  // Navigasi keyboard: panah kiri/kanan geser antar bintang saat panel terbuka
  useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e) {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Escape") setActiveIndex(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, stars.length]);

  // Swipe kiri/kanan di panel detail untuk pindah kenangan (enak dipakai di HP)
  let touchStartX = null;
  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    touchStartX = null;
  }

  return (
    <div className="sky-wrap">
      <div className="sky">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Peta bintang kenangan"
        >
          {stars.slice(1).map((s, i) => {
            const prev = stars[i];
            return (
              <line
                key={`line-${s.id}`}
                className="sky-line"
                x1={prev.x}
                y1={prev.y}
                x2={s.x}
                y2={s.y}
              />
            );
          })}

          {stars.map((s, i) => (
            <g
              key={s.id}
              onClick={() => select(i)}
              tabIndex={0}
              role="button"
              aria-label={`Kenangan: ${s.title}`}
              onKeyDown={(e) => e.key === "Enter" && select(i)}
              style={{ cursor: "pointer" }}
            >
              {/* lingkaran tak terlihat, memperbesar area sentuh di layar kecil */}
              <circle cx={s.x} cy={s.y} r={22} fill="transparent" />
              <circle
                className={`star ${i === activeIndex ? "active" : ""}`}
                cx={s.x}
                cy={s.y}
                r={i === activeIndex ? 8 : 5.5}
                fill="var(--gold-soft)"
              />
              <text className="star-label" x={s.x} y={s.y - 16} textAnchor="middle">
                {new Date(s.date).getFullYear()}
              </text>
            </g>
          ))}
        </svg>

        {!active && <span className="sky-hint">Ketuk salah satu bintang ✦</span>}
      </div>

      <div
        className={`sky-detail ${active ? "open" : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {active && (
          <>
            <button
              className="sky-nav prev"
              onClick={() => step(-1)}
              aria-label="Kenangan sebelumnya"
            >
              ‹
            </button>

            <div className="memory-card">
              {active.image && (
                <img
                  className="memory-photo"
                  src={active.image}
                  alt={active.title}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <span className="memory-date">{formatDate(active.date)}</span>
              <h3 className="memory-title">{active.title}</h3>
              <p className="memory-desc">{active.description}</p>
              <span className="memory-index">
                {activeIndex + 1} / {stars.length}
              </span>
            </div>

            <button
              className="sky-nav next"
              onClick={() => step(1)}
              aria-label="Kenangan berikutnya"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
