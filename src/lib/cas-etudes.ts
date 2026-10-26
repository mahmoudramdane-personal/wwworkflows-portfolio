import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Project, MediaAsset, Category } from "./types";

// Cas d'études du site, lus dans le dépôt (plus de Contentful depuis le 26.10.26).
// Un dossier par cas : public/cas-etudes/<slug>/note.md + ses images (à plat ou dans attachments/).
// Aperçu local d'un cas pas encore publié : même format dans public/apercu/<slug>/ (ignoré par git,
// lu en développement seulement). Publier = passer le dossier dans public/cas-etudes/ (scripts/publier-cas.mjs).
const CAS = "cas-etudes";
const APERCU = "apercu";

// Mode insertion (aperçu seulement) : frontmatter « insererApres: "<ligne exacte du corps publié>" ».
// La page garde alors tout son contenu publié, et le corps de note.md est inséré après cette ligne.
// Et « remplacer: [{ de: "texte en ligne", par: "texte corrigé" }] » pour corriger une phrase du corps publié.
export type Apercu = Project & { insererApres?: string; remplacer?: { de: string; par: string }[] };

// La marque s'écrit WWWORKFLOWS en majuscules sur le site, quel que soit le texte de la note
const marque = (t: unknown): string => (typeof t === "string" ? t.replace(/WWWorkflows/g, "WWWORKFLOWS") : "");

const slugValide = (slug: string) => /^[a-z0-9-]+$/.test(slug);

function lireDossier(base: string, slug: string): Apercu | null {
  const dossier = path.join(process.cwd(), "public", base, slug);
  const note = path.join(dossier, "note.md");
  if (!slugValide(slug) || !fs.existsSync(note)) return null;

  const { data, content } = matter(fs.readFileSync(note, "utf-8"));
  let body = content.replace(/\r\n?/g, "\n").trim();

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
        return `/${base}/${slug}/${sous ? sous + "/" : ""}${encodeURIComponent(nom)}`;
    }
    return null;
  };
  const media = (fichier: string) => {
    const nom = path.basename(fichier.split("|")[0].trim());
    const u = url(nom);
    if (!u) return `> Image introuvable : ${nom}`;
    if (/\.(mp4|webm|mov)$/i.test(nom)) {
      bodyMedia.push({ url: u, filename: nom, contentType: "video/mp4" });
      return `{{video:${nom}}}`;
    }
    return `{{media:${nom}}}`;
  };
  // Syntaxe Obsidian acceptée : ![[x.png]], ![[x.png|500]], ![](./attachments/x.png)
  body = body
    // [ \t]* et non \s* : en mode /m, \s avalerait les sauts de ligne et collerait deux images à la suite
    .replace(/^[ \t]*!\[\[([^\]]+)\]\][ \t]*$/gm, (_, f) => media(f))
    .replace(/^[ \t]*!\[[^\]]*\]\(([^)\s]+)\)[ \t]*$/gm, (m, f) => (/^https?:/.test(f) ? m : media(decodeURIComponent(f))));

  // Toutes les images du dossier sont disponibles pour {{media:…}} et les embeds qui les cherchent par nom ({{eclate:…}})
  for (const sous of ["", "attachments"]) {
    const d = path.join(dossier, sous);
    if (!fs.existsSync(d)) continue;
    for (const nom of fs.readdirSync(d)) {
      if (!/\.(png|webp|jpe?g|gif)$/i.test(nom) || bodyMedia.some((m) => m.filename === nom)) continue;
      const taille = tailleImage(path.join(d, nom));
      bodyMedia.push({
        url: url(nom)!,
        filename: nom,
        // Un WebP animé (ancien GIF) garde le lecteur des GIF : image fixe, animation au survol
        contentType: nom.endsWith(".gif") || taille?.anime ? "image/gif" : "image/*",
        width: taille?.largeur,
        height: taille?.hauteur,
      });
    }
  }

  const image = (champ: unknown) => (typeof champ === "string" ? url(champ) || undefined : undefined);

  return {
    title: marque(title || slug),
    slug,
    subtitle: marque(data.subtitle),
    client: (data.client as string) || "",
    year: Number(data.year) || new Date().getFullYear(),
    location: (data.location as string) || "",
    category: (data.category as Category) || "algorithmic-systems",
    status: (data.status as string) || (base === APERCU ? "Aperçu" : ""),
    collaborators: (data.collaborators as string) || "",
    thumbnail: image(data.thumbnail) || image(data.heroImage),
    heroImage: image(data.heroImage),
    body,
    images: Array.isArray(data.projectImages) ? data.projectImages.map(image).filter((x): x is string => !!x) : [],
    bodyMedia,
    order: Number(data.order) || 0,
    insererApres: typeof data.insererApres === "string" ? data.insererApres.trim() : undefined,
    remplacer: Array.isArray(data.remplacer) ? data.remplacer : undefined,
  };
}

