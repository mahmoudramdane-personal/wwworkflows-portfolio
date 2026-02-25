# SEO Metadata + Obsidian → Contentful Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add per-page SEO/OG metadata to all project and article pages, and build a one-command CLI script that reads an Obsidian `.md` file, optimizes its images, and publishes the content to Contentful as a live Article or Case Study.

**Architecture:** Three independent changes — (1) Next.js `generateMetadata()` on project/article pages, (2) a Node ESM script `scripts/publish.mjs` using the Contentful Management API + `sharp` for image optimization, (3) an `OBSIDIAN_WRITING_GUIDE.md` reference doc. No new pages or components. No test framework — verification is `npm run build` + manual spot-checks.

**Tech Stack:** Next.js 16 Metadata API, `sharp ^0.34.5` (already installed), `contentful-management ^11.72.1` (already installed), `gray-matter` (to install), Contentful Management API, Node.js ESM (`--env-file` flag for env loading).

---

## Task 1: Add `metadataBase` to root layout

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Open the file and find the metadata export (line 14)**

Current:
```typescript
export const metadata: Metadata = {
  title: "WWWorkflows - Studio de Design Computationnel",
  description: "...",
};
```

**Step 2: Replace it with this**

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://wwworkflows.com"),
  title: {
    default: "WWWorkflows — Studio de Design Computationnel",
    template: "%s — WWWorkflows",
  },
  description:
    "Computational Design as a Service. Systèmes algorithmiques de façade, planification paramétrique de fabrication et automatisation digitale pour l'architecture.",
  openGraph: {
    siteName: "WWWorkflows",
    locale: "fr_FR",
    type: "website",
  },
};
```

`metadataBase` is required so that relative image URLs in OG tags resolve to absolute URLs correctly. The `template` makes every page automatically get ` — WWWorkflows` appended to its title without repeating it.

**Step 3: Verify it builds**

```bash
npm run build
```

Expected: no type errors, build succeeds.

**Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add metadataBase and title template to root layout"
```

---

## Task 2: Add `generateMetadata` to project detail page

**Files:**
- Modify: `src/app/project/[slug]/page.tsx`

**Step 1: Add the `Metadata` import at the top**

The file already imports from `next/navigation` and `next`. Add `Metadata` to the `next` import:

```typescript
import type { Metadata } from "next";
```

Add this right after the existing imports.

**Step 2: Add `generateMetadata` function — insert it right before `export default async function ProjectPage`**

```typescript
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.subtitle,
    openGraph: {
      title: project.title,
      description: project.subtitle,
      url: `/project/${project.slug}`,
      type: "article",
      images: project.heroImage
        ? [{ url: project.heroImage, width: 1200, height: 630, alt: project.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
```

Note: `title: project.title` here is the bare title — the `template: "%s — WWWorkflows"` from layout.tsx will wrap it automatically, producing e.g. `"WWW x YDA — WWWorkflows"` in the browser tab.

**Step 3: Verify build**

```bash
npm run build
```

Expected: `project/[slug]` pages now show individual titles in build output, no errors.

**Step 4: Commit**

```bash
git add src/app/project/[slug]/page.tsx
git commit -m "feat: add SEO and Open Graph metadata to project pages"
```

---

## Task 3: Add `generateMetadata` to article detail page

**Files:**
- Modify: `src/app/article/[slug]/page.tsx`

**Step 1: Add `Metadata` import**

```typescript
import type { Metadata } from "next";
```

**Step 2: Add `generateMetadata` — insert before `export default async function ArticlePage`**

```typescript
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/article/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      images: article.thumbnail
        ? [{ url: article.thumbnail, width: 1200, height: 630, alt: article.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
```

**Step 3: Verify build**

```bash
npm run build
```

Expected: no errors. Article pages have individual titles.

**Step 4: Commit**

```bash
git add src/app/article/[slug]/page.tsx
git commit -m "feat: add SEO and Open Graph metadata to article pages"
```

---

## Task 4: Install `gray-matter`

**Step 1: Install**

```bash
npm install gray-matter
```

`sharp` and `contentful-management` are already in `package.json` (as devDependencies). `gray-matter` parses YAML frontmatter from markdown files — pure JS, no binary.

