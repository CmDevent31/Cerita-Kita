import { useEffect, useState } from "react";

const API_BASE = "/api";
const TILTS = [-3, -1.5, 0, 1.5, 3, -2, 2];

export default function NotesWall() {
  const [notes, setNotes] = useState([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/notes`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => setError("Gagal memuat pesan. Pastikan backend menyala."));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, message }),
      });
      if (!res.ok) throw new Error("Gagal mengirim");
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setMessage("");
    } catch (err) {
      setError("Pesan gagal terkirim. Coba lagi ya.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <p className="eyebrow">Dari Hati ke Hati</p>
      <h2 className="section-title">Tinggalkan Pesan</h2>
      <p className="section-sub">
        Tulis sesuatu yang mungkin pengen kamu sampaikan tapi gak bisa
      </p>

      <form className="notes-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama kamu (opsional)"
          value={author}
          maxLength={40}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Tulis pesanmu di sini..."
          rows={3}
          value={message}
          maxLength={280}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" disabled={loading || !message.trim()}>
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>
        {error && <span style={{ color: "var(--blush)", fontSize: "0.8rem" }}>{error}</span>}
      </form>

      {notes.length === 0 ? (
        <p className="notes-empty">Belum ada pesan. Jadilah yang pertama menulis 🤍</p>
      ) : (
        <div className="notes-grid">
          {notes.map((n, i) => (
            <div
              className="note-card"
              key={n.id}
              style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` }}
            >
              <p className="note-message">"{n.message}"</p>
              <span className="note-author">— {n.author || "Anonim"}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
