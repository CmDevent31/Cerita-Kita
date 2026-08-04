import { useEffect, useState } from "react";

export default function IntroSplash({ config, onEnter }) {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = hidden ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hidden]);

  function handleEnter() {
    onEnter(); // panggil play() musik DULU, sebelum apapun — biar tetap dianggap gesture user
    setClosing(true);
  }

  if (hidden) return null;

  return (
    <div
      className={`splash ${closing ? "closing" : ""}`}
      onTransitionEnd={() => closing && setHidden(true)}
    >
      <h1 className="splash-title">{config?.title || "Cerita Kita"}</h1>
      <button className="splash-btn" onClick={handleEnter}>
        Mulai
      </button>
    </div>
  );
}