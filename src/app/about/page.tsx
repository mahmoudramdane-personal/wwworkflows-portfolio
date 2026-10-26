import type { Metadata } from "next";
import Link from "next/link";
import { getAboutPage } from "@/lib/contentful";
import Apparition from "@/components/Apparition";
import SectionReferences from "@/components/SectionReferences";
import SectionServices from "@/components/SectionServices";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Studio",
  description:
    "WWWORKFLOWS, studio de design computationnel : workflows algorithmiques et intelligence artificielle pour les agences d'architecture et de design.",
};

// La marque s'écrit en majuscules sur le site, quel que soit le texte reçu de Contentful
const marque = (t: string) => t.replace(/WWWorkflows/g, "WWWORKFLOWS");

export default async function AboutPage() {
  const about = await getAboutPage();
  // Seul le premier paragraphe sert d'ouverture ; la suite est reprise dans « Notre approche »
  const intro = marque(about.intro).split("\n\n").slice(0, 1);

  return (
    <>
      {/* Ouverture */}
      <section className="fond-grille border-b border-encre">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-16 pb-16 md:pt-24 md:pb-24 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <span className="mono text-gris">Studio</span>
            <h1 className="texte-net titre-large mt-6 text-[2.6rem] md:text-6xl lg:text-[4.1rem] leading-[1.02]">
              Des systèmes, plutôt que des objets.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-14 space-y-5 text-xl leading-relaxed">
            {intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <SectionReferences />

      <SectionServices services={about.services} />

      {/* Approche et fondateur */}
      <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 md:pt-28 grid md:grid-cols-2 gap-12 md:gap-16">
        <Apparition>
          <div className="border-t border-encre pt-6">
            <h2 className="mono text-encre">Notre approche</h2>
            <p className="mt-6 text-xl md:text-2xl leading-snug">
              Des projets non standards, rendus possibles par un usage créatif de la technologie.
            </p>
            <p className="mt-5 text-gris leading-relaxed">
              Chaque mission repose sur des algorithmes développés pour le projet lui-même, pas sur des outils génériques.
              Notre objectif : tenir ensemble la complexité technique et la cohérence architecturale, de l&apos;esquisse à la
              fabrication.
            </p>
          </div>
        </Apparition>
        <Apparition delai={120}>
          <div className="border-t border-encre pt-6">
            <h2 className="mono text-encre">Fondateur</h2>
            <p className="mt-6 text-xl md:text-2xl leading-snug">Mahmoud Ramdane</p>
            <p className="mt-1 mono text-bleu">Architecte et technologiste</p>
            <p className="mt-5 text-gris leading-relaxed">
              Spécialisé en design computationnel et en interopérabilité BIM, il conçoit des systèmes paramétriques et
              automatise les processus de conception et de fabrication pour les agences.
            </p>
          </div>
        </Apparition>
      </section>

      {/* Outils */}
      {about.tools && about.tools.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 md:pt-28">
          <div className="border-t border-encre pt-6 flex flex-col md:flex-row md:items-baseline gap-6 md:gap-16">
            <h2 className="mono text-encre shrink-0">Outils</h2>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {about.tools.map((t) => (
                <li key={t} className="text-xl md:text-2xl text-gris transition-colors duration-300 hover:text-bleu">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-16 flex flex-wrap gap-3">
            <Link
              href="/#cas-etudes"
              className="mono inline-flex items-center px-4 py-3 bg-bleu text-white border border-bleu hover:bg-encre hover:border-encre transition-colors duration-300"
            >
              Voir les cas d&apos;études →
            </Link>
            <Link
              href="/contact"
              className="mono inline-flex items-center px-4 py-3 border border-encre bg-papier hover:bg-encre hover:text-papier transition-colors duration-300"
            >
              Parler d&apos;un projet
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
