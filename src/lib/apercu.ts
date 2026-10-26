import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Project, MediaAsset, Category } from "./types";

// Aperçu local d'un cas d'études, avant Contentful (dev seulement, jamais en production).
// Un dossier par cas : public/apercu/<slug>/note.md + ses images (à plat ou dans attachments/).
// public/apercu/ est ignoré par git : rien ne part sur GitHub ni sur Vercel.
// La page /project/<slug> affiche alors ce dossier avec le vrai gabarit.
const RACINE = path.join(process.cwd(), "public", "apercu");

export function lireApercu(slug: string): Project | null {
  if (process.env.NODE_ENV === "production") return null;
  const dossier = path.join(RACINE, slug);
  const note = path.join(dossier, "note.md");
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(note)) return null;

  const { data, content } = matter(fs.readFileSync(note, "utf-8"));
  let body = content.trim();

  // Sans frontmatter : le premier titre « # » sert de titre du cas
  let title = data.title as string | undefined;
  const h1 = body.match(/^# (.+)$/m);
  if (h1) {
    title = title || h1[1].trim();
    body = body.replace(h1[0], "").trim();
  }

  // Images du dossier, servies par Next depuis public/
  const bodyMedia: MediaAsset[] = [];
  const url = (fichier: string) => {
    const nom = path.basename(fichier);
    for (const sous of ["", "attachments"]) {
      if (fs.existsSync(path.join(dossier, sous, nom)))
        return `/apercu/${slug}/${sous ? sous + "/" : ""}${encodeURIComponent(nom)}`;
    }
    return null;
  };
  const media = (fichier: string) => {
    const nom = path.basename(fichier.split("|")[0].trim());
    const u = url(nom);
    if (!u) return `> Image introuvable dans l'aperçu : ${nom}`;
    if (/\.(mp4|webm|mov)$/i.test(nom)) {
      bodyMedia.push({ url: u, filename: nom, contentType: "video/mp4" });
      return `{{video:${nom}}}`;
    }
    bodyMedia.push({ url: u, filename: nom, contentType: nom.endsWith(".gif") ? "image/gif" : "image/*" });
    return `{{media:${nom}}}`;
  };
  // Même conversion que scripts/publish.mjs : ![[x.png]], ![[x.png|500]], ![](./attachments/x.png)
  body = body
    .replace(/^\s*!\[\[([^\]]+)\]\]\s*$/gm, (_, f) => media(f))
    .replace(/^\s*!\[[^\]]*\]\(([^)\s]+)\)\s*$/gm, (m, f) => (/^https?:/.test(f) ? m : media(decodeURIComponent(f))));

  // Toutes les images du dossier sont aussi disponibles pour les embeds qui les cherchent par nom ({{eclate:…}})
  for (const sous of ["", "attachments"]) {
    const d = path.join(dossier, sous);
    if (!fs.existsSync(d)) continue;
    for (const nom of fs.readdirSync(d)) {
      if (!/\.(png|webp|jpe?g|gif)$/i.test(nom) || bodyMedia.some((m) => m.filename === nom)) continue;
      const asset: MediaAsset = { url: url(nom)!, filename: nom, contentType: "image/*" };
      // Taille lue dans l'en-tête PNG (l'éclaté garde le cadrage de ses calques)
      const tete = fs.readFileSync(path.join(d, nom)).subarray(0, 24);
      if (tete.toString("ascii", 1, 4) === "PNG") {
        asset.width = tete.readUInt32BE(16);
        asset.height = tete.readUInt32BE(20);
      }
      bodyMedia.push(asset);
    }
  }

  const image = (champ: unknown) => (typeof champ === "string" ? url(champ) || undefined : undefined);

  return {
    title: title || slug,
    slug,
    subtitle: (data.subtitle as string) || "",
    client: (data.client as string) || "",
    year: Number(data.year) || new Date().getFullYear(),
    location: (data.location as string) || "",
    category: ((data.category as Category) || "algorithmic-systems"),
    status: (data.status as string) || "Aperçu",
    collaborators: (data.collaborators as string) || "",
    thumbnail: image(data.thumbnail) || image(data.heroImage),
    heroImage: image(data.heroImage),
    body,
    images: [],
    bodyMedia,
  };
}
