import { getProjectBySlug, getProjects } from "@/lib/contentful";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, Category } from "@/lib/types";
import RichBody from "@/components/RichBody";

export const revalidate = 60;
export const dynamicParams = true;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen -mt-16 pt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Back navigation */}
        <div className="pt-8">
          <Link
            href="/"
            className="text-neutral-400 text-xs tracking-[0.12em] uppercase hover:text-neutral-900 transition-colors duration-300"
          >
            &larr; Retour aux projets
          </Link>
        </div>

        {/* Title section */}
        <section className="pt-12 pb-8 md:pt-16 md:pb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
            {project.title}
          </h1>
          <p className="mt-4 text-neutral-500 text-base md:text-lg leading-relaxed">
            {project.subtitle}
          </p>
        </section>

        {/* Metadata bar */}
        <section className="border-t border-b border-black/10 py-6 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <MetaItem label="Client" value={project.client} />
            <MetaItem label="Catégorie" value={CATEGORY_LABELS[project.category as Category] || project.category} />
            <MetaItem label="Année" value={String(project.year)} />
            <MetaItem label="Lieu" value={project.location} />
            <MetaItem label="Statut" value={project.status} />
            {project.collaborators && (
              <MetaItem label="Collaborateurs" value={project.collaborators} />
            )}
          </div>
        </section>

        {/* Hero image */}
        <section className="mb-12">
          <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
          </div>
        </section>

        {/* Body content — full width */}
        <section className="mb-16">
          <RichBody body={project.body} bodyMedia={project.bodyMedia} />
        </section>

        {/* Project images gallery */}
        {project.images.length > 0 && (
          <section className="space-y-6 mb-24">
            {project.images.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[16/9] overflow-hidden bg-neutral-100"
              >
                <Image
                  src={src}
                  alt={`${project.title} — ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1400px) 100vw, 1400px"
                />
              </div>
            ))}
          </section>
        )}

        {/* Next project CTA */}
        <section className="border-t border-black/10 py-12 text-center">
          <Link
            href="/"
            className="text-neutral-400 text-xs tracking-[0.12em] uppercase hover:text-neutral-900 transition-colors duration-300"
          >
            Voir tous les projets &rarr;
          </Link>
        </section>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-neutral-400 text-[10px] tracking-[0.15em] uppercase mb-1">
        {label}
      </dt>
      <dd className="text-neutral-900 text-sm">{value}</dd>
    </div>
  );
}
