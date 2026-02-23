"use client";

import { useState } from "react";
import { Project, Category } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import CategoryFilter from "./CategoryFilter";

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Filters */}
      <div className="mb-12">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-neutral-600 text-sm text-center py-24">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
