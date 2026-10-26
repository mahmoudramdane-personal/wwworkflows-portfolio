import { Project, AboutPage } from "./types";
import { listeCas, casParSlug } from "./cas-etudes";
import studio from "@/content/studio.json";

// Contenu du site, tout dans le dépôt depuis le 26.10.26 (Contentful arrêté, sauvegarde dans 06_SITE-WEB/_CONTENTFUL_SAUVEGARDE_261026/) :
// cas d'études dans public/cas-etudes/, articles dans src/content/articles.json, page Studio dans src/content/studio.json.
export async function getProjects(): Promise<Project[]> {
  return listeCas();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return casParSlug(slug);
}

export async function getAboutPage(): Promise<AboutPage> {
  return studio;
}
