"use client";

import { useEffect, useState } from "react";

// Un modèle vu de plusieurs côtés : les vues défilent seules jusqu'au premier choix du visiteur.
// Embed dans un corps de cas : {{vues:nom|so:Sud-ouest|plan:Plan|…}}, images nom-so.webp, nom-plan.webp… dans bodyMedia.
export type VueModele = { nom: string; image: string };

const DUREE = 2800;

export default function Vues({ vues, largeur, hauteur }: { vues: VueModele[]; largeur: number; hauteur: number }) {
  const [k, setK] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setK((x) => (x + 1) % vues.length), DUREE);
    return () => clearInterval(t);
  }, [auto, vues.length]);

  return (
    <figure className="figure-cas">
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Point de vue">
        {vues.map((v, j) => (
          <button
            key={v.nom}
            type="button"
            onClick={() => {
              setAuto(false);
              setK(j);
            }}
            aria-pressed={j === k}
            className={`mono px-3 py-1.5 border transition-colors duration-300 ${
              j === k ? "bg-encre text-papier border-encre" : "border-trait hover:border-encre"
            }`}
          >
            {v.nom}
          </button>
        ))}
      </div>
      <div className="relative w-full" style={{ aspectRatio: `${largeur} / ${hauteur}` }}>
        {vues.map((v, j) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={v.image}
            src={v.image}
            alt={j === k ? `Le modèle, ${v.nom.toLowerCase()}` : ""}
            draggable={false}
            loading={j === 0 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700"
            style={{ opacity: j === k ? 1 : 0 }}
          />
        ))}
      </div>
    </figure>
  );
}
