import type { Metadata } from "next";
import { getProjects } from "@/lib/contenu";
import SectionCas from "@/components/SectionCas";

export const metadata: Metadata = {
  title: "Cas d'études",
  description: "Façades paramétriques, systèmes algorithmiques et fabrication : nos cas d'études pour les agences d'architecture.",
};

// Page des cas d'études : les cartes, puis le contact (footer)
export default async function CasEtudesPage() {
  const projects = await getProjects();
  return (
    <>
      <span className="sans-grain-mobile hidden" aria-hidden="true" />
      <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-16 md:pt-24">
        <span className="mono text-gris">Cas d&apos;études · {String(projects.length).padStart(2, "0")}</span>
        <h1 className="texte-net titre-large mt-6 text-4xl md:text-6xl leading-[1.04] max-w-3xl">
          Des projets réels, des systèmes sur mesure.
        </h1>
      </section>
      <SectionCas projects={projects} />
    </>
  );
}
