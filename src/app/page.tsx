import Link from "next/link";
import { getProjects, getAboutPage } from "@/lib/contenu";
import SectionCas from "@/components/SectionCas";
import SectionReferences from "@/components/SectionReferences";
import SectionServices from "@/components/SectionServices";
import GrainDegrade from "@/components/GrainDegrade";

export default async function Home() {
  // Page d'accueil = landing page : accroche, références, cas d'études, services, puis le contact (footer)
  const [projects, about] = await Promise.all([getProjects(), getAboutPage()]);

  return (
    <>
      {/* En-tête : façade de lames en fond, pâle et effacée côté texte ; le texte reste devant */}
      <section className="relative overflow-hidden">
        <GrainDegrade mode="entete" className="absolute inset-0" />
        <div className="grain-aplat absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1240px] mx-auto px-4 md:px-8 pt-20 lg:pt-32 lg:pb-32 grid lg:grid-cols-12 pb-72 md:pb-20">
          <div className="lg:col-span-7">
            <span className="mono text-gris">WWWORKFLOWS · Design computationnel et IA</span>
            <h1 className="texte-net titre-large mt-6 text-[2.6rem] leading-[1.04] md:text-6xl lg:text-[4.1rem]">
              Un partenaire créatif pour les architectes et designers.
            </h1>
            <p className="mt-8 text-lg md:text-xl leading-relaxed text-gris">
              Nous développons des workflows algorithmiques, en utilisant le{" "}
              <Link href="/article/architecte-et-technologiste" className="lien-notion">design computationnel</Link> et l&apos;
              <Link href="/article/ia-architecture-assistant-architecte" className="lien-notion">intelligence artificielle</Link>, qui
              aident à imaginer, modéliser et produire.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#cas-etudes" className="mono inline-flex items-center px-4 py-3 bg-bleu text-white border border-bleu hover:bg-encre hover:border-encre transition-colors duration-300">
                Voir les cas d&apos;études ↓
              </a>
              <a href="#contact" className="mono inline-flex items-center px-4 py-3 border border-encre bg-blanc hover:bg-encre hover:text-papier transition-colors duration-300">
                Parler d&apos;un projet
              </a>
            </div>
          </div>

        </div>
      </section>

      <SectionReferences />

      <SectionCas projects={projects} />

      <SectionServices services={about.services} />
    </>
  );
}
