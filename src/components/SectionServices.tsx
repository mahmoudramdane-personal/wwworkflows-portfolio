import Apparition from "./Apparition";

// « Ce que nous faisons » : services numérotés, aplat bleu au survol (accueil et Studio)
export default function SectionServices({ services }: { services?: { title: string; description: string }[] }) {
  if (!services || services.length === 0) return null;
  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 md:pt-28">
      <div className="flex items-baseline justify-between border-b border-encre pb-4">
        <h2 className="mono text-encre">Ce que nous faisons</h2>
        <span className="mono text-gris">{String(services.length).padStart(2, "0")}</span>
      </div>
      {services.map((s, i) => (
        <Apparition key={i} delai={i * 80}>
          <div className="group relative overflow-hidden border-b border-trait">
            {/* Aplat bleu qui entre au survol et repart à la sortie */}
            <span
              className="absolute inset-0 bg-bleu origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.18,1)] group-hover:scale-x-100"
              aria-hidden="true"
            />
            <div className="relative grid md:grid-cols-12 gap-4 md:gap-10 py-8 md:py-10 px-0 group-hover:px-4 transition-all duration-500">
              <span className="mono md:col-span-1 text-gris transition-colors duration-300 group-hover:text-white/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="titre-large md:col-span-5 text-2xl md:text-4xl leading-tight transition-colors duration-300 group-hover:text-white">
                {s.title}
              </h3>
              <p className="md:col-span-6 text-gris leading-relaxed md:pt-2 transition-colors duration-300 group-hover:text-white/85">
                {s.description}
              </p>
            </div>
          </div>
        </Apparition>
      ))}
    </section>
  );
}
