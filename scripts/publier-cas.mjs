// Publie un cas d'études : l'aperçu local public/apercu/<slug>/ devient public/cas-etudes/<slug>/,
// lu par le site au build (plus de Contentful depuis le 26.10.26). Rien ne part en ligne avant le git push.
//   npm run publier-cas -- <slug>              (refuse d'écraser un cas déjà publié)
//   npm run publier-cas -- <slug> --remplacer  (remplace un cas publié ; l'ancienne version reste dans l'historique git)
// Images converties en WebP (GIF → WebP animé), largeur limitée ; vidéos copiées telles quelles ;
// note.md réécrite avec les nouveaux noms (![[x.png]], ![](./attachments/x.png), {{media:x.png}}, thumbnail, heroImage).
import fs from "fs";
import path from "path";
import sharp from "sharp";
import matter from "gray-matter";

const MAX_CORPS_PX = 1600; // images du texte (affichées jusqu'à ~1300 px)
const MAX_UNE_PX = 2400; // vignette et image principale

const [slug, option] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage : npm run publier-cas -- <slug>");
  process.exit(1);
}
const source = path.join("public", "apercu", slug);
const cible = path.join("public", "cas-etudes", slug);
if (!fs.existsSync(path.join(source, "note.md"))) {
  console.error(`Pas d'aperçu : ${source}/note.md`);
  process.exit(1);
}
if (fs.existsSync(cible) && option !== "--remplacer") {
  console.error(`${cible} existe déjà. Relancer avec --remplacer après avoir vérifié l'aperçu.`);
  process.exit(1);
}

const { data, content } = matter(fs.readFileSync(path.join(source, "note.md"), "utf-8"));
if (data.insererApres || data.remplacer) {
  // Mode insertion : le bloc complète un cas publié ; on le reporte à la main dans public/cas-etudes/<slug>/note.md
  console.error("Cet aperçu complète un cas publié (insererApres / remplacer) : reporter le bloc à la main dans la note publiée.");
  process.exit(1);
}

const fichiers = [];
for (const sous of ["", "attachments"]) {
  const d = path.join(source, sous);
  if (fs.existsSync(d)) for (const nom of fs.readdirSync(d)) if (fs.statSync(path.join(d, nom)).isFile() && nom !== "note.md") fichiers.push(path.join(d, nom));
}

const une = new Set([data.thumbnail, data.heroImage].filter(Boolean).map((f) => path.basename(f)));
const tmp = cible + ".tmp";
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

const noms = {}; // ancien nom → nouveau nom
let avant = 0, apres = 0;
for (const f of fichiers) {
  const nom = path.basename(f);
  const ext = path.extname(nom).toLowerCase();
  let nouveau = nom;
  if (ext === ".webp") {
    // Déjà en WebP (souvent repris d'un cas publié, parfois animé) : copié tel quel, pas de seconde compression
    fs.copyFileSync(f, path.join(tmp, nouveau));
  } else if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) {
    nouveau = nom.replace(/\.[^.]+$/, ".webp");
    const largeur = une.has(nom) ? MAX_UNE_PX : MAX_CORPS_PX;
    await sharp(f, { animated: ext === ".gif", limitInputPixels: false })
      .resize({ width: largeur, withoutEnlargement: true })
      .webp(ext === ".gif" ? { quality: 75, effort: 4 } : { quality: 85 })
      .toFile(path.join(tmp, nouveau));
  } else if ([".mp4", ".webm", ".mov"].includes(ext)) {
    fs.copyFileSync(f, path.join(tmp, nouveau));
  } else continue;
  if (Object.values(noms).includes(nouveau)) throw new Error(`Deux fichiers donnent ${nouveau} : renommer l'un d'eux.`);
  noms[nom] = nouveau;
  avant += fs.statSync(f).size;
  apres += fs.statSync(path.join(tmp, nouveau)).size;
}

const renomme = (f) => noms[path.basename(f)] || path.basename(f);
const corps = content
  .replace(/!\[\[([^\]|]+)(\|[^\]]*)?\]\]/g, (_, f, opt) => `![[${renomme(f)}${opt || ""}]]`)
  .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, f) => (/^https?:/.test(f) ? m : `![${alt}](${encodeURI(renomme(decodeURIComponent(f)))})`))
  .replace(/\{\{(media|video):([^}]+)\}\}/g, (_, t, f) => `{{${t}:${renomme(f)}}}`);
const fm = { ...data };
if (fm.thumbnail) fm.thumbnail = renomme(fm.thumbnail);
if (fm.heroImage) fm.heroImage = renomme(fm.heroImage);
if (fm.status === "Aperçu") delete fm.status;
fs.writeFileSync(path.join(tmp, "note.md"), matter.stringify(corps, fm));

if (fs.existsSync(cible)) {
  console.error(`Remplacement de ${cible} : l'ancienne version reste dans git (git log -- ${cible}).`);
  fs.rmSync(cible, { recursive: true });
}
fs.renameSync(tmp, cible);
const mo = (n) => (n / 1e6).toFixed(1) + " Mo";
console.log(`Publié en local : ${cible} (${Object.keys(noms).length} fichiers, ${mo(avant)} → ${mo(apres)}).`);
console.log("Vérifier avec npm run dev, puis git add / commit / push (après le go de Mahmoud).");
