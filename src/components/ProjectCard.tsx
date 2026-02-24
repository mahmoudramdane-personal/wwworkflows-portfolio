import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.slug}`} className="group block">
      {/* Thumbnail */}
      <div className="relative aspect-[3/2] overflow-hidden bg-neutral-200">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-neutral-400 text-xs tracking-[0.12em] uppercase">
              Image à venir
            </span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/10" />
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-neutral-900 text-sm font-medium tracking-wide transition-opacity duration-300 group-hover:opacity-70">
          {project.title}
        </h3>
        <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
          {project.subtitle}
        </p>
      </div>
    </Link>
  );
}
