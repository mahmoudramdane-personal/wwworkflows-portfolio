// Ouverture d'un cas d'études, en fiche technique : la phrase d'accroche, puis les données de la mission
// en colonnes numérotées (libellé mono, valeur, outils en étiquettes). Lue dans le début du body Contentful :
//   > Phrase d'accroche…
//   **Mission** : … · **Durée** : 3 semaines, juin 2025 · **Outils** : Rhino, Grasshopper
//   ---
// Si le body ne commence pas ainsi, rien n'est extrait et le texte s'affiche comme avant.

export interface Chapeau {
  accroche: string;
  donnees: { libelle: string; valeur: string }[];
}

const DEBUT = /^\s*((?:>[^\n]*\n)+)\s*\n(\*\*[^*\n]+\*\*\s*:[^\n]+)\n(?:\s*\n)*(?:-{3,}\s*\n)?/;

export function extraireChapeau(texte: string): { chapeau: Chapeau | null; reste: string } {
  const body = texte.replace(/\r\n?/g, "\n");  // notes écrites sous Windows
  const m = body.match(DEBUT);
  if (!m) return { chapeau: null, reste: texte };
  const accroche = m[1].split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ").replace(/\*+/g, "").trim();
  const donnees = m[2]
    .split(/\s+·\s+/)
    .map((t) => t.match(/^\*\*(.+?)\*\*\s*:\s*(.+)$/))
    .filter((x): x is RegExpMatchArray => !!x)
    .map((x) => ({ libelle: x[1].trim(), valeur: x[2].trim() }));
  if (!donnees.length) return { chapeau: null, reste: texte };
  return { chapeau: { accroche, donnees }, reste: body.slice(m[0].length) };
}

export default function ChapeauCas({ chapeau }: { chapeau: Chapeau }) {
  return (
    <div className="max-w-[860px] mb-16">
      <p className="mono text-bleu mb-5">En bref</p>
      <p className="texte-net text-encre text-[1.35rem] md:text-[1.7rem] leading-[1.38] tracking-[-0.01em]">{chapeau.accroche}</p>

      <dl className="mt-10 grid md:grid-cols-3 border-t border-encre">
        {chapeau.donnees.map((d, i) => (
          <div key={d.libelle} className="py-5 md:pr-6 md:pl-6 md:first:pl-0 border-b border-trait md:border-b-0 md:border-r md:last:border-r-0">
            <dt className="mono text-gris mb-3 flex gap-3">
              <span className="text-bleu">{String(i + 1).padStart(2, "0")}</span>
              {d.libelle}
            </dt>
            <dd>
              <Valeur libelle={d.libelle} valeur={d.valeur} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Outils = étiquettes ; une valeur à virgules = chiffre clé en grand, précisions dessous
function Valeur({ libelle, valeur }: { libelle: string; valeur: string }) {
  const parties = valeur.split(/\s*,\s*/).filter(Boolean);
  if (/outil|logiciel/i.test(libelle)) {
    return (
      <ul className="flex flex-wrap gap-1.5">
        {parties.map((p) => (
          <li key={p} className="mono text-encre border border-encre/25 bg-blanc px-2 py-1">{p}</li>
        ))}
      </ul>
    );
  }
  if (parties.length > 1) {
    return (
      <>
        <span className="block text-encre text-2xl md:text-[1.75rem] leading-none font-medium">{parties[0]}</span>
        <span className="block mt-2 text-gris text-[14px] leading-snug">{parties.slice(1).join(" · ")}</span>
      </>
    );
  }
  return <span className="block text-encre text-[16px] leading-snug">{valeur}</span>;
}
