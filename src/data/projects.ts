import { Project } from "@/lib/types";

export const mockProjects: Project[] = [
  {
    title: "WWW × YDA — Tours Casablanca",
    slug: "www-yda-tours-casablanca",
    subtitle:
      "Algorithmic facade system and aesthetic variations for a three-tower competition in Casablanca.",
    client: "Younes Diouri Architectes (YDA)",
    year: 2025,
    location: "Casablanca, Morocco",
    category: "facade-design",
    status: "Competition",
    collaborators: "YDA",
    thumbnail: "/images/placeholder-01.svg",
    heroImage: "/images/placeholder-01.svg",
    body: `YDA commissioned WWWorkflows to develop an algorithmic facade system for a three-tower ensemble in Casablanca. The project, in competition phase, required a parametric approach capable of absorbing volumetric modifications mid-design while maintaining facade system coherence.

The site — Lot 7.1 — sits at a strategic corner at the intersection of four avenues. The three volumes cascade to create a sculptural, landmark effect from the public crossing space.

The Grasshopper script clustered glass panels by level, generated a parametric double skin tied to the curtain wall mullions, and automatically propagated any volume change across the entire facade system.

Three foundational gestures were applied: panel division by specific widths, lateral shifting of mullions per level for a trembling/false quincunx effect, and mullion extrusion for a scaled facade texture.

When SHON requirements forced a late volume change, the parametric system absorbed the modification in hours rather than days of manual rework. DWG slab contours were auto-exported per level for seamless coordination with the plans team.`,
    images: [
      "/images/placeholder-02.svg",
      "/images/placeholder-03.svg",
      "/images/placeholder-04.svg",
      "/images/placeholder-05.svg",
    ],
    bodyMedia: [],
    order: 1,
  },
  {
    title: "Parametric Canopy System",
    slug: "parametric-canopy-system",
    subtitle:
      "Generative timber canopy structure for a public plaza, optimized for solar shading and fabrication.",
    client: "Studio Alpha",
    year: 2024,
    location: "Marrakech, Morocco",
    category: "algorithmic-systems",
    status: "Built",
    thumbnail: "/images/placeholder-02.svg",
    heroImage: "/images/placeholder-02.svg",
    body: `A generative canopy system developed for a public plaza. The parametric model optimizes panel angles for solar shading while maintaining structural feasibility for timber fabrication.

Each module is unique yet follows a unified assembly logic, enabling rapid on-site construction with standard timber sections.`,
    images: [
      "/images/placeholder-03.svg",
      "/images/placeholder-04.svg",
    ],
    bodyMedia: [],
    order: 2,
  },
  {
    title: "CNC Milled Reception Desk",
    slug: "cnc-milled-reception-desk",
    subtitle:
      "Algorithmically designed reception desk with CNC-milled oak panels for a corporate headquarters.",
    client: "Firm B",
    year: 2024,
    location: "Casablanca, Morocco",
    category: "fabrication-planning",
    status: "Complete",
    thumbnail: "/images/placeholder-03.svg",
    heroImage: "/images/placeholder-03.svg",
    body: `An algorithmically designed reception desk featuring CNC-milled oak panels. The design was generated through a Grasshopper definition that optimized panel curvature for structural performance and visual continuity.

Fabrication plans were exported directly from the parametric model, eliminating manual drafting.`,
    images: [
      "/images/placeholder-01.svg",
      "/images/placeholder-05.svg",
    ],
    bodyMedia: [],
    order: 3,
  },
  {
    title: "Landscape Algorithm — Meknes",
    slug: "landscape-algorithm-meknes",
    subtitle:
      "Automated paving pattern generation with gradient-based planting logic for a residential development.",
    client: "Internal Project",
    year: 2025,
    location: "Meknes, Morocco",
    category: "landscape-urban",
    status: "In Development",
    thumbnail: "/images/placeholder-04.svg",
    heroImage: "/images/placeholder-04.svg",
    body: `An automated landscape system that generates paving patterns, planting positions, and furniture placement based on hotspot logic and distance-based gradients.

The system adapts to any site boundary and integrates with the architectural model for coordinated delivery.`,
    images: [
      "/images/placeholder-02.svg",
      "/images/placeholder-03.svg",
    ],
    bodyMedia: [],
    order: 4,
  },
  {
    title: "Adaptive Interior Surfaces",
    slug: "adaptive-interior-surfaces",
    subtitle:
      "Parametric wall and ceiling panel system for an experiential retail space.",
    client: "Client C",
    year: 2024,
    location: "Rabat, Morocco",
    category: "interior",
    status: "Complete",
    thumbnail: "/images/placeholder-05.svg",
    heroImage: "/images/placeholder-05.svg",
    body: `A parametric surface system for retail interiors. Wall and ceiling panels follow a unified geometric logic, with variations in depth and angle creating visual rhythm across the space.

Acoustic performance was integrated into the parametric model, optimizing panel geometry for sound absorption.`,
    images: [
      "/images/placeholder-01.svg",
      "/images/placeholder-04.svg",
    ],
    bodyMedia: [],
    order: 5,
  },
];
