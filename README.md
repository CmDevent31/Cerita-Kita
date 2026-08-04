# Cerita Kita — Website Anniversary

Website anniversary full-stack: backend **Node.js/Express** + frontend **React (Vite)**.

## Fitur

- **Hero dengan penghitung waktu real-time** — hari/jam/menit/detik sejak tanggal jadian, update tiap detik.
- **Peta Bintang Kenangan** — signature element: timeline kenangan digambar sebagai rasi bintang interaktif (SVG). Klik/tap bintang untuk membuka ceritanya (lengkap dengan foto kalau diisi), geser dengan tombol panah (desktop) atau **swipe kiri-kanan** (mobile), plus navigasi keyboard (panah kiri/kanan, Esc).
- **Galeri Foto** — koleksi foto bergaya polaroid (tiap foto miring acak, rapi saat di-hover), klik untuk buka **lightbox** (tampilan besar full-screen).
- **Dinding Pesan** — pengunjung bisa menulis pesan cinta yang tersimpan lewat API backend (persisten di `backend/data/notes.json`), tampil sebagai kartu bertumpuk gaya sticky note.
- **Kejutan kecil** — tombol di akhir halaman memicu animasi hati beterbangan.
- **Parallax halus** di hero yang mengikuti gerakan kursor (desktop) — bikin terasa hidup tanpa berlebihan.
- **Fully responsive** — sudah dites di 3 breakpoint (desktop, tablet ≤900px, mobile ≤640px + ≤380px untuk HP kecil), touch target diperbesar untuk jari, hover effect otomatis nonaktif di perangkat sentuh (`@media (hover: hover)`), dan menghormati `prefers-reduced-motion`.
- Desain gelap bernuansa langit malam & emas, font Cormorant Garamond + Manrope.

## Struktur folder

```
anniversary-site/
├── backend/            # Express API
│   ├── data/
│   │   ├── config.json     # nama pasangan, tanggal jadian, judul, tagline
│   │   ├── timeline.json   # daftar kenangan (tanggal, judul, deskripsi, foto opsional)
│   │   ├── photos.json     # daftar foto galeri
│   │   └── notes.json      # auto-generate, menyimpan pesan pengunjung
│   ├── server.js
│   └── package.json
└── frontend/            # React + Vite
    ├── public/
    │   └── photos/         # taruh semua file foto di sini
    ├── src/
    │   ├── components/
    │   │   ├── Hero.jsx
    │   │   ├── FloatingParticles.jsx
    │   │   ├── Constellation.jsx
    │   │   ├── Gallery.jsx
    │   │   ├── NotesWall.jsx
    │   │   └── Finale.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Cara menjalankan

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Berjalan di `http://localhost:4000`.

### 2. Frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Berjalan di `http://localhost:5173`. Request ke `/api/*` otomatis diteruskan ke backend (lihat `vite.config.js`).

Buka `http://localhost:5173` di browser.

## Kustomisasi

Edit langsung tanpa perlu ubah kode React:

- **Nama & tanggal jadian** → `backend/data/config.json`
- **Daftar kenangan / momen** → `backend/data/timeline.json` (tambah objek baru dengan `id`, `date`, `title`, `description`, `image`)
- **Warna & font** → variabel di bagian atas `frontend/src/index.css` (`--ink-navy`, `--gold`, `--blush`, dll.)

## Cara memasukkan foto kenangan

Ada dua tempat foto bisa muncul: **kartu kenangan** di Peta Bintang (satu foto per momen) dan **Galeri** (koleksi foto bebas, bisa banyak).

### Langkah-langkah

1. **Taruh file foto** di folder `frontend/public/photos/`. Contoh: `frontend/public/photos/liburan-bandung.jpg`. Boleh JPG, PNG, atau WEBP — usahakan ukurannya sudah dikompres (di bawah ±500KB per foto) supaya website tetap ringan.

2. **Untuk foto di kartu kenangan** (Peta Bintang): buka `backend/data/timeline.json`, isi field `"image"` pada momen yang mau dikasih foto:

   ```json
   {
     "id": 2,
     "date": "2023-06-10",
     "title": "Kencan Pertama ke Bandung",
     "description": "Ngopi sore sambil ngobrol sampai lupa waktu.",
     "image": "/photos/liburan-bandung.jpg"
   }
   ```
   Path-nya **harus** diawali `/photos/` (bukan `frontend/public/photos/...`) karena itu path relatif dari root website.

3. **Untuk galeri foto**: buka `backend/data/photos.json`, tambahkan objek baru untuk tiap foto:

   ```json
   [
     {
       "id": 1,
       "src": "/photos/liburan-bandung.jpg",
       "caption": "Sore-sore di Bandung",
       "date": "2023-06-10"
     },
     {
       "id": 2,
       "src": "/photos/ulang-tahun.jpg",
       "caption": "Ulang tahun kedua",
       "date": "2024-08-17"
     }
   ]
   ```
   `id` harus unik, `caption` dan `date` boleh dikosongkan kalau tidak perlu (`date` dipakai untuk urutan, terbaru di atas).

4. Simpan file, lalu refresh browser (`npm run dev` di frontend tidak perlu di-restart, karena `photos.json` dibaca ulang tiap request lewat backend — cukup refresh backend kalau file `.json` diedit saat server sedang jalan, atau restart `npm run dev` di folder backend supaya aman).

5. Kalau foto belum ditambahkan atau path-nya salah, Galeri akan otomatis menyembunyikan foto yang gagal dimuat, dan kartu kenangan tetap tampil tanpa foto — jadi tidak akan tampil ikon gambar rusak.

> Data `photos.json` yang datang dari saya cuma contoh (`contoh-1.jpg`, belum ada filenya). Hapus atau ganti isinya sesuai foto kamu sendiri.

## Build untuk production

```bash
cd frontend
npm run build
```

Hasil build ada di `frontend/dist/`, tinggal di-deploy ke hosting statis (Vercel/Netlify) sementara backend di-deploy terpisah (Railway/Render), lalu ubah proxy `/api` di `vite.config.js` atau tambahkan environment variable base URL sesuai domain backend production.
