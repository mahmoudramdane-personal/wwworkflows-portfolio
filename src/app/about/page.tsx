import { getAboutPage } from "@/lib/contentful";

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
        {about.intro.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-neutral-600 text-sm leading-[1.9] tracking-wide"
          >
            {paragraph}
          </p>
        ))}

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
