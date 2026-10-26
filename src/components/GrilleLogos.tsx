"use client";

import { useEffect, useRef } from "react";

// Grille du footer : le monogramme WW répété, en fond. Près du curseur, chaque logo s'efface dans le bleu,
// et la trace s'efface lentement. Intensité = f(distance au curseur), mémorisée par cellule.
const TRACE =
  "M0 0 L100 0 L50 190Z M104.5 320 L154.5 133 L204.5 320Z M209 0 L309 0 L259 190Z M332.5 320 L436 0 L539.5 320Z M563 0 L663 0 L613 190Z M667.5 320 L717.5 133 L767.5 320Z M772 0 L872 0 L822 190Z";

export default function GrilleLogos({ className = "" }: { className?: string }) {
  const toile = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = toile.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const forme = new Path2D(TRACE);
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, cols = 0, rangs = 0, pasX = 0, pasY = 0;
    let encre = new Float32Array(0);
    const souris = { x: -9999, y: -9999 };

    const taille = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pasX = W < 640 ? 44 : 58;
      pasY = pasX * 0.62;
      cols = Math.ceil(W / pasX) + 1;
      rangs = Math.ceil(H / pasY) + 1;
      encre = new Float32Array(cols * rangs);
    };
    taille();
    const obs = new ResizeObserver(taille);
    obs.observe(cv);

    // Le curseur est suivi sur toute la fenêtre : la grille est en fond, sous le texte du footer
    const bouge = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const dedans = e.clientY >= r.top && e.clientY <= r.bottom;
      souris.x = dedans ? e.clientX - r.left : -9999;
      souris.y = dedans ? e.clientY - r.top : -9999;
    };
    window.addEventListener("pointermove", bouge, { passive: true });

    let image = 0;
    const dessiner = () => {
      ctx.clearRect(0, 0, W, H);
      const larg = pasX * 0.66, ech = larg / 872, R = pasX * 2.4;
      for (let j = 0; j < rangs; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const x = i * pasX + (j % 2 ? pasX / 2 : 0) - pasX / 2;
          const y = j * pasY;
          const d = Math.hypot(x + larg / 2 - souris.x, y + pasY / 3 - souris.y);
          const proche = Math.exp(-(d * d) / (R * R));
          encre[k] = Math.max(encre[k] * 0.985, proche); // trace qui s'efface
          const e = encre[k];
          ctx.save();
          const s = 1 - proche * 0.25;
          ctx.translate(x + larg / 2, y + (320 * ech) / 2);
          ctx.scale(s, s);
          ctx.translate(-larg / 2, -(320 * ech) / 2);
          ctx.scale(ech, ech);
          // repos : bleu clair discret ; sous le curseur : s'efface dans le bleu, puis revient lentement (trace)
          ctx.fillStyle = `rgba(199,206,255,${0.24 * (1 - Math.min(1, e * 1.3))})`;
          ctx.fill(forme);
          ctx.restore();
        }
      }
    };
    const boucle = () => { image = requestAnimationFrame(boucle); dessiner(); };
    if (calme) dessiner(); else boucle();

    return () => {
      cancelAnimationFrame(image);
      obs.disconnect();
      window.removeEventListener("pointermove", bouge);
    };
  }, []);

  return <canvas ref={toile} className={`block w-full pointer-events-none ${className}`} aria-hidden="true" />;
}
