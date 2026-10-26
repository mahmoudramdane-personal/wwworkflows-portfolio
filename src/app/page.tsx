import { getProjects } from "@/lib/contentful";
import CarteCas from "@/components/CarteCas";
import Apparition from "@/components/Apparition";

export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      {/* En-tête : qui nous sommes, en une phrase */}
      <section className="fond-grille border-b border-encre">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 pb-20 md:pt-32 md:pb-28">
          <span className="mono text-gris">WWWORKFLOWS · Design computationnel et IA</span>
          <h1 className="titre-large mt-6 text-[2.6rem] leading-[1.02] md:text-7xl lg:text-[5.4rem] max-w-5xl">
            Un partenaire créatif pour les architectes et designers.
          </h1>
          <p className="mt-8 md:mt-10 max-w-3xl text-lg md:text-2xl leading-relaxed text-gris">
            Nous développons des workflows algorithmiques, en utilisant le{" "}
            <span className="text-encre font-semibold border-b-2 border-bleu">design computationnel</span> et l&apos;
            <span className="text-encre font-semibold border-b-2 border-bleu">intelligence artificielle</span>, qui
            aident à imaginer, modéliser et produire.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#cas-etudes" className="mono inline-flex items-center px-4 py-3 bg-bleu text-white border border-bleu hover:bg-encre hover:border-encre transition-colors duration-300">
              Voir les cas d&apos;études ↓
            </a>
            <a href="/contact" className="mono inline-flex items-center px-4 py-3 border border-encre bg-blanc hover:bg-encre hover:text-papier transition-colors duration-300">
              Parler d&apos;un projet
            </a>
          </div>
        </div>
      </section>

      {/* Cas d'études : une carte par cas */}
      <section id="cas-etudes" className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 md:pt-28">
        <div className="flex items-baseline justify-between border-b border-encre pb-4 mb-10 md:mb-14">
          <h2 className="mono text-encre">Cas d&apos;études</h2>
          <span className="mono text-gris">{String(projects.length).padStart(2, "0")}</span>
        </div>
        <div className="grid gap-10 md:gap-16">
          {projects.map((p, i) => (
            <Apparition key={p.slug}>
              <CarteCas project={p} numero={i + 1} />
            </Apparition>
          ))}
        </div>
      </section>
    </>
  );
}