**Step 2: Verify install**

```bash
npm ls gray-matter
```

Expected: shows `gray-matter@x.x.x`.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gray-matter for frontmatter parsing in publish script"
```

---

## Task 5: Write the publish script

**Files:**
- Create: `scripts/publish.mjs`

This is the full pipeline. Create the file with exactly this content:

```javascript
#!/usr/bin/env node
// scripts/publish.mjs
// Publishes an Obsidian .md file to Contentful as an Article or Case Study.
//
// Usage:
//   node --env-file=.env.local scripts/publish.mjs "C:/path/to/note.md"
//
// Required env vars in .env.local:
//   CONTENTFUL_SPACE_ID
//   CONTENTFUL_MANAGEMENT_TOKEN   ← get from Contentful > Settings > API Keys > Personal Access Tokens
//
// Vault structure expected:
//   MyNote/
//     note.md
//     attachments/
//       hero.jpg
//       diagram.gif
//       process.mp4

import { createClient } from "contentful-management";
import matter from "gray-matter";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ────────────────────────────────────────────────────────────────

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const LOCALE = "en-US"; // Change if your Contentful space uses a different locale
const ENV_ID = "master";

const MAX_BODY_PX = 1200;  // max width for in-body images
const MAX_HERO_PX = 2400;  // max width for hero / thumbnail images

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const notePath = process.argv[2];

  if (!notePath) {
    console.error(
      "\nUsage: node --env-file=.env.local scripts/publish.mjs \"path/to/note.md\"\n"
    );
    process.exit(1);
  }

  if (!SPACE_ID || !MANAGEMENT_TOKEN) {
    console.error(
      "\nMissing env vars. Add to .env.local:\n" +
        "  CONTENTFUL_MANAGEMENT_TOKEN=your_personal_access_token\n" +
        "  CONTENTFUL_SPACE_ID=your_space_id\n"
    );
    process.exit(1);
  }

  const absPath = path.resolve(notePath);
  if (!fs.existsSync(absPath)) {
    console.error(`\nFile not found: ${absPath}\n`);
    process.exit(1);
  }

  const noteDir = path.dirname(absPath);
  const attachmentsDir = path.join(noteDir, "attachments");

  console.log(`\n📄 Reading: ${absPath}`);

  // 1. Parse frontmatter + body
  const raw = fs.readFileSync(absPath, "utf-8");
  const { data: fm, content: rawBody } = matter(raw);

  validateFrontmatter(fm);

  // 2. Connect to Contentful
  console.log(`\n🔗 Connecting to Contentful...`);
  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENV_ID);

  // 3. Collect all local media references
  const mediaRefs = collectMediaRefs(rawBody, fm, attachmentsDir);
  console.log(`\n🖼  Found ${mediaRefs.length} media asset(s)`);

  // 4. Optimize + upload each asset
  const uploadedAssets = {}; // originalFilename → { id }
  const tmpFiles = [];

  for (const ref of mediaRefs) {
    const localPath = path.join(attachmentsDir, ref.filename);
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️  Not found: ${ref.filename} — skipping`);
      continue;
    }

    console.log(`\n  → Processing: ${ref.filename}`);
    const { optimizedPath, mimeType } = await optimizeAsset(
      localPath,
      ref.filename,
      ref.maxWidth
    );
    if (optimizedPath !== localPath) tmpFiles.push(optimizedPath);

    console.log(`  → Uploading to Contentful...`);
    const asset = await uploadAsset(env, optimizedPath, ref.filename, mimeType);
    uploadedAssets[ref.filename] = { id: asset.sys.id };
    console.log(`  ✓  Uploaded: ${ref.filename} (id: ${asset.sys.id})`);
  }

  // 5. Transform body (Obsidian syntax → {{media:}} / {{youtube:}} / {{video:}})
  const transformedBody = transformBody(rawBody);

  // 6. Upsert Contentful entry
  console.log(`\n📝 Publishing ${fm.type}: "${fm.title}"`);
  if (fm.type === "article") {
    await upsertArticle(env, fm, transformedBody, uploadedAssets);
  } else {
    await upsertProject(env, fm, transformedBody, uploadedAssets);
  }

  // 7. Cleanup temp files
  for (const f of tmpFiles) {
    try {
      fs.unlinkSync(f);
    } catch {}
  }

  const pageType = fm.type === "article" ? "article" : "project";
  console.log(
    `\n✅ Done! Live in ~60s at https://wwworkflows.com/${pageType}/${fm.slug}\n`
  );
}

