import { createClient } from "contentful";
import { Project, MediaAsset, AboutPage, ContactPage, Article } from "./types";
import type { Locale, SiteLang } from "./locale";

const client =
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
    ? createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      })
    : null;

export async function getProjects(): Promise<Project[]> {
  if (!client) {
    const { mockProjects } = await import("@/data/projects");
    return mockProjects;
  }

  try {
    const entries = await client.getEntries({
      content_type: "caseStudy",
      order: ["fields.order"] as const,
    });

    if (!entries.items.length) {
      const { mockProjects } = await import("@/data/projects");
      return mockProjects;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => ({
      title: item.fields.title,
      slug: item.fields.slug,
      subtitle: item.fields.subtitle,
      client: item.fields.client,
      year: item.fields.year,
      location: item.fields.location,
      category: item.fields.category,
      status: item.fields.status,
      collaborators: item.fields.collaborators || "",
      thumbnail: item.fields.thumbnail?.fields?.file?.url
        ? `https:${item.fields.thumbnail.fields.file.url}`
        : undefined,
      heroImage: item.fields.heroImage?.fields?.file?.url
        ? `https:${item.fields.heroImage.fields.file.url}`
        : undefined,
      body: item.fields.body,
      images: item.fields.projectImages?.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (img: any) => `https:${img.fields.file.url}`
      ) || [],
      bodyMedia: mapBodyMedia(item.fields.bodyMedia),
      order: item.fields.order || 0,
    }));
  } catch {
    console.warn("Contentful fetch failed, using mock data");
    const { mockProjects } = await import("@/data/projects");
    return mockProjects;
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  if (!client) {
    const { mockProjects } = await import("@/data/projects");
    return mockProjects.find((p) => p.slug === slug) || null;
  }

  try {
    const entries = await client.getEntries({
      content_type: "caseStudy",
      "fields.slug": slug,
      limit: 1,
    });

    if (!entries.items.length) {
      const { mockProjects } = await import("@/data/projects");
      return mockProjects.find((p) => p.slug === slug) || null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = entries.items[0] as any;
    return {
      title: item.fields.title,
      slug: item.fields.slug,
      subtitle: item.fields.subtitle,
      client: item.fields.client,
      year: item.fields.year,
      location: item.fields.location,
      category: item.fields.category,
      status: item.fields.status,
      collaborators: item.fields.collaborators || "",
      thumbnail: item.fields.thumbnail?.fields?.file?.url
        ? `https:${item.fields.thumbnail.fields.file.url}`
        : undefined,
      heroImage: item.fields.heroImage?.fields?.file?.url
        ? `https:${item.fields.heroImage.fields.file.url}`
        : undefined,
      body: item.fields.body,
      images: item.fields.projectImages?.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (img: any) => `https:${img.fields.file.url}`
      ) || [],
      bodyMedia: mapBodyMedia(item.fields.bodyMedia),
      order: item.fields.order || 0,
    };
  } catch {
    console.warn("Contentful fetch failed, using mock data");
    const { mockProjects } = await import("@/data/projects");
    return mockProjects.find((p) => p.slug === slug) || null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBodyMedia(assets: any[] | undefined): MediaAsset[] {
  if (!assets) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return assets.map((asset: any) => ({
    url: `https:${asset.fields.file.url}`,
    filename: asset.fields.file.fileName,
    contentType: asset.fields.file.contentType,
    width: asset.fields.file.details?.image?.width,
    height: asset.fields.file.details?.image?.height,
  }));
}

// --- Articles ---

const fallbackArticles: Article[] = [];

export async function getArticles(
  locale?: Locale
): Promise<Article[]> {
  if (!client) return fallbackArticles;

  try {
    const entries = await client.getEntries({
      content_type: "article",
      "fields.category[ne]": "AFW",
      order: ["-fields.date"] as const,
      locale: locale || "en-US",
    });

    if (!entries.items.length) return fallbackArticles;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.items.map((item: any) => ({
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      body: item.fields.body,
      category: item.fields.category || "",
      date: item.fields.date,
      thumbnail: item.fields.thumbnail
        ? `https:${item.fields.thumbnail.fields.file.url}`
        : "https://placehold.co/1200x675/f1f1f1/999?text=Article",
      order: item.fields.order || 0,
      lang: locale || "en-US",
    }));
  } catch {
    return fallbackArticles;
  }
}

export async function getArticleBySlug(slug: string, locale?: Locale): Promise<Article | null> {
  if (!client) return fallbackArticles.find((a) => a.slug === slug) || null;

  try {
    const entries = await client.getEntries({
      content_type: "article",
      "fields.category[ne]": "AFW",
      "fields.slug": slug,
      limit: 1,
      locale: locale || "en-US",
    });

    if (!entries.items.length) {
      return fallbackArticles.find((a) => a.slug === slug) || null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = entries.items[0] as any;
    return {
      title: item.fields.title,
      slug: item.fields.slug,
      excerpt: item.fields.excerpt,
      body: item.fields.body,
      category: item.fields.category || "",
      date: item.fields.date,
      thumbnail: item.fields.thumbnail
        ? `https:${item.fields.thumbnail.fields.file.url}`
        : "https://placehold.co/1200x675/f1f1f1/999?text=Article",
      order: item.fields.order || 0,
      lang: locale || "en-US",
    };
  } catch {
    return fallbackArticles.find((a) => a.slug === slug) || null;
  }
}

// --- About ---

export async function getAboutPage(): Promise<AboutPage> {
  const fallback: AboutPage = {
    title: "Studio",
    intro: "WWWorkflows est un studio de Computational Design spécialisé dans les systèmes algorithmiques pour l'architecture et la construction. Nous développons des outils paramétriques qui compressent les délais de conception, absorbent les modifications tardives et font le lien entre géométrie digitale et fabrication physique.\n\nNotre travail couvre le design de façade, la planification de fabrication, l'automatisation paysagère et le conseil en processus digitaux. Nous collaborons avec des agences d'architecture, des promoteurs et des entreprises — en offrant du Computational Design as a Service.",
    services: [
      { title: "Systèmes de Façade", description: "Design paramétrique de façade, systèmes double peau, optimisation de panneaux et algorithmes de mur-rideau." },
      { title: "Design Algorithmique", description: "Outils de design génératif, form-finding et scripts d'optimisation pour projets architecturaux." },
      { title: "Planification de Fabrication", description: "Modèles prêts CNC, planification d'assemblage et workflows de fabrication digitale." },
      { title: "Automatisation Digitale", description: "Automatisation de processus, rendu par lots, configurateurs et outils Grasshopper sur mesure." },
    ],
    tools: ["Rhino", "Grasshopper", "Revit", "Ladybug", "Python", "Hops", "Lumion", "Miro"],
  };

  if (!client) return fallback;

  try {
    const entries = await client.getEntries({
      content_type: "aboutPage",
      limit: 1,
    });
    if (!entries.items.length) return fallback;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = entries.items[0] as any;
    let services = fallback.services;
    try {
      if (item.fields.services) services = JSON.parse(item.fields.services);
    } catch { /* use fallback */ }

    return {
      title: item.fields.title || fallback.title,
      intro: item.fields.intro || fallback.intro,
      body: item.fields.body,
      services,
      tools: item.fields.tools ? item.fields.tools.split(",").map((t: string) => t.trim()) : fallback.tools,
    };
  } catch {
    return fallback;
  }
}

export async function getContactPage(): Promise<ContactPage> {
  const fallback: ContactPage = {
    title: "Contact",
    intro: "Pour toute demande de projet, consultation ou collaboration — contactez-nous.",
    email: "mahmoud@wwworkflows.com",
    phone: "+212 6 23 63 32 22",
    linkedinUrl: "https://www.linkedin.com/in/mahmoudramdane/",
    linkedinLabel: "Mahmoud Ramdane",
    instagramUrl: "https://www.instagram.com/wwworkflows",
    instagramLabel: "@wwworkflows",
    footerNote: "Basé au Maroc. Projets à l'international.",
  };

  if (!client) return fallback;

  try {
    const entries = await client.getEntries({
      content_type: "contactPage",
      limit: 1,
    });
    if (!entries.items.length) return fallback;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = entries.items[0] as any;
    return {
      title: item.fields.title || fallback.title,
      intro: item.fields.intro || fallback.intro,
      email: item.fields.email || fallback.email,
      phone: item.fields.phone || fallback.phone,
      linkedinUrl: item.fields.linkedinUrl || fallback.linkedinUrl,
      linkedinLabel: item.fields.linkedinLabel || fallback.linkedinLabel,
      instagramUrl: item.fields.instagramUrl || fallback.instagramUrl,
      instagramLabel: item.fields.instagramLabel || fallback.instagramLabel,
      footerNote: item.fields.footerNote || fallback.footerNote,
    };
  } catch {
    return fallback;
  }
}
