import { useRef, useState } from "react";

const WIDTH = 1080;
const HEIGHT = 1350;

function getDaysTogether(startDate) {
  if (!startDate) return 0;
  const diff = Date.now() - new Date(startDate).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lines = [];
  words.forEach((word) => {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = test;
    }
  });
  lines.push(line.trim());
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length;
}

export default function ShareCard({ config }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  async function generate() {
    setLoading(true);
    await document.fonts.ready;

    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext("2d");

    // Background gradasi senada tema
    const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    grad.addColorStop(0, "#171126");
    grad.addColorStop(1, "#2c2140");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Titik-titik bintang dekoratif
    ctx.fillStyle = "rgba(233, 201, 138, 0.5)";
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * WIDTH;
      const y = Math.random() * HEIGHT * 0.5;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.textAlign = "center";

    // Eyebrow
    ctx.fillStyle = "#d9a857";
    ctx.font = "600 26px Manrope, sans-serif";
    ctx.fillText("C E R I T A   K I T A", WIDTH / 2, 220);

    // Nama pasangan
    ctx.fillStyle = "#f3ece1";
    ctx.font = "italic 600 76px 'Cormorant Garamond', serif";
    ctx.fillText(`${config?.partnerA || "Kamu"} & ${config?.partnerB || "Sayang"}`, WIDTH / 2, 320);

    // Angka hari besar
    const days = getDaysTogether(config?.startDate);
    ctx.fillStyle = "#e9c98a";
    ctx.font = "700 220px 'Cormorant Garamond', serif";
    ctx.fillText(String(days), WIDTH / 2, 620);

    ctx.fillStyle = "#cfc6b8";
    ctx.font = "500 32px Manrope, sans-serif";
    ctx.fillText("HARI BERSAMA", WIDTH / 2, 680);

    // Tagline
    ctx.fillStyle = "#e8a2a8";
    ctx.font = "italic 500 34px 'Cormorant Garamond', serif";
    ctx.textAlign = "center";
    wrapText(
      ctx,
      config?.tagline || "Setiap hari bersamamu adalah hadiah.",
      WIDTH / 2 - 300,
      850,
      600,
      46
    );

    // Footer
    ctx.fillStyle = "rgba(243,236,225,0.5)";
    ctx.font = "400 24px Manrope, sans-serif";
    ctx.fillText("dibuat dengan 🤍", WIDTH / 2, HEIGHT - 80);

    canvas.toBlob((blob) => {
      setPreviewUrl(URL.createObjectURL(blob));
      setLoading(false);
    }, "image/png");
  }

  function download() {
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `${config?.partnerA || "kita"}-${config?.partnerB || "sayang"}-anniversary.png`;
    a.click();
  }

  return (
    <section className="section share-section">
      <p className="eyebrow">Buat Dibagikan</p>
      <h2 className="section-title">Kartu Digital Kalian</h2>
      <p className="section-sub" style={{ margin: "0 auto" }}>
        Generate kartu ringkasan cantik buat di-post ke story.
      </p>
      <button className="share-btn" onClick={generate} disabled={loading}>
        {loading ? "Membuat kartu..." : "Buat Kartu ✨"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {previewUrl && (
        <div className="share-overlay" onClick={() => setPreviewUrl(null)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Kartu anniversary" className="share-preview-img" />
            <div className="share-actions">
              <button className="share-btn" onClick={download}>
                Download 📥
              </button>
              <button className="hiw-btn" onClick={() => setPreviewUrl(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}