// ─── Validation ────────────────────────────────────────────────────────────

function validateFrontmatter(fm) {
  if (!fm.type || !["article", "project"].includes(fm.type)) {
    console.error('\nFrontmatter must have: type: article  OR  type: project\n');
    process.exit(1);
  }
  if (!fm.slug) {
    console.error('\nFrontmatter must have a slug (e.g. slug: mon-article)\n');
    process.exit(1);
  }
  if (!fm.title) {
    console.error('\nFrontmatter must have a title\n');
    process.exit(1);
  }
  if (fm.type === "project" && !fm.client) {
    console.error('\nProject frontmatter must have a client field\n');
    process.exit(1);
  }
}

// ─── Media collection ──────────────────────────────────────────────────────

function collectMediaRefs(body, fm, attachmentsDir) {
  const refs = new Map(); // basename → { filename, maxWidth }

  const add = (filename, maxWidth = MAX_BODY_PX) => {
    const basename = path.basename(filename);
    if (basename && !refs.has(basename)) {
      refs.set(basename, { filename: basename, maxWidth });
    }
  };

  // Frontmatter image fields
  if (fm.thumbnail) add(fm.thumbnail, MAX_HERO_PX);
  if (fm.heroImage) add(fm.heroImage, MAX_HERO_PX);
  if (Array.isArray(fm.projectImages)) {
    for (const img of fm.projectImages) add(img, MAX_HERO_PX);
  }

  // Body: Obsidian wiki-links  ![[image.png]]  or  ![[image.png|500]]
  for (const m of body.matchAll(/!\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g)) {
    add(path.basename(m[1]));
  }

  // Body: Standard markdown images  ![alt](./attachments/image.png)
  for (const m of body.matchAll(/!\[[^\]]*\]\((?:\.\/)?attachments\/([^)]+)\)/g)) {
    add(path.basename(m[1]));
  }

  // Filter to files that actually exist
  return [...refs.values()].filter((ref) =>
    fs.existsSync(path.join(attachmentsDir, ref.filename))
  );
}

// ─── Asset optimization ────────────────────────────────────────────────────

async function optimizeAsset(inputPath, filename, maxWidth) {
  const ext = path.extname(filename).toLowerCase();

  // Videos: pass through unchanged
  if ([".mp4", ".mov", ".webm", ".avi"].includes(ext)) {
    return { optimizedPath: inputPath, mimeType: "video/mp4" };
  }

  // GIF → animated WebP (better compression, same animation)
  if (ext === ".gif") {
    const outPath = inputPath.replace(/\.gif$/i, "-optimized.webp");
    await sharp(inputPath, { animated: true })
      .webp({ quality: 75, effort: 4 })
      .toFile(outPath);
    logSizeReduction(inputPath, outPath, "GIF→WebP");
    return { optimizedPath: outPath, mimeType: "image/webp" };
  }

  // JPG / PNG / WEBP → resized WebP
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    const outPath = inputPath.replace(/\.(jpg|jpeg|png|webp)$/i, "-optimized.webp");
    await sharp(inputPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outPath);
    logSizeReduction(inputPath, outPath, `${ext}→WebP`);
    return { optimizedPath: outPath, mimeType: "image/webp" };
  }

  // Unknown format: pass through
  return { optimizedPath: inputPath, mimeType: "application/octet-stream" };
}

function logSizeReduction(inputPath, outputPath, label) {
  const before = fs.statSync(inputPath).size;
  const after = fs.statSync(outputPath).size;
  const pct = Math.round((1 - after / before) * 100);
  console.log(
    `     ${label}: ${kb(before)} → ${kb(after)} (${pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`})`
  );
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)}KB`;
}

// ─── Contentful asset upload ───────────────────────────────────────────────

