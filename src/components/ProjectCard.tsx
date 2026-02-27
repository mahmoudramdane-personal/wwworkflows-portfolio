"use client";

import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/types";
import { useState, useEffect, useRef, useMemo } from "react";

interface ProjectCardProps {
  project: Project;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Images only, no GIFs (animated), shuffled once on mount
  const cycleImages = useMemo(() => {
    const images = project.bodyMedia
      .filter(
        (m) =>
          m.contentType?.startsWith("image/") &&
          !m.filename?.endsWith(".gif")
      )
      .map((m) => m.url);
    return images.length > 1 ? shuffleArray(images) : [];
  }, [project.bodyMedia]);

  const handleMouseEnter = () => {
    if (cycleImages.length === 0) return;
    setActiveIndex(0);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cycleImages.length);
    }, 600);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(-1);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Link href={`/project/${project.slug}`} className="group block">
      {/* Image container */}
      <div
        className="relative aspect-[3/2] overflow-hidden bg-neutral-200"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Base thumbnail — visible when not cycling */}
        {project.thumbnail && (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className={`object-cover transition-all duration-700 ease-out ${
              activeIndex === -1
                ? "opacity-100 group-hover:scale-105"
                : "opacity-0 scale-105"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Cycling bodyMedia images */}
        {cycleImages.map((url, i) => (
          <Image
            key={url}
            src={url}
            alt={`${project.title} — ${i + 1}`}
            fill
            className={`object-cover transition-opacity duration-150 ease-in-out ${
              activeIndex === i ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ))}

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/5" />
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
