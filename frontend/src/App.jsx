import { useEffect, useRef, useState } from "react";
import MusicPlayer from "./components/MusicPlayer.jsx";
import IntroSplash from "./components/IntroSplash.jsx";
import Hero from "./components/Hero.jsx";
import Constellation from "./components/Constellation.jsx";
import Gallery from "./components/Gallery.jsx";
import NotesWall from "./components/NotesWall.jsx";
import Finale from "./components/Finale.jsx";
import HowItStarted from "./components/HowItStarted.jsx";
import FunStats from "./components/FunStats.jsx";
import ShareCard from "./components/ShareCard.jsx";


const API_BASE = "/api";

export default function App() {
  const [config, setConfig] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [err, setErr] = useState("");
  const musicRef = useRef(null);

  function handleEnter() {
  musicRef.current?.play();
  }

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/config`).then((r) => r.json()),
      fetch(`${API_BASE}/timeline`).then((r) => r.json()),
      fetch(`${API_BASE}/photos`).then((r) => r.json()),
    ])
      .then(([cfg, tl, ph]) => {
        setConfig(cfg);
        setTimeline(tl);
        setPhotos(ph);
      })
      .catch(() =>
        setErr(
          "Tidak bisa terhubung ke backend. Jalankan server di folder /backend (npm run dev) lalu refresh halaman ini."
        )
      );
  }, []);

  return (
    <div>
      <IntroSplash config={config} onEnter={handleEnter} />
      <MusicPlayer ref={musicRef} src={config?.musicSrc} title={config?.musicTitle} />
      <Hero config={config} />
      
      <HowItStarted />

      <section className="section">
        <p className="eyebrow">Peta Kenangan</p>
        <h2 className="section-title">Bintang-Bintang Kita</h2>
        <p className="section-sub">
          Setiap bintang adalah satu momen. Klik untuk membuka ceritanya.
        </p>
        {err && <p style={{ color: "var(--blush)" }}>{err}</p>}
        {timeline.length > 0 && <Constellation timeline={timeline} />}
      </section>

      <Gallery photos={photos} />
      <NotesWall />
      <Finale config={config} />

      <footer>
        Dibuat dengan 🤍 oleh {config?.partnerA || "seseorang"} — {new Date().getFullYear()}
      </footer>
    </div>
  );
}
