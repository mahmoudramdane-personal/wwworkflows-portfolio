"use client";

import { useState } from "react";

// Un calque par famille : on choisit une famille, elle s'isole en couleur sur le modèle entier estompé.
// Embed dans un corps de cas : {{familles:nom|Phrase d'ouverture|Libellé#couleur:Phrase:Nombre|…}},
// images nom-01.webp … nom-NN.webp (une famille seule) et nom-tout.webp (le modèle entier) dans bodyMedia.
export type Famille = { libelle: string; couleur?: string; phrase?: string; nombre?: string; image: string };

export default function Familles({
  intro,
  familles,
  tout,
  largeur,
  hauteur,
}: {
  intro?: string;
  familles: Famille[];
  tout: string;
  largeur: number;
  hauteur: number;
}) {
  const [k, setK] = useState<number | null>(null);
  const f = k === null ? null : familles[k];

  return (
    <figure className="figure-cas">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative w-full" style={{ aspectRatio: `${largeur} / ${hauteur}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tout}
            alt={f ? "" : "Le modèle complet"}
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
            style={{ opacity: f ? 0.16 : 1 }}
          />
          {familles.map((x, j) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={x.image}
              src={x.image}
              alt={j === k ? x.libelle : ""}
              draggable={false}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
              style={{ opacity: j === k ? 1 : 0 }}
            />
          ))}
        </div>

        <div>
          <p className="mono text-gris">
            {f ? `Calque ${String(k! + 1).padStart(2, "0")} / ${String(familles.length).padStart(2, "0")}` : "Le modèle"}
          </p>
          <p className="mt-2 text-2xl tracking-tight leading-tight">{f ? f.libelle : "Tout"}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-gris">
            {f ? `${f.phrase || ""}${f.nombre ? ` ${f.nombre} éléments.` : ""}` : `${intro ? intro + " " : ""}Choisissez une famille pour l'isoler.`}
          </p>
          <ol className="mt-6">
            {familles.map((x, j) => (
              <li key={j}>
                <button
                  type="button"
                  onClick={() => setK(j)}
                  aria-pressed={j === k}
                  className={`w-full flex items-center gap-3 py-1.5 border-t border-trait text-left text-[14px] transition-colors duration-300 ${
                    j === k ? "text-encre font-medium" : "text-gris hover:text-encre"
                  }`}
                >
                  <span className="inline-block w-2.5 h-2.5 shrink-0" style={{ background: x.couleur || "var(--encre)" }} />
                  {x.libelle}
                  {x.nombre && <span className="ml-auto mono text-[10px]">{x.nombre}</span>}
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setK(null)}
            aria-pressed={k === null}
            className={`mt-4 mono px-3 py-1.5 border transition-colors duration-300 ${
              k === null ? "bg-encre text-papier border-encre" : "border-trait hover:border-encre"
            }`}
          >
            Tout le modèle
          </button>
        </div>
      </div>
    </figure>
  );
}
