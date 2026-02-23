import { createClient } from "contentful";
import { Project, MediaAsset } from "./types";

const client =
  process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN
    ? createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      })
    : null;

export async function getProjects(): Promise<Project[]> {
  if (!client) {
    // Fallback to mock data when Contentful is not configured
    const { mockProjects } = await import("@/data/projects");
    return mockProjects;
  }

  const entries = await client.getEntries({
    content_type: "caseStudy",
    order: ["fields.order"] as const,
  });

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
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  if (!client) {
    const { mockProjects } = await import("@/data/projects");
    return mockProjects.find((p) => p.slug === slug) || null;
  }

  const entries = await client.getEntries({
    content_type: "caseStudy",
    "fields.slug": slug,
    limit: 1,
  });

  if (!entries.items.length) return null;

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