async function uploadAsset(env, filePath, originalFilename, mimeType) {
  // Check if asset with this filename already exists → reuse it
  const existing = await env.getAssets({ limit: 100 });
  const found = existing.items.find((a) => {
    const file = a.fields?.file?.[LOCALE];
    return file && file.fileName === originalFilename;
  });

  if (found) {
    console.log(`     Already exists in Contentful — reusing`);
    return found;
  }

  // Upload binary
  const fileBuffer = fs.readFileSync(filePath);
  const upload = await env.createUpload({ file: fileBuffer });

  // Create asset entry
  let asset = await env.createAsset({
    fields: {
      title: { [LOCALE]: originalFilename },
      file: {
        [LOCALE]: {
          contentType: mimeType,
          fileName: originalFilename,
          uploadFrom: {
            sys: { type: "Link", linkType: "Upload", id: upload.sys.id },
          },
        },
      },
    },
  });

  // Trigger CDN processing
  await asset.processForLocale(LOCALE);

  // Poll until URL is available (processing takes 2–10s)
  asset = await waitForProcessing(env, asset.sys.id);

  // Publish
  await asset.publish();
  return asset;
}

async function waitForProcessing(env, assetId, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const asset = await env.getAsset(assetId);
    if (asset.fields?.file?.[LOCALE]?.url) return asset;
    process.stdout.write(i === 0 ? "     Processing." : ".");
    await sleep(2000);
  }
  console.log();
  throw new Error(`Asset ${assetId} processing timed out after ${maxAttempts * 2}s`);
}

// ─── Body transformation ───────────────────────────────────────────────────

function transformBody(body) {
  let result = body;

  // Obsidian wiki-links: ![[image.png]] or ![[image.png|500]] → {{media:image.png}}
  //                      ![[video.mp4]]                       → {{video:video.mp4}}
  result = result.replace(/!\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g, (_, filename) => {
    const basename = path.basename(filename);
    const ext = path.extname(basename).toLowerCase();
    if ([".mp4", ".mov", ".webm"].includes(ext)) return `{{video:${basename}}}`;
    return `{{media:${basename}}}`;
  });

  // Standard markdown images from attachments: ![alt](./attachments/image.png)
  result = result.replace(
    /!\[[^\]]*\]\((?:\.\/)?attachments\/([^)]+)\)/g,
    (_, filename) => {
      const basename = path.basename(filename);
      const ext = path.extname(basename).toLowerCase();
      if ([".mp4", ".mov", ".webm"].includes(ext)) return `{{video:${basename}}}`;
      return `{{media:${basename}}}`;
    }
  );

  // YouTube URLs on their own line → {{youtube:VIDEO_ID}}
  result = result.replace(
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]+)[^\n]*/mg,
    "{{youtube:$1}}"
  );
  result = result.replace(
    /^https?:\/\/youtu\.be\/([A-Za-z0-9_-]+)[^\n]*/mg,
    "{{youtube:$1}}"
  );

  return result.trim();
}

// ─── Contentful entry upsert ───────────────────────────────────────────────

async function upsertArticle(env, fm, body, assets) {
  const fields = {
    title:    { [LOCALE]: fm.title },
    slug:     { [LOCALE]: fm.slug },
    excerpt:  { [LOCALE]: fm.excerpt || "" },
    body:     { [LOCALE]: body },
    category: { [LOCALE]: fm.category || "" },
    date:     { [LOCALE]: fm.date ? String(fm.date) : new Date().toISOString().split("T")[0] },
    order:    { [LOCALE]: Number(fm.order) || 0 },
  };

  // Thumbnail link
  const thumbBase = fm.thumbnail ? path.basename(fm.thumbnail) : null;
  if (thumbBase && assets[thumbBase]) {
    fields.thumbnail = {
      [LOCALE]: { sys: { type: "Link", linkType: "Asset", id: assets[thumbBase].id } },
    };
  }

  // bodyMedia: all assets referenced in the transformed body
  const bodyMediaLinks = getBodyMediaLinks(body, assets);
  if (bodyMediaLinks.length) {
    fields.bodyMedia = { [LOCALE]: bodyMediaLinks };
  }

  await upsertEntry(env, "article", fm.slug, fields);
}

