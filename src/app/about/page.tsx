export default function AboutPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
          About
        </h1>
      </section>

      <section className="max-w-3xl space-y-8 pb-24">
        <p className="text-neutral-600 text-base leading-[1.8] tracking-wide">
          WWWorkflows is a computational design studio specializing in
          algorithmic systems for architecture and construction. We develop
          parametric tools that compress design timelines, absorb late-stage
          changes, and bridge the gap between digital geometry and physical
          fabrication.
        </p>

        <p className="text-neutral-600 text-base leading-[1.8] tracking-wide">
          Our work spans facade design, fabrication planning, landscape
          automation, and digital process consulting. We collaborate with
          architecture firms, developers, and contractors — providing
          Computational Design as a Service.
        </p>

        <div className="border-t border-black/10 pt-8 mt-12">
          <h2 className="text-neutral-900 text-lg font-medium tracking-wide mb-6">
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceItem
              title="Facade Systems"
              description="Parametric facade design, double-skin systems, panel optimization, and curtain wall algorithms."
            />
            <ServiceItem
              title="Algorithmic Design"
              description="Generative design tools, form-finding, and optimization scripts for architectural projects."
            />
            <ServiceItem
              title="Fabrication Planning"
              description="CNC-ready models, assembly planning, and digital-to-physical fabrication workflows."
            />
            <ServiceItem
              title="Digital Automation"
              description="Process automation, batch rendering, configurators, and custom Grasshopper tools."
            />
          </div>
        </div>

        <div className="border-t border-black/10 pt-8 mt-12">
          <h2 className="text-neutral-900 text-lg font-medium tracking-wide mb-6">
            Tools
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Rhino",
              "Grasshopper",
              "Revit",
              "Ladybug",
              "Python",
              "Hops",
              "Lumion",
              "Miro",
            ].map((tool) => (
              <span
                key={tool}
                className="text-xs tracking-[0.08em] text-neutral-500 border border-black/10 px-3 py-1.5 rounded-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-neutral-900 text-sm font-medium tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
