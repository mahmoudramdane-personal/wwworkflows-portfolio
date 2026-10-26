import { getProjectBySlug, getProjects } from "@/lib/contentful";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, Category } from "@/lib/types";
import RichBody from "@/components/RichBody";
import OutilsLecture from "@/components/OutilsLecture";
import CarteCas from "@/components/CarteCas";
import { titresDe, minutesDeLecture } from "@/lib/titres";
import type { Metadata } from "next";

export const revalidate = 60;
export const dynamicParams = true;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      url: `/project/${project.slug}`,
      type: "article",
      images: project.heroImage
        ? [{ url: project.heroImage, width: 1200, height: 630, alt: project.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getProjects()]);

  if (!project) {
    notFound();
  }

  const titres = titresDe(project.body);
  const categorie = CATEGORY_LABELS[project.category as Category] || project.category;
  const rang = projects.findIndex((p) => p.slug === project.slug);
  const suivant = projects.length > 1 ? projects[(rang + 1) % projects.length] : null;

  return (
    <>
      {/* En-tête du cas d'études */}
      <section className="fond-grille border-b border-encre">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <Link href="/#cas-etudes" className="mono text-gris hover:text-bleu transition-colors duration-300">
            &larr; Tous les cas d&apos;études
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="mono px-2.5 py-1.5 bg-bleu text-white">
              {categorie} · {project.year}
            </span>
            <span className="mono text-gris">Lecture · {minutesDeLecture(project.body)} min</span>
          </div>
          <h1 className="titre-large mt-6 text-4xl md:text-6xl lg:text-[4.6rem] leading-[1.02] max-w-5xl">{project.title}</h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-gris">{project.subtitle}</p>

          <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 border-t border-encre">
            <Fiche label="Client" value={project.client} />
            <Fiche label="Lieu" value={project.location} />
            <Fiche label="Statut" value={project.status} />
            <Fiche label="Équipe" value={project.collaborators} />
          </dl>
        </div>
      </section>

      {/* Image principale */}
      {project.heroImage && (
        <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-10 md:pt-14">
          <div className="relative aspect-[16/9] overflow-hidden border border-encre bg-trait">
            <Image src={project.heroImage} alt={project.title} fill className="object-cover" priority sizes="(max-width: 1240px) 100vw, 1176px" />
          </div>
        </section>
      )}

      {/* Texte : feuille blanche au centre, sommaire à gauche sur grand écran */}
      <section className="px-4 md:px-8 pt-10 md:pt-14">
        <article id="texte-cas" className="relative mx-auto max-w-[820px] bg-blanc border border-encre px-5 py-10 md:px-14 md:py-16">
          <OutilsLecture titres={titres} />
          <RichBody body={project.body} bodyMedia={project.bodyMedia} />

          {project.images.length > 0 && (
            <div className="mt-10 grid gap-6">
              {project.images.map((src, i) => (
                <div key={i} className="relative aspect-[16/9] overflow-hidden bg-trait">
                  <Image src={src} alt={`${project.title} — ${i + 1}`} fill className="object-cover" sizes="(max-width: 820px) 100vw, 708px" />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      {/* Cas suivant */}
      {suivant && (
        <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 md:pt-28">
          <div className="flex items-baseline justify-between border-b border-encre pb-4 mb-10">
            <h2 className="mono text-encre">Cas d&apos;études suivant</h2>
            <Link href="/#cas-etudes" className="mono text-gris hover:text-bleu transition-colors duration-300">
              Tous les cas →
            </Link>
          </div>
          <CarteCas project={suivant} numero={((rang + 1) % projects.length) + 1} />
        </section>
      )}
    </>
  );
}

function Fiche({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="py-4 pr-4 border-b border-trait">
      <dt className="mono text-gris mb-1.5">{label}</dt>
      <dd className="text-encre text-[15px]">{value}</dd>
    </div>
  );
}
