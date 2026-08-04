import { useEffect, useState } from "react";

const TILTS = [-4, -2, 0, 2, 4, -3, 3];

export default function Gallery({ photos }) {
  const [openPhoto, setOpenPhoto] = useState(null);
  const [broken, setBroken] = useState({});

  // Tutup lightbox dengan tombol Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpenPhoto(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visiblePhotos = photos.filter((p) => !broken[p.id]);

  return (
    <section className="section">
      <p className="eyebrow">Galeri</p>
      <h2 className="section-title">Momen-Momen Kita</h2>
      <p className="section-sub">
        Kumpulan foto perjalanan kita. Klik salah satu untuk lihat lebih besar.
      </p>

      {visiblePhotos.length === 0 ? (
        <p className="notes-empty">
          Belum ada foto. Tambahkan file ke <code>frontend/public/photos</code> lalu
          daftarkan di <code>backend/data/photos.json</code> — lihat README untuk caranya.
        </p>
      ) : (
        <div className="gallery-grid">
          {visiblePhotos.map((p, i) => (
            <button
              key={p.id}
              className="polaroid"
              style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` }}
              onClick={() => setOpenPhoto(p)}
              aria-label={`Perbesar foto: ${p.caption || "kenangan"}`}
            >
              <img
                src={p.src}
                alt={p.caption || "Kenangan"}
                loading="lazy"
                onError={() => setBroken((b) => ({ ...b, [p.id]: true }))}
              />
              {p.caption && <span className="polaroid-caption">{p.caption}</span>}
            </button>
          ))}
        </div>
      )}

      {openPhoto && (
        <div className="lightbox" onClick={() => setOpenPhoto(null)}>
          <img src={openPhoto.src} alt={openPhoto.caption || "Kenangan"} />
          {openPhoto.caption && <p className="lightbox-caption">{openPhoto.caption}</p>}
          <button
            className="lightbox-close"
            onClick={() => setOpenPhoto(null)}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
