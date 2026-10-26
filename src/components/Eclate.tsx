"use client";

import { useRef, useState } from "react";

// Éclaté d'un modèle : calques PNG transparents de même cadrage, empilés du bas vers le haut.
// Au survol (ou au toucher sur téléphone) la pile se réduit et les couches se séparent verticalement ;
// survoler une ligne de la légende isole sa couche.
// Embed dans un corps de cas : {{eclate:nom|Légende 1#couleur|Légende 2#couleur|…}},
// images nommées nom-1.png (bas) … nom-N.png (haut) dans bodyMedia.
export type Couche = { url: string; legende?: string; couleur?: string };

const ECHELLE = 0.52; // taille de la pile ouverte, pour que tout tienne dans le même cadre
const ECART = 0.21; // écart entre deux couches ouvertes, en hauteur de couche

export default function Eclate({ couches, largeur, hauteur }: { couches: Couche[]; largeur: number; hauteur: number }) {
  const [ouvert, setOuvert] = useState(false);
  const [isolee, setIsolee] = useState<number | null>(null);
  const n = couches.length;
  // Souris : le survol ouvre ; toucher : un tap ouvre ou referme (sans que le survol simulé l'annule)
  const souris = useRef(false);

  return (
    <figure className="figure-cas">
      <div
        className="eclate relative w-full cursor-pointer select-none"
        style={{ aspectRatio: `${largeur} / ${hauteur}` }}
        onPointerEnter={(e) => {
          souris.current = e.pointerType === "mouse";
          if (souris.current) setOuvert(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setOuvert(false);
        }}
        onPointerDown={(e) => {
          souris.current = e.pointerType === "mouse";
        }}
        onClick={() => {
          if (!souris.current) setOuvert((o) => !o);
        }}
        role="img"
        aria-label={`Éclaté en ${n} couches : ${couches.map((c) => c.legende).filter(Boolean).join(", ")}`}
      >
        <div
          className="eclate-pile absolute inset-0"
          style={{ transform: `scale(${ouvert ? ECHELLE : 1})` }}
        >
          {couches.map((c, i) => {
            // Couches réparties autour du centre : la plus basse descend, la plus haute monte
            const decalage = ((n - 1) / 2 - i) * ECART * 100;
            const haut = i === n - 1;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c.url}
                src={c.url}
                alt=""
                draggable={false}
                className="eclate-couche absolute inset-0 w-full h-full object-contain"
                style={{
                  transform: ouvert ? `translateY(${decalage}%)` : "none",
                  opacity: isolee !== null && isolee !== i ? 0.12 : ouvert && haut ? 0.6 : 1,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={() => setOuvert((o) => !o)}
          className="mono text-bleu"
          aria-pressed={ouvert}
        >
          {ouvert ? "Rassembler ↓" : "Séparer les couches ↑"}
        </button>
        {couches.map((c, i) =>
          c.legende ? (
            <span
              key={i}
              className="mono text-gris inline-flex items-center gap-2 transition-colors duration-300 hover:text-encre"
              onMouseEnter={() => {
                setOuvert(true);
                setIsolee(i);
              }}
              onMouseLeave={() => setIsolee(null)}
            >
              {c.couleur && <span className="inline-block w-2.5 h-2.5" style={{ background: c.couleur }} />}
              {c.legende}
            </span>
          ) : null
        )}
      </div>
    </figure>
  );
}
