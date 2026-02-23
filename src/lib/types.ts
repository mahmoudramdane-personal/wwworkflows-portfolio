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
  all: "All",
  "facade-design": "Facade Design",
  "algorithmic-systems": "Algorithmic Systems",
  "fabrication-planning": "Fabrication Planning",
  "landscape-urban": "Landscape & Urban",
  interior: "Interior",
};
