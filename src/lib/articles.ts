import donnees from "@/content/articles.json";

// Articles du site : pour l'instant les mêmes que sur afterworkworkflow.com (Mahmoud, 26.10.26),
// repris par 06_SITE-WEB/_FABRICATION/importer_articles_afw.py. Chaque page renvoie vers l'original (canonical).
export interface ArticleLocal {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  minutes: number | null;
  date: string;
  image: string;
  imageAlt: string;
  source: string;
  body: string;
}

const articles = donnees as ArticleLocal[];

export function listeArticles(): ArticleLocal[] {
  return [...articles].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export function articleParSlug(slug: string): ArticleLocal | undefined {
  return articles.find((a) => a.slug === slug);
}

export function dateLisible(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}
