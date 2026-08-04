import { useState } from "react";

export default function Finale({ config }) {
  const [hearts, setHearts] = useState([]);

  function burst() {
    const newHearts = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 0.6,
      symbol: ["💛", "🤍", "💫"][i % 3],
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 2800);
  }

  return (
    <section className="section finale">
      <p className="eyebrow">Penutup</p>
      <h2 className="section-title">Terima Kasih, {config?.partnerB || "Sayang"}</h2>
      <p className="section-sub" style={{ margin: "0 auto" }}>
        Untuk setiap hari yang sudah kita lewati, dan untuk semua yang akan datang.
      </p>
      <button className="surprise-btn" onClick={burst}>
        Tekan untuk kejutan kecil ✨
      </button>

      <div className="heart-burst">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="heart"
            style={{ left: `${h.left}%`, bottom: 0, animationDelay: `${h.delay}s` }}
          >
            {h.symbol}
          </span>
        ))}
      </div>
    </section>
  );
}
