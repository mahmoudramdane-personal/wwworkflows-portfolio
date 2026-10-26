import Link from "next/link";
import GrilleLogos from "./GrilleLogos";
import FonduShader from "./FonduShader";

// Coordonnées publiques WWW (hello@ : adresse publique ; jamais le numéro personnel)
const EMAIL = "hello@wwworkflows.com";
const LINKEDIN = "https://www.linkedin.com/in/mahmoudramdane/";
const INSTAGRAM = "https://www.instagram.com/wwworkflows";
// Téléphone pro public (0623) ; le 0645 est personnel et ne figure jamais sur le site
const TELEPHONE = "+212 6 23 63 32 22";
const WHATSAPP = "https://wa.me/212623633222";

// Trois raisons d'écrire : chaque carte ouvre un mail avec l'objet déjà rempli
const DEMANDES = [
  {
    titre: "Un projet",
    texte: "Façade, système paramétrique, rationalisation, fabrication : décrivez-nous le projet et sa phase.",
    objet: "Projet",
  },
  {
    titre: "Une formation d'équipe",
    texte: "Rhino, Grasshopper, Revit, Rhino.Inside.Revit et IA : un programme construit pour votre agence.",
    objet: "Formation d'équipe",
  },
  {
    titre: "Un conseil",
    texte: "Audit et automatisation de vos workflows, accompagnement technique en design computationnel.",
    objet: "Conseil",
  },
];