async function upsertProject(env, fm, body, assets) {
  const fields = {
    title:         { [LOCALE]: fm.title },
    slug:          { [LOCALE]: fm.slug },
    subtitle:      { [LOCALE]: fm.subtitle || "" },
    client:        { [LOCALE]: fm.client || "" },
    year:          { [LOCALE]: Number(fm.year) || new Date().getFullYear() },
    location:      { [LOCALE]: fm.location || "" },
    category:      { [LOCALE]: fm.category || "" },
    status:        { [LOCALE]: fm.status || "" },
    collaborators: { [LOCALE]: fm.collaborators || "" },
    order:         { [LOCALE]: Number(fm.order) || 0 },
    body:          { [LOCALE]: body },
  };

  // Thumbnail
  const thumbBase = fm.thumbnail ? path.basename(fm.thumbnail) : null;
  if (thumbBase && assets[thumbBase]) {
    fields.thumbnail = {
      [LOCALE]: { sys: { type: "Link", linkType: "Asset", id: assets[thumbBase].id } },
    };
  }

  // Hero image
  const heroBase = fm.heroImage ? path.basename(fm.heroImage) : null;
  if (heroBase && assets[heroBase]) {
    fields.heroImage = {
      [LOCALE]: { sys: { type: "Link", linkType: "Asset", id: assets[heroBase].id } },
    };
  }

  // bodyMedia
  const bodyMediaLinks = getBodyMediaLinks(body, assets);
  if (bodyMediaLinks.length) {
    fields.bodyMedia = { [LOCALE]: bodyMediaLinks };
  }

  await upsertEntry(env, "caseStudy", fm.slug, fields);
}

function getBodyMediaLinks(body, assets) {
  const ids = new Set();
  for (const m of body.matchAll(/\{\{(?:media|video):([^}]+)\}\}/g)) {
    const filename = m[1];
    if (assets[filename]) ids.add(assets[filename].id);
  }
  return [...ids].map((id) => ({ sys: { type: "Link", linkType: "Asset", id } }));
}

