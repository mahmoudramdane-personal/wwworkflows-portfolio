import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Project, MediaAsset, Category } from "./types";

// Aperçu local d'un cas d'études, avant Contentful (dev seulement, jamais en production).
// Un dossier par cas : public/apercu/<slug>/note.md + ses images (à plat ou dans attachments/).
// public/apercu/ est ignoré par git : rien ne part sur GitHub ni sur Vercel.
// La page /project/<slug> affiche alors ce dossier avec le vrai gabarit.
const RACINE = path.join(process.cwd(), "public", "apercu");

// Mode insertion : frontmatter « insererApres: "<ligne exacte du corps Contentful>" ».
// La page garde alors tout son contenu Contentful, et le corps de note.md est inséré après cette ligne.
export type Apercu = Project & { insererApres?: string };

export function lireApercu(slug: string): Apercu | null {
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
    // [ \t]* et non \s* : en mode /m, \s avalerait les sauts de ligne et collerait deux images à la suite
    .replace(/^[ \t]*!\[\[([^\]]+)\]\][ \t]*$/gm, (_, f) => media(f))
    .replace(/^[ \t]*!\[[^\]]*\]\(([^)\s]+)\)[ \t]*$/gm, (m, f) => (/^https?:/.test(f) ? m : media(decodeURIComponent(f))));

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
    insererApres: typeof data.insererApres === "string" ? data.insererApres.trim() : undefined,
  };
}

// Vraie page + bloc de l'aperçu inséré après la ligne repère (le bloc s'affiche à la fin si la ligne n'existe plus)
export function fusionner(reel: Project, apercu: Apercu): Project {
  const lignes = reel.body.split("\n");
  const i = lignes.findIndex((l) => l.trim() === apercu.insererApres);
  const bloc = ["", apercu.body, ""];
  if (i < 0) lignes.push(...bloc);
  else lignes.splice(i + 1, 0, ...bloc);
  return { ...reel, body: lignes.join("\n"), bodyMedia: [...reel.bodyMedia, ...apercu.bodyMedia] };
}
