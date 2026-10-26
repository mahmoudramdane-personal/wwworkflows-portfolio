import Apparition from "./Apparition";
import LogosClients from "./LogosClients";

// « Ils nous ont fait confiance » : grille des logos (accueil et Studio)
export default function SectionReferences() {
  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 md:pt-28">
      <div className="flex items-baseline justify-between border-b border-encre pb-4 mb-10">
        <h2 className="mono text-encre">Ils nous ont fait confiance</h2>
        <span className="mono text-gris">Agences · entreprises · écoles</span>
      </div>
      <Apparition>
        <LogosClients />
      </Apparition>
    </section>
  );
}
