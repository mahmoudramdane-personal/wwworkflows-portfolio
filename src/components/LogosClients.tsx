import Link from "next/link";

// Logos des agences et entreprises (public/clients/, encre sur transparent).
// Chaque logo est seulement recoloré par masque CSS, jamais redessiné ; accord de l'agence avant affichage.
// l, h : taille du fichier ; f : réglage optique (un logo très plein paraît plus gros à surface égale).
// site : chaque logo mène au site de l'agence, nouvel onglet (adresses vérifiées, validées par Mahmoud le 26.10.26 ;
// H2A : h2a.be ne répond pas, fiche Wallonie-Bruxelles Architectures en attendant). cas : lien vers un cas d'études, inutilisé.
type Logo = { nom: string; fichier: string; l: number; h: number; f: number; cas?: string; site?: string };
const LOGOS: Logo[] = [
  { nom: "YLA Studio", fichier: "yla", l: 1030, h: 400, f: 0.85, site: "https://ylahkim.com" },
  { nom: "AAZ Architecture", fichier: "aaz", l: 633, h: 400, f: 1, site: "https://aaz.ma" },
  { nom: "Studio YN", fichier: "yn-studio", l: 2023, h: 400, f: 0.9, site: "https://studioyn.com" },
  { nom: "IAAC", fichier: "iaac", l: 411, h: 138, f: 0.9, site: "https://iaac.net" },
  { nom: "Orange Ateliers", fichier: "orange-atelier", l: 111, h: 156, f: 1.3, site: "https://orangeatelier.ma" },
  { nom: "STILL Industrial", fichier: "still", l: 200, h: 16, f: 1, site: "https://www.stillindustrial.com" },
  { nom: "CMS Company", fichier: "cms", l: 169, h: 156, f: 1.2, site: "https://www.cmscompany.net" },
  { nom: "Olivium Invest", fichier: "olivium", l: 442, h: 156, f: 0.95, site: "https://www.oliviuminvest.ma" },
  { nom: "Art'com", fichier: "artcom", l: 132, h: 156, f: 0.95, site: "https://www.ecole-artcom.com" },
  { nom: "H2A", fichier: "h2a", l: 366, h: 156, f: 0.8, site: "https://wbarchitectures.be/fr/architects/H2A-Ir-Architecte-et-Associes/174" },
  { nom: "Holmarcom Group", fichier: "holmarcom", l: 143, h: 156, f: 1.3, site: "https://www.holmarcom.ma" },
  { nom: "Almaxyra & Company", fichier: "almaxyra", l: 194, h: 54, f: 1, site: "https://almaxyra.com" },
  { nom: "Urban Archi Studio", fichier: "urban-archi-studio", l: 155, h: 154, f: 1.3, site: "https://urbanarchi.com" },
];

// Même surface apparente pour tous, dans les limites de la case
const SURFACE = 3400;
function taille(l: number, h: number, f: number) {
  const r = l / h;
  let largeur = Math.sqrt(SURFACE * r) * f;
  let hauteur = largeur / r;
  if (largeur > 132) { largeur = 132; hauteur = largeur / r; }
  if (hauteur > 76) { hauteur = 76; largeur = hauteur * r; }
  return { width: Math.round(largeur), height: Math.round(hauteur) };
}

export default function LogosClients() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 border-l border-t border-trait">
      {LOGOS.map((logo) => {
        const url = `url(/clients/${logo.fichier}.png)`;
        const classe =
          "group relative aspect-[4/3] lg:aspect-square border-r border-b border-trait bg-papier flex items-center justify-center transition-colors duration-300 hover:bg-bleu-pale";
        const contenu = (
          <>
            <span
              role="img"
              aria-label={logo.nom}
              className="block bg-encre transition-colors duration-300 group-hover:bg-bleu"
              style={{
                ...taille(logo.l, logo.h, logo.f),
                WebkitMaskImage: url,
                maskImage: url,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            <span className="mono absolute left-3 bottom-2.5 text-[10px] text-bleu opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              {logo.nom}
              {logo.cas ? " →" : logo.site ? " ↗" : ""}
            </span>
          </>
        );
        if (logo.cas)
          return (
            <Link key={logo.fichier} href={`/project/${logo.cas}`} className={classe}>
              {contenu}
            </Link>
          );
        if (logo.site)
          return (
            <a key={logo.fichier} href={logo.site} target="_blank" rel="noopener noreferrer" className={classe}>
              {contenu}
            </a>
          );
        return (
          <div key={logo.fichier} className={classe}>
            {contenu}
          </div>
        );
      })}
      {/* Dernière case : la prochaine agence */}
      <Link
        href="/contact"
        className="group relative aspect-[4/3] lg:aspect-square border-r border-b border-trait flex flex-col items-start justify-end p-3 bg-encre text-papier transition-colors duration-300 hover:bg-bleu"
      >
        <span className="mono text-[10px] text-papier/60">Votre agence</span>
        <span className="mt-1 text-lg leading-tight">
          Travaillons ensemble <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </div>
  );
}