export default function Footer() {
  const liens = [
    { href: "/cas-etudes", label: "Cas d'études" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "Studio" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
    {/* Long fondu du papier vers le bleu (dégradé animé) : pas de bord net au-dessus du footer */}
    <FonduShader className="mt-16 h-[45svh] md:h-[60svh] -mb-px" />
    <footer className="relative bg-bleu text-white overflow-hidden min-h-[calc(100svh-4rem)] flex flex-col">
      {/* Grille de monogrammes en fond de tout le footer, réagit au curseur */}
      <GrilleLogos className="absolute inset-0 h-full" />
      {/* Grain derrière les textes */}
      <div className="grain-aplat absolute inset-0 pointer-events-none" aria-hidden="true" />
      {/* La grille apparaît en douceur sous le fondu */}
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-bleu to-transparent" aria-hidden="true" />
      {/* Le footer remplit tout l'écran en bas de page (ordinateur et téléphone) */}
      <div className="relative flex-1 flex flex-col justify-between">
      {/* Appel : écrire un projet (ancre #contact : bouton « Parler d'un projet » de l'accueil) */}
      <div id="contact" className="w-full max-w-[1240px] mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-16 scroll-mt-16">
        <span className="mono text-white/70">Un projet, une question, une formation d&apos;équipe</span>
        <h2 className="texte-net titre-large mt-6 text-4xl md:text-6xl lg:text-7xl leading-[1.02] max-w-4xl [--fond-net:#3047F8]">Parlons de votre prochain workflow.</h2>
        <a
          href={`mailto:${EMAIL}`}
          className="group mt-10 inline-flex items-center gap-4 text-2xl md:text-4xl tracking-tight"
        >
          <span className="relative">
            {EMAIL}
            <span className="absolute left-0 -bottom-1 h-px w-full bg-white/50" />
            <span className="absolute left-0 -bottom-1 h-px w-0 bg-white transition-all duration-500 ease-out group-hover:w-full" />
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
        </a>

        {/* Pourquoi écrire */}
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {DEMANDES.map((d, i) => (
            <a
              key={d.titre}
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(`${d.objet} — `)}`}
              className="group flex flex-col justify-between gap-8 p-6 border border-white/40 bg-bleu transition-colors duration-300 hover:bg-white hover:text-bleu"
            >
              <span className="mono text-white/60 transition-colors duration-300 group-hover:text-bleu/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-2xl tracking-tight">{d.titre}</span>
                <span className="mt-2 block text-[15px] leading-relaxed text-white/80 transition-colors duration-300 group-hover:text-encre/80">
                  {d.texte}
                </span>
              </span>
              <span className="mono">
                Écrire <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>

        {/* Coordonnées directes */}
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-lg">
          <a href={`tel:${TELEPHONE.replace(/\s/g, "")}`} className="group inline-flex items-baseline gap-3">
            <span className="mono text-white/60">Téléphone</span>
            <span className="border-b border-white/40 group-hover:border-white">{TELEPHONE}</span>
          </a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="group inline-flex items-baseline gap-3">
            <span className="mono text-white/60">WhatsApp</span>
            <span className="border-b border-white/40 group-hover:border-white">Écrire ↗</span>
          </a>
          <span className="inline-flex items-baseline gap-3">
            <span className="mono text-white/60">Basés au</span>
            <span>Maroc · projets à l&apos;international</span>
          </span>
        </div>
      </div>

      {/* Colonnes */}
      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <span className="mono text-white/70">WWWORKFLOWS</span>
          <p className="text-[15px] leading-relaxed text-white/85 max-w-xs">
            Design computationnel et intelligence artificielle pour les architectes et designers. Basés au Maroc, projets
            à l&apos;international.
          </p>
        </div>

        <div className="space-y-4">
          <span className="mono text-white/70">Le site</span>
          <nav className="grid gap-2">
            {liens.map((l) => (
              <Link key={l.href} href={l.href} className="text-[15px] hover:translate-x-1 transition-transform duration-300 w-fit">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <span className="mono text-white/70">Suivre</span>
          <div className="grid gap-2">
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[15px] w-fit group">
              <IconeLinkedIn /> <span className="group-hover:translate-x-1 transition-transform duration-300">LinkedIn ↗</span>
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[15px] w-fit group">
              <IconeInstagram /> <span className="group-hover:translate-x-1 transition-transform duration-300">Instagram ↗</span>
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 text-[15px] w-fit group">
              <IconeMail /> <span className="group-hover:translate-x-1 transition-transform duration-300">{EMAIL}</span>
            </a>
            <a href={`tel:${TELEPHONE.replace(/\s/g, "")}`} className="inline-flex items-center gap-3 text-[15px] w-fit group">
              <IconeTel /> <span className="group-hover:translate-x-1 transition-transform duration-300">{TELEPHONE}</span>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <span className="mono text-white/70">Apprendre</span>
          <p className="text-[15px] leading-relaxed text-white/85">
            Notre école en ligne : Rhinoceros, Grasshopper, BIM et IA, en direct après le travail.
          </p>
          <a
            href="https://afterworkworkflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mono inline-flex items-center px-3 py-2 border border-white bg-bleu hover:bg-white hover:text-bleu transition-colors duration-300"
          >
            Afterwork Workflow ↗
          </a>
        </div>
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-4 md:px-8 pt-16 pb-8 flex flex-wrap justify-between gap-3">
        <span className="mono text-white/70">&copy; {new Date().getFullYear()} WWWORKFLOWS</span>
        <span className="mono text-white/70">Des systèmes, plutôt que des objets.</span>
      </div>
      </div>
    </footer>
    </>
  );
}

const trait = { fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;

function IconeLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" {...trait} />
      <line x1="8" y1="10.5" x2="8" y2="16.5" {...trait} />
      <circle cx="8" cy="7.6" r="0.9" fill="currentColor" />
      <path d="M11.5 16.5v-6M11.5 13.2c0-1.6 1-2.8 2.5-2.8s2.5 1 2.5 2.6v3.5" {...trait} />
    </svg>
  );
}

function IconeInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" {...trait} />
      <circle cx="12" cy="12" r="4" {...trait} />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" />
    </svg>
  );
}

function IconeMail() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1" {...trait} />
      <path d="M4 6.5l8 6 8-6" {...trait} />
    </svg>
  );
}

function IconeTel() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" {...trait} />
    </svg>
  );
}
