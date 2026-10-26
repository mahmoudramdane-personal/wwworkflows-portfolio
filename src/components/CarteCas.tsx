import Link from "next/link";
import Image from "next/image";
import { Project, CATEGORY_LABELS, Category } from "@/lib/types";

// Carte d'un cas d'études sur l'accueil : grande image, numéro, titre, sous-titre, fiche.
export default function CarteCas({ project, numero }: { project: Project; numero: number }) {
  const image = project.thumbnail || project.heroImage;
  const categorie = CATEGORY_LABELS[project.category as Category] || project.category;

  return (
    <Link
      href={`/project/${project.slug}`}
      className="group grid md:grid-cols-12 bg-blanc border border-encre transition-shadow duration-500 hover:shadow-[8px_8px_0_0_var(--bleu)]"
    >
      <div className="relative md:col-span-7 aspect-[3/2] md:aspect-auto md:min-h-[420px] overflow-hidden border-b md:border-b-0 md:border-r border-encre bg-trait">
        {image && (
          <Image
            src={image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        )}
      </div>

      <div className="md:col-span-5 flex flex-col justify-between gap-10 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <span className="mono text-bleu">Cas d&apos;études · {String(numero).padStart(2, "0")}</span>
          <span className="mono text-gris">{project.year}</span>
        </div>

        <div>
          <h3 className="titre-large text-3xl md:text-[2.4rem] leading-[1.05] transition-colors duration-300 group-hover:text-bleu">
            {project.title}
          </h3>
          <p className="mt-4 text-gris text-base md:text-lg leading-relaxed">{project.subtitle}</p>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-trait pt-4">
          <span className="mono text-gris">
            {categorie}
            {project.location ? ` · ${project.location}` : ""}
          </span>
          <span className="mono text-encre whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1 group-hover:text-bleu">
            Lire →
          </span>
        </div>
      </div>
    </Link>
  );
}
