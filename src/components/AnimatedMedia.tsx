"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedMediaProps {
  src: string;
  alt: string;
}

/**
 * Shows a static first-frame poster by default.
 * Plays the animation on hover (desktop) or tap (mobile).
 * Falls back to always-playing if canvas/CORS is unavailable.
 */
export default function AnimatedMedia({ src, alt }: AnimatedMediaProps) {
  const [poster, setPoster] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        setPoster(canvas.toDataURL("image/webp"));
      } catch {
        // CORS or canvas blocked — fall back to always playing
      }
    };
    img.src = src;
  }, [src]);

  const displayed = playing || !poster ? src : poster;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={displayed}
      alt={alt}
      className="max-w-full max-h-[85vh] w-auto h-auto mx-auto block cursor-pointer"
      loading="lazy"
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
      onClick={() => setPlaying((p) => !p)}
      title={playing ? "Cliquer pour mettre en pause" : "Cliquer pour lancer"}
    />
  );
}
