import Apparition from "./Apparition";
import CarteCas from "./CarteCas";
import type { Project } from "@/lib/types";

// Cas d'études : une carte par cas (accueil et page /cas-etudes)
export default function SectionCas({ projects }: { projects: Project[] }) {
  return (
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
  );
}
