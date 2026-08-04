import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const TIMELINE_FILE = path.join(DATA_DIR, "timeline.json");
const NOTES_FILE = path.join(DATA_DIR, "notes.json");
const PHOTOS_FILE = path.join(DATA_DIR, "photos.json");
const HOW_IT_STARTED_FILE = path.join(DATA_DIR, "how-it-started.json");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Pastikan file notes.json ada
async function ensureNotesFile() {
  try {
    await fs.access(NOTES_FILE);
  } catch {
    await fs.writeFile(NOTES_FILE, "[]", "utf-8");
  }
}

async function readJSON(file) {
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw);
}

async function writeJSON(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// --- ROUTES ---

// Konfigurasi pasangan (nama, tanggal jadian, judul, tagline)
app.get("/api/config", async (req, res) => {
  try {
    const config = await readJSON(CONFIG_FILE);
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: "Gagal membaca konfigurasi" });
  }
});

// Timeline kenangan
app.get("/api/timeline", async (req, res) => {
  try {
    const timeline = await readJSON(TIMELINE_FILE);
    res.json(timeline.sort((a, b) => new Date(a.date) - new Date(b.date)));
  } catch (err) {
    res.status(500).json({ error: "Gagal membaca timeline" });
  }
});

// Galeri foto (terpisah dari timeline, urutan bebas berdasarkan tanggal)
app.get("/api/photos", async (req, res) => {
  try {
    const photos = await readJSON(PHOTOS_FILE);
    res.json(
      photos.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    );
  } catch (err) {
    res.status(500).json({ error: "Gagal membaca galeri foto" });
  }
});

// Cerita "How's It Started" — rekaan chat pertama, ditampilkan di popup
app.get("/api/how-it-started", async (req, res) => {
  try {
    const story = await readJSON(HOW_IT_STARTED_FILE);
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: "Gagal membaca cerita" });
  }
});

// Statistik lucu manual
const FUN_STATS_FILE = path.join(DATA_DIR, "fun-stats.json");
app.get("/api/fun-stats", async (req, res) => {
  try {
    const stats = await readJSON(FUN_STATS_FILE);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Gagal membaca statistik" });
  }
});
// Ambil semua pesan cinta
app.get("/api/notes", async (req, res) => {
  try {
    await ensureNotesFile();
    const notes = await readJSON(NOTES_FILE);
    res.json(notes.sort((a, b) => b.id - a.id));
  } catch (err) {
    res.status(500).json({ error: "Gagal membaca pesan" });
  }
});

// Tambah pesan cinta baru
app.post("/api/notes", async (req, res) => {
  try {
    const { author, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });
    }
    await ensureNotesFile();
    const notes = await readJSON(NOTES_FILE);
    const newNote = {
      id: Date.now(),
      author: (author || "Anonim").trim().slice(0, 40),
      message: message.trim().slice(0, 280),
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    await writeJSON(NOTES_FILE, notes);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan pesan" });
  }
});

// Hapus pesan (opsional, untuk moderasi pesan iseng)
app.delete("/api/notes/:id", async (req, res) => {
  try {
    await ensureNotesFile();
    const notes = await readJSON(NOTES_FILE);
    const filtered = notes.filter((n) => String(n.id) !== req.params.id);
    await writeJSON(NOTES_FILE, filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus pesan" });
  }
});

// hasil build React (frontend/dist) sebagai file statis
const FRONTEND_DIST = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(FRONTEND_DIST));

// Semua route selain /api/* diarahkan ke index.html (perlu untuk SPA React)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Anniversary backend jalan di http://localhost:${PORT}`);
});
