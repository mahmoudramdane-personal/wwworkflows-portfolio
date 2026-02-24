import { getProjects } from "@/lib/contentful";
import ProjectGrid from "@/components/ProjectGrid";

export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-4xl text-neutral-900">
          Computational Design
          <br />
          <span className="text-neutral-400">as a Service</span>
        </h1>
        <p className="mt-6 text-neutral-500 text-base md:text-lg max-w-2xl leading-relaxed">
          Systèmes algorithmiques, façades paramétriques et planification de
          fabrication digitale — du concept à la construction.
        </p>
      </section>

      {/* Projects */}
      <section className="pb-24">
        <ProjectGrid projects={projects} />
      </section>
    </div>
  );
}
