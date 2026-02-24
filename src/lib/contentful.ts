import { createClient } from "contentful";
import { Project, MediaAsset, AboutPage, ContactPage } from "./types";

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
      thumbnail: `https:${item.fields.thumbnail.fields.file.url}`,
      heroImage: `https:${item.fields.heroImage.fields.file.url}`,
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
      thumbnail: `https:${item.fields.thumbnail.fields.file.url}`,
      heroImage: `https:${item.fields.heroImage.fields.file.url}`,
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
