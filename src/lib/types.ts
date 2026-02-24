export interface MediaAsset {
  url: string;
  filename: string;
  contentType: string;
  width?: number;
  height?: number;
}

export interface Project {
  title: string;
  slug: string;
  subtitle: string;
  client: string;
  year: number;
  location: string;
  category: Category;
  status: string;
  collaborators?: string;
  thumbnail: string;
  heroImage: string;
  body: string;
  images: string[];
  bodyMedia: MediaAsset[];
  order?: number;
}

export type Category =
  | "all"
  | "facade-design"
  | "algorithmic-systems"
  | "fabrication-planning"
  | "landscape-urban"
  | "interior";

export const CATEGORY_LABELS: Record<Category, string> = {
  all: "Tous",
  "facade-design": "Design de Façade",
  "algorithmic-systems": "Systèmes Algorithmiques",
  "fabrication-planning": "Planification de Fabrication",
  "landscape-urban": "Paysage & Urbanisme",
  interior: "Intérieur",
};

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category?: string;
  date: string;
  thumbnail?: string;
  order?: number;
}

export interface AboutPage {
  title: string;
  intro: string;
  body?: string;
  services?: { title: string; description: string }[];
  tools?: string[];
}

export interface ContactPage {
  title: string;
  intro?: string;
  email?: string;
  linkedinUrl?: string;
  linkedinLabel?: string;
  instagramUrl?: string;
  instagramLabel?: string;
  footerNote?: string;
}
