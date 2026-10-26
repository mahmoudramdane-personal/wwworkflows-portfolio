"use client";

import { useState } from "react";

// Curseur de construction : le projet se monte étape par étape (images cumulées, une seule visible, en fondu),
// vu sous plusieurs angles. Embed dans un corps de cas :
// {{construction:nom|Libellé#couleur:Phrase|…}}, images nom-<vue>-01.webp … nom-<vue>-NN.webp dans bodyMedia.
export type Etape = { libelle: string; couleur?: string; phrase?: string };
export type Vue = { nom: string; images: string[]; largeur: number; hauteur: number };

export default function Construction({ etapes, vues }: { etapes: Etape[]; vues: Vue[] }) {
  const [vue, setVue] = useState(0);
  const [n, setN] = useState(etapes.length);
  const v = vues[vue];
  const e = etapes[n - 1];

  return (
    <figure className="figure-cas">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          {vues.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Angle de vue">
              {vues.map((x, i) => (
                <button
                  key={x.nom}
                  type="button"
                  onClick={() => setVue(i)}
                  aria-pressed={i === vue}
                  className={`mono px-3 py-1.5 border transition-colors duration-300 ${
                    i === vue ? "bg-encre text-papier border-encre" : "border-trait hover:border-encre"
                  }`}
                >
                  {x.nom.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <div className="relative w-full" style={{ aspectRatio: `${v.largeur} / ${v.hauteur}` }}>
            {v.images.map((src, k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={k === n - 1 ? `Étape ${n} : ${e.libelle}` : ""}
                draggable={false}
                loading={k === v.images.length - 1 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                style={{ opacity: k === n - 1 ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="mt-5">
            <input
              type="range"
              min={1}
              max={etapes.length}
              step={1}
              value={n}
              onChange={(ev) => setN(Number(ev.target.value))}
              aria-label="Étape de construction"
              aria-valuetext={`Étape ${n} sur ${etapes.length} : ${e.libelle}`}
              className="curseur-construction w-full"
            />
            <div className="mt-1 flex justify-between mono text-[10px] text-gris">
              <span>{etapes[0].libelle}</span>
              <span>Projet complet</span>
            </div>
          </div>
        </div>

        <div>
          <p className="mono text-gris">
            Étape {String(n).padStart(2, "0")} / {String(etapes.length).padStart(2, "0")}
          </p>
          <p className="mt-2 text-2xl tracking-tight leading-tight">{e.libelle}</p>
          {e.phrase && <p className="mt-2 text-[15px] leading-relaxed text-gris">{e.phrase}</p>}
          <ol className="mt-6">
            {etapes.map((x, k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => setN(k + 1)}
                  className={`w-full flex items-center gap-3 py-1.5 border-t border-trait text-left text-[14px] transition-colors duration-300 ${
                    k < n ? "text-encre" : "text-gris"
                  } ${k === n - 1 ? "font-medium" : ""}`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 shrink-0 transition-opacity duration-300"
                    style={{ background: x.couleur || "var(--encre)", opacity: k < n ? 1 : 0.3 }}
                  />
                  {x.libelle}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </figure>
  );
}
