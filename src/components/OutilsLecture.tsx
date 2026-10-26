"use client";

import { useEffect, useState } from "react";

// Outils de lecture d'un cas d'études, repris d'afterworkworkflow.com :
// barre de progression, sommaire collant (grand écran) ou dépliable (téléphone), retour en haut.
export default function OutilsLecture({ titres }: { titres: { id: string; texte: string }[] }) {
  const [progres, setProgres] = useState(0);
  const [ici, setIci] = useState(-1);
  const [haut, setHaut] = useState(false);

  useEffect(() => {
    const maj = () => {
      const article = document.getElementById("texte-cas");
      if (article) {
        const r = article.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        setProgres(Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1))));
      }
      let k = -1;
      titres.forEach((t, i) => {
        const h = document.getElementById(t.id);
        if (h && h.getBoundingClientRect().top < window.innerHeight * 0.3) k = i;
      });
      setIci(k);
      setHaut(window.scrollY > window.innerHeight * 1.5);
    };
    maj();
    window.addEventListener("scroll", maj, { passive: true });
    window.addEventListener("resize", maj);
    return () => {
      window.removeEventListener("scroll", maj);
      window.removeEventListener("resize", maj);
    };
  }, [titres]);

  const liste = (fermer?: () => void) => (
    <ol className="grid gap-0.5">
      {titres.map((t, i) => (
        <li key={t.id}>
          <a
            href={`#${t.id}`}
            onClick={fermer}
            className={`grid grid-cols-[26px_1fr] gap-1 py-1.5 pl-2 pr-2 border-l-2 text-[13px] leading-snug transition-colors duration-300 ${
              i === ici
                ? "border-bleu text-encre font-semibold bg-gradient-to-r from-bleu-pale to-transparent"
                : "border-transparent text-gris hover:text-encre"
            }`}
          >
            <span className="font-mono text-[10.5px] pt-[2px] tracking-wider">{String(i + 1).padStart(2, "0")}</span>
            <span>{t.texte}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <div className="fixed top-0 left-0 z-[60] h-[3px] bg-bleu" style={{ width: `${progres * 100}%` }} aria-hidden="true" />

      {titres.length >= 3 && (
        <>
          <nav className="hidden xl:block absolute top-0 bottom-0 right-[calc(100%+32px)] w-[210px]" aria-label="Sommaire">
            <div className="sticky top-[104px] grid gap-4">
              <span className="mono text-gris">Dans ce cas d&apos;études</span>
              {liste()}
            </div>
          </nav>
          <SommairePlie nombre={titres.length}>{(fermer) => liste(fermer)}</SommairePlie>
        </>
      )}

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-5 right-5 z-50 w-12 h-12 bg-bleu text-white border border-encre shadow-[3px_3px_0_0_var(--encre)] transition-all duration-300 hover:bg-encre ${
          haut ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Revenir en haut"
      >
        ↑
      </button>
    </>
  );
}

function SommairePlie({ nombre, children }: { nombre: number; children: (fermer: () => void) => React.ReactNode }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div className="xl:hidden mb-10 border border-encre bg-blanc">
      <button
        type="button"
        onClick={() => setOuvert(!ouvert)}
        className={`w-full flex items-center justify-between px-4 py-3 mono ${ouvert ? "bg-bleu text-white" : "text-encre"}`}
        aria-expanded={ouvert}
      >
        <span>Sommaire · {nombre} parties</span>
        <span className={`transition-transform duration-300 ${ouvert ? "rotate-180" : ""}`}>▾</span>
      </button>
      {ouvert && <div className="p-2 border-t border-encre">{children(() => setOuvert(false))}</div>}
    </div>
  );
}
