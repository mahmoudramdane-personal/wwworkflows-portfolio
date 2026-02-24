import { getAboutPage } from "@/lib/contentful";

export const revalidate = 60;

const CLIENTS = [
  "Orange Ateliers",
  "STILL Industrial",
  "CMS Company",
  "Olivium Invest",
  "Art'com",
  "H2A",
  "Holmarcom Group",
  "Almaxyra & Company",
  "Urban Archi Studio",
  "IAAC",
];

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
          {about.title}
        </h1>
      </section>

      <section className="max-w-3xl space-y-8 pb-24">
        {/* Intro paragraphs */}
        {about.intro.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-neutral-600 text-sm leading-[1.9] tracking-wide"
          >
            {paragraph}
          </p>
        ))}

        {/* Philosophy */}
        <div className="border-t border-black/10 pt-8 mt-12">
          <h2 className="text-neutral-900 text-lg font-medium tracking-wide mb-4">
            Philosophie
          </h2>
          <p className="text-neutral-600 text-sm leading-[1.9] tracking-wide">
            Des systèmes plutôt que des objets. Notre motivation est de réaliser
            des projets non-standards à travers l&apos;utilisation créative de la
            technologie. La clé du succès réside dans la création
            d&apos;algorithmes exclusifs, développés sur la base de projets
            spécifiques. Notre objectif est de combiner complexité technique et
            cohérence esthétique.
          </p>
        </div>

        {/* Founder */}
        <div className="border-t border-black/10 pt-8 mt-12">
          <h2 className="text-neutral-900 text-lg font-medium tracking-wide mb-4">
            Fondateur
          </h2>
          <p className="text-neutral-600 text-sm leading-[1.9] tracking-wide">
            <span className="text-neutral-900 font-medium">
              Mahmoud Ramdane
            </span>{" "}
            — Architecte et technologiste, spécialisé en design computationnel et
            interopérabilité BIM. Il porte une double casquette : architecte
            designer et technologiste, avec une expertise en planification
            paramétrique 3D et automatisation des processus de conception et de
            fabrication.
          </p>
        </div>

        {/* Services */}
        {about.services && about.services.length > 0 && (
          <div className="border-t border-black/10 pt-8 mt-12">
            <h2 className="text-neutral-900 text-lg font-medium tracking-wide mb-6">
              Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.services.map((service, i) => (
                <div key={i}>
                  <h3 className="text-neutral-900 text-sm font-medium tracking-wide mb-2">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clients */}
        <div className="border-t border-black/10 pt-8 mt-12">
          <h2 className="text-neutral-900 text-lg font-medium tracking-wide mb-6">
            Clients & Collaborateurs
          </h2>
          <div className="flex flex-wrap gap-3">
            {CLIENTS.map((client) => (
              <span
                key={client}
                className="text-xs tracking-[0.08em] text-neutral-500 border border-black/10 px-3 py-1.5 rounded-sm"
              >
                {client}
              </span>
            ))}
          </div>
        </div>

        {/* Tools */}
        {about.tools && about.tools.length > 0 && (
          <div className="border-t border-black/10 pt-8 mt-12">
            <h2 className="text-neutral-900 text-lg font-medium tracking-wide mb-6">
              Outils
            </h2>
            <div className="flex flex-wrap gap-3">
              {about.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs tracking-[0.08em] text-neutral-500 border border-black/10 px-3 py-1.5 rounded-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
