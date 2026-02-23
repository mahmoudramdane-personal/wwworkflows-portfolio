"use client";

import { Category, CATEGORY_LABELS } from "@/lib/types";

interface CategoryFilterProps {
  active: Category;
  onChange: (category: Category) => void;
}

export default function CategoryFilter({
  active,
  onChange,
}: CategoryFilterProps) {
  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  return (
    <div className="flex flex-wrap gap-2 md:gap-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-xs tracking-[0.12em] uppercase px-3 py-1.5 rounded-sm transition-all duration-300 ${
            active === cat
              ? "bg-neutral-900 text-white"
              : "text-neutral-400 hover:text-neutral-900 border border-black/10 hover:border-black/30"
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