async function upsertEntry(env, contentType, id, fields) {
  try {
    const existing = await env.getEntry(id);
    existing.fields = { ...existing.fields, ...fields };
    const updated = await existing.update();
    await updated.publish();
    console.log(`  ✓  Updated existing entry: ${id}`);
  } catch (e) {
    if (e.status === 404) {
      const entry = await env.createEntryWithId(contentType, id, { fields });
      await entry.publish();
      console.log(`  ✓  Created new entry: ${id}`);
    } else {
      throw e;
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Run ───────────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error("\n❌ Error:", err.message || err);
  process.exit(1);
});
```

**Step 1: Verify the script runs without error on a dry path**

```bash
node --env-file=.env.local scripts/publish.mjs
```

Expected output:
```
Usage: node --env-file=.env.local scripts/publish.mjs "path/to/note.md"
```
(exits cleanly — this confirms the env loading and imports work)

**Step 2: Commit**

```bash
git add scripts/publish.mjs
git commit -m "feat: add Obsidian-to-Contentful publish script with image optimization"
```

---

## Task 6: Add `publish-note` script to package.json

**Files:**
- Modify: `package.json`

**Step 1: Add the script to the `"scripts"` section**

Find:
```json
"scripts": {
  "dev": "next dev --webpack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
},
```

Replace with:
```json
"scripts": {
  "dev": "next dev --webpack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "publish-note": "node --env-file=.env.local scripts/publish.mjs"
},
```

Usage after this:
```bash
npm run publish-note "C:/Users/asus/Obsidian/Articles/My Article/note.md"
```

**Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add publish-note script to package.json"
```

---

## Task 7: Add `CONTENTFUL_MANAGEMENT_TOKEN` to `.env.local`

**Step 1: Get the token**

1. Go to [app.contentful.com](https://app.contentful.com)
2. Click your avatar (top right) → **Account Settings**
3. Go to **Tokens** tab → **Personal access tokens**
4. Create a new token, copy it

**Step 2: Add to `.env.local`**

Open `.env.local` and add one line:
```
CONTENTFUL_MANAGEMENT_TOKEN=your_personal_access_token_here
```

**Step 3: Add to Vercel (not needed for the script itself — the script runs locally — but good practice)**

Skip. The Management token is only needed locally for publishing. Vercel only needs the Delivery token.

---

## Task 8: Write the Obsidian Writing Guide

**Files:**
- Create: `OBSIDIAN_WRITING_GUIDE.md`

```markdown
# Guide de Rédaction Obsidian → WWWorkflows

Ce guide décrit exactement comment écrire un article ou un projet dans Obsidian pour qu'il soit publié sur le site avec une seule commande.

---

## Structure de dossier attendue

Chaque note doit être dans son propre dossier avec un sous-dossier `attachments/` :

```
Articles/
  Mon Article/
    note.md              ← ton fichier Obsidian
    attachments/
      hero.jpg           ← images, GIFs, vidéos
      diagram.gif
      process.mp4
```

> **Important :** Pas d'espaces dans les noms de fichiers des images.
> Utiliser des tirets : `facade-diagram.png` et non `facade diagram.png`.

---

## Frontmatter — Article

Copie ce bloc en haut de chaque article et remplis les champs :

```yaml
---
type: article
title: "Titre de l'article"
slug: titre-de-larticle
date: 2026-02-24
excerpt: "Une ou deux phrases qui résument l'article. Ce texte apparaît dans la liste des articles et dans les previews LinkedIn/WhatsApp."
category: Insights
thumbnail: attachments/hero.jpg
order: 1
---
```

### Champs requis
| Champ | Description |
|-------|-------------|
| `type` | Toujours `article` |
| `title` | Titre complet |
| `slug` | URL de la page — minuscules, tirets, sans accents (`mon-article`) |
| `date` | Format `YYYY-MM-DD` |
| `excerpt` | Résumé court (1–2 phrases, 100–160 caractères idéal) |
| `thumbnail` | Chemin vers l'image de couverture dans `attachments/` |

### Champs optionnels
| Champ | Description |
|-------|-------------|
| `category` | Catégorie libre (`Insights`, `Méthodes`, `Projets`, etc.) |
| `order` | Ordre d'affichage (1 = premier) |

---

## Frontmatter — Projet (Case Study)

```yaml
---
type: project
title: "Nom du Projet"
slug: nom-du-projet
subtitle: "Une phrase qui décrit le projet"
client: "Nom du Client"
year: 2024
location: "Casablanca, Maroc"
category: facade-design
status: "Livré"
collaborators: "Collaborateur A, Collaborateur B"
order: 1
thumbnail: attachments/thumbnail.jpg
heroImage: attachments/hero-full.jpg
---
```

### Valeurs de `category`
| Valeur | Label affiché |
|--------|---------------|
| `facade-design` | Design de Façade |
| `algorithmic-systems` | Systèmes Algorithmiques |
| `fabrication-planning` | Planification de Fabrication |
| `landscape-urban` | Paysage & Urbanisme |
| `interior` | Intérieur |

---

## Embeds dans le corps de l'article

### Image standard
Utilise les wiki-links Obsidian ou le markdown standard :

```markdown
![[nom-image.jpg]]
```
ou
```markdown
![](./attachments/nom-image.jpg)
```

→ Affiché en pleine largeur sur le site.

### GIF animé
```markdown
![[animation.gif]]
```
→ Le script le convertit en WebP animé (même animation, taille réduite de 40–70%).

### Vidéo MP4
```markdown
![[process-timelapse.mp4]]
```
→ Affiché avec un lecteur vidéo natif (play/pause, plein écran).

### YouTube
Colle simplement l'URL sur sa propre ligne, sans rien d'autre :

```markdown
https://youtu.be/dQw4w9WgXcQ
```
ou
```markdown
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
→ Intégré en iframe 16:9.

---

## Mise en forme du texte (Markdown standard)

```markdown
## Titre de section

### Sous-titre

Paragraphe normal avec du **texte en gras** et de l'*italique*.

- Élément de liste
- Autre élément

> Citation ou note importante

---

| Colonne A | Colonne B |
|-----------|-----------|
| Valeur 1  | Valeur 2  |
```

---

## Conventions de nommage des fichiers

| À faire | À éviter |
|---------|----------|
| `facade-diagram.png` | `facade diagram.png` |
| `hero-image.jpg` | `HeroImage.jpg` |
| `process-v2.gif` | `process (v2).gif` |
| `mon-article` (slug) | `Mon Article` (slug) |

---

## Checklist avant de publier

- [ ] Le frontmatter est complet (tous les champs requis remplis)
- [ ] Le `slug` est unique, en minuscules, sans espaces ni accents
- [ ] La `thumbnail` existe dans `attachments/`
- [ ] Tous les noms de fichiers dans `attachments/` sont sans espaces
- [ ] `CONTENTFUL_MANAGEMENT_TOKEN` est dans `.env.local`

## Commande de publication

```bash
npm run publish-note "C:/chemin/vers/Obsidian/Articles/Mon Article/note.md"
```

L'article sera en ligne en moins de 60 secondes.

---

## Optimisations automatiques

Le script s'occupe automatiquement de tout cela :

| Format source | Résultat |
|---------------|----------|
| `.jpg` / `.png` | WebP, max 1200px (corps) ou 2400px (hero/thumbnail) |
| `.gif` | WebP animé (même animation, −40 à −70% de taille) |
| `.mp4` | Passé tel quel |
| Lien YouTube | Embed iframe 16:9 |
```

**Step 2: Commit**

```bash
git add OBSIDIAN_WRITING_GUIDE.md
git commit -m "docs: add Obsidian writing guide for articles and projects"
```

---

## Task 9: End-to-end test with a real note

**Step 1: Create a test note** (in your Obsidian vault or anywhere)

Create a folder `Test Article/` with:

`note.md`:
```yaml
---
type: article
title: "Test Publication Pipeline"
slug: test-pipeline
date: 2026-02-24
excerpt: "Test de la pipeline de publication Obsidian → Contentful."
category: Test
thumbnail: attachments/test-image.jpg
order: 99
---

## Introduction

Ceci est un test.

![[test-image.jpg]]

https://youtu.be/dQw4w9WgXcQ

Fin du test.
```

Add any `.jpg` image as `attachments/test-image.jpg`.

**Step 2: Run the script**

```bash
npm run publish-note "C:/path/to/Test Article/note.md"
```

Expected output:
```
📄 Reading: C:/path/to/Test Article/note.md
🔗 Connecting to Contentful...
🖼  Found 1 media asset(s)
  → Processing: test-image.jpg
     jpg→WebP: 450KB → 95KB
  → Uploading to Contentful...
     Processing....
  ✓  Uploaded: test-image.jpg (id: ...)
📝 Publishing article: "Test Publication Pipeline"
  ✓  Created new entry: test-pipeline
✅ Done! Live in ~60s at https://wwworkflows.com/article/test-pipeline
```

**Step 3: Verify in Contentful**

Open app.contentful.com → Content → check that the `test-pipeline` article appears with the image linked.

**Step 4: Wait 60s and check the live site**

Visit `https://wwworkflows.com/article/test-pipeline` — the article should appear.

**Step 5: Clean up the test entry**

Delete `test-pipeline` from Contentful (it was just a test).

---

## Task 10: Deploy SEO changes to production

**Step 1: Push all commits**

```bash
git push origin main
```

Vercel auto-deploys on push. Wait ~30s for the build.

**Step 2: Verify OG tags on a live project page**

Visit: `https://www.opengraph.xyz/url/https%3A%2F%2Fwwworkflows.com%2Fproject%2Fyour-slug`

Expected: preview card shows project title, subtitle, and hero image.

**Step 3: Update progress.md**

Mark all completed items in `progress.md`.

---

## Summary of files changed

| File | Action |
|------|--------|
| `src/app/layout.tsx` | Add `metadataBase` + title template |
| `src/app/project/[slug]/page.tsx` | Add `generateMetadata()` |
| `src/app/article/[slug]/page.tsx` | Add `generateMetadata()` |
| `package.json` | Add `gray-matter` dep + `publish-note` script |
| `scripts/publish.mjs` | New — full Obsidian→Contentful pipeline |
| `OBSIDIAN_WRITING_GUIDE.md` | New — writing guidelines |