// Taille lue dans l'en-tête du fichier (PNG, JPEG, WebP), pour réserver la place de l'image
function tailleImage(fichier: string): { largeur: number; hauteur: number; anime?: boolean } | null {
  const b = fs.readFileSync(fichier);
  if (b.toString("ascii", 1, 4) === "PNG") return { largeur: b.readUInt32BE(16), hauteur: b.readUInt32BE(20) };
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const morceau = b.toString("ascii", 12, 16);
    if (morceau === "VP8X")
      return { largeur: 1 + b.readUIntLE(24, 3), hauteur: 1 + b.readUIntLE(27, 3), anime: (b[20] & 0x02) !== 0 };
    if (morceau === "VP8L") {
      const n = b.readUInt32LE(21);
      return { largeur: 1 + (n & 0x3fff), hauteur: 1 + ((n >> 14) & 0x3fff) };
    }
    if (morceau === "VP8 ") return { largeur: b.readUInt16LE(26) & 0x3fff, hauteur: b.readUInt16LE(28) & 0x3fff };
    return null;
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i < b.length - 9; ) {
      if (b[i] !== 0xff) return null;
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { largeur: b.readUInt16BE(i + 7), hauteur: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

export function listeCas(): Project[] {
  const racine = path.join(process.cwd(), "public", CAS);
  if (!fs.existsSync(racine)) return [];
  return fs
    .readdirSync(racine)
    .map((slug) => lireDossier(CAS, slug))
    .filter((p): p is Apercu => !!p)
    .sort((a, b) => (a.order || 0) - (b.order || 0) || a.title.localeCompare(b.title));
}

export function casParSlug(slug: string): Project | null {
  const publie = lireDossier(CAS, slug);
  // Aperçu local (public/apercu/<slug>/note.md) : en développement seulement, jamais en production
  if (process.env.NODE_ENV === "production") return publie;
  const apercu = lireDossier(APERCU, slug);
  if (!apercu) return publie;
  if (!apercu.insererApres) return apercu;
  return publie ? fusionner(publie, apercu) : apercu;
}

// Page publiée + bloc de l'aperçu inséré après la ligne repère (le bloc s'affiche à la fin si la ligne n'existe plus)
function fusionner(reel: Project, apercu: Apercu): Project {
  let corps = reel.body;
  for (const r of apercu.remplacer || []) {
    if (!corps.includes(r.de)) console.warn(`[aperçu] texte à remplacer introuvable : ${r.de}`);
    corps = corps.split(r.de).join(r.par);
  }
  const lignes = corps.split("\n");
  const i = lignes.findIndex((l) => l.trim() === apercu.insererApres);
  const bloc = ["", apercu.body, ""];
  if (i < 0) lignes.push(...bloc);
  else lignes.splice(i + 1, 0, ...bloc);
  return { ...reel, body: lignes.join("\n"), bodyMedia: [...reel.bodyMedia, ...apercu.bodyMedia] };
}
