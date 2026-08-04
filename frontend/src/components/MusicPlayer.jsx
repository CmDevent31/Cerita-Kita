import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const MusicPlayer = forwardRef(function MusicPlayer({ src, title }, ref) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // Diekspos ke parent (App.jsx) supaya bisa dipanggil dari klik tombol splash.
  useImperativeHandle(ref, () => ({
    play() {
      const audio = audioRef.current;
      if (!audio) return;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    },
  }));

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  if (!src) return null;

  return (
    <div className="music-player">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        className={`music-btn ${playing ? "playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
      >
        <span className="music-disc">🎵</span>
      </button>
      {title && <span className="music-title">{playing ? title : "Putar musik"}</span>}
    </div>
  );
});

export default MusicPlayer;