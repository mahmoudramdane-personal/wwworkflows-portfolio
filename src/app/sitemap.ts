import { getProjects } from "@/lib/contentful";
import { MetadataRoute } from "next";

export const revalidate = 60;

const BASE = "https://wwworkflows.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                  changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/cas-etudes`,  changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`,       changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`,     changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/articles`,    changeFrequency: "weekly",  priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/project/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Les articles repris d'afterworkworkflow.com restent hors du plan du site : l'original fait référence

  return [...staticRoutes, ...projectRoutes];
}