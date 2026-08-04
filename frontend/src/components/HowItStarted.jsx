import { useEffect, useState } from "react";

export default function HowItStarted() {
  const [story, setStory] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/how-it-started")
      .then((r) => r.json())
      .then(setStory)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="section hiw-teaser">
      <p className="eyebrow">Sebelum Semuanya Dimulai</p>
      <h2 className="section-title">How's It Started</h2>
      <p className="section-sub" style={{ margin: "0 auto" }}>
        Sebelum lihat perjalanan kita di peta bintang, intip dulu yuk gimana awal mula
        obrolan kita.
        </p>
      <button className="hiw-btn" onClick={() => setOpen(true)}>
        Buka Ceritanya
      </button>

      {open && story && (
        <div className="hiw-overlay" onClick={() => setOpen(false)}>
          <div className="hiw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="hiw-close" onClick={() => setOpen(false)} aria-label="Tutup">
              ✕
            </button>

            <p className="hiw-intro">{story.intro}</p>

            <div className="hiw-chat">
              {story.messages.map((m, i) => (
                <div key={i} className={`hiw-bubble ${m.sender === "me" ? "me" : "them"}`}>
                  <p className="hiw-bubble-text">{m.text}</p>
                  <span className="hiw-bubble-time">{m.time}</span>
                </div>
              ))}
            </div>

            {story.closing && <p className="hiw-closing">{story.closing}</p>}
          </div>
        </div>
      )}
    </section>
  );
}