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

import contentfulManagement from "contentful-management";
const { createClient } = contentfulManagement;
import matter from "gray-matter";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────────

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const LOCALE = "en-US"; // Change if your Contentful space uses a different locale
const ENV_ID = "master";

const MAX_BODY_PX = 1200;  // max width for in-body images
const MAX_HERO_PX = 2400;  // max width for hero / thumbnail images

// ─── Main ──────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const notePath = args.find((a) => !a.startsWith("--"));
  const fullOverwrite = args.includes("--full");

  if (!notePath) {
    console.error(
      "\nUsage: node --env-file=.env.local scripts/publish.mjs \"path/to/note.md\" [--full]\n" +
      "\n  Default: only updates body + bodyMedia (safe — preserves Contentful edits)" +
      "\n  --full:  overwrites all fields from Obsidian frontmatter\n"
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
    console.error(`
File not found: ${absPath}
`);
    process.exit(1);
  }

  const noteDir = path.dirname(absPath);
  const attachmentsDir = path.join(noteDir, "attachments");

  console.log(`
📄 Reading: ${absPath}`);

  // 1. Parse frontmatter + body
  const raw = fs.readFileSync(absPath, "utf-8");
  const { data: fm, content: rawBody } = matter(raw);

  validateFrontmatter(fm);

  // 2. Connect to Contentful
  console.log(`
🔗 Connecting to Contentful...`);
  const client = createClient({ accessToken: MANAGEMENT_TOKEN });
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENV_ID);

  // 3. Collect all local media references
  const mediaRefs = collectMediaRefs(rawBody, fm, attachmentsDir);
  console.log(`
🖼️  Found ${mediaRefs.length} media asset(s)`);

  // 4. Optimize + upload each asset
  const uploadedAssets = {}; // originalFilename → { id }
  const tmpFiles = [];

  for (const ref of mediaRefs) {
    const localPath = path.join(attachmentsDir, ref.filename);
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️  Not found: ${ref.filename} — skipping`);
      continue;
    }

    console.log(`
  → Processing: ${ref.filename}`);
    const { optimizedPath, mimeType } = await optimizeAsset(
      localPath,
      ref.filename,
      ref.maxWidth
    );
    if (optimizedPath !== localPath) tmpFiles.push(optimizedPath);

    console.log(`  → Uploading to Contentful...`);
    const asset = await uploadAsset(env, optimizedPath, ref.filename, mimeType);
    const rawUrl = asset.fields?.file?.[LOCALE]?.url;
    uploadedAssets[ref.filename] = {
      id: asset.sys.id,
      url: rawUrl ? `https:${rawUrl}` : null,
    };
    console.log(`  ✓  Uploaded: ${ref.filename} (id: ${asset.sys.id})`);
  }

  // 5. Transform body (Obsidian syntax → site syntax)
  // Articles: images become inline markdown URLs (no bodyMedia field needed)
  // Projects: images become {{media:}} syntax backed by bodyMedia assets
  const transformedBody = fm.type === "article"
    ? transformBodyArticle(rawBody, uploadedAssets)
    : transformBody(rawBody);

  // 6. Upsert Contentful entry
  console.log(`
📝 Publishing ${fm.type}: "${fm.title}"`);
  if (fm.type === "article") {
    await upsertArticle(env, fm, transformedBody, uploadedAssets, fullOverwrite);
  } else {
    await upsertProject(env, fm, transformedBody, uploadedAssets, fullOverwrite);
  }

  // 7. Cleanup temp files
  for (const f of tmpFiles) {
    try {
      fs.unlinkSync(f);
    } catch {}
  }

  const pageType = fm.type === "article" ? "article" : "project";
  console.log(
    `
✅ Done! Live in ~60s at https://wwworkflows.com/${pageType}/${fm.slug}
`
  );
}

// ─── Validation ──────────────────────────────────────────────────────────────────

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

// ─── Asset optimization ──────────────────────────────────────────────────────────

async function optimizeAsset(inputPath, filename, maxWidth) {
  const ext = path.extname(filename).toLowerCase();

  // Videos: pass through unchanged
  if ([".mp4", ".mov", ".webm", ".avi"].includes(ext)) {
    return { optimizedPath: inputPath, mimeType: "video/mp4" };
  }

  // GIF → animated WebP (better compression, same animation)
  if (ext === ".gif") {
    const outPath = inputPath.replace(/\.gif$/i, "-optimized.webp");
    await sharp(inputPath, { animated: true, limitInputPixels: false })
      .resize({ width: maxWidth, withoutEnlargement: true })
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

// ─── Contentful asset upload ─────────────────────────────────────────────────────────

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

// ─── Body transformation ──────────────────────────────────────────────────────────

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

// Article variant: replaces {{media:filename}} with inline markdown image URLs
// (articles don't have a bodyMedia field in Contentful)
function transformBodyArticle(body, assets) {
  let result = transformBody(body);

  // Replace {{media:filename}} → ![filename](https://cdn-url)
  result = result.replace(/\{\{media:([^}]+)\}\}/g, (match, filename) => {
    const asset = assets[filename];
    if (asset?.url) return `![${filename}](${asset.url})`;
    return match;
  });

  return result;
}

// ─── Contentful entry upsert ──────────────────────────────────────────────────────────

async function upsertArticle(env, fm, body, assets, fullOverwrite = false) {
  const fields = {
    title:    { [LOCALE]: fm.title },
    slug:     { [LOCALE]: fm.slug },
    excerpt:  { [LOCALE]: fm.excerpt || "" },
    body:     { [LOCALE]: body },
    category: { [LOCALE]: fm.category || "" },
    date:     { [LOCALE]: fm.date instanceof Date ? fm.date.toISOString().split("T")[0] : String(fm.date) },
    order:    { [LOCALE]: Number(fm.order) || 0 },
  };

  // Thumbnail link
  const thumbBase = fm.thumbnail ? path.basename(fm.thumbnail) : null;
  if (thumbBase && assets[thumbBase]) {
    fields.thumbnail = {
      [LOCALE]: { sys: { type: "Link", linkType: "Asset", id: assets[thumbBase].id } },
    };
  }

  // Note: articles use inline markdown image URLs instead of bodyMedia
  // (the article content type does not have a bodyMedia field)

  // On safe update: only body is synced from Obsidian; everything else preserves Contentful edits.
  // On --full: overwrite all fields.
  const preserve = fullOverwrite
    ? new Set()
    : new Set(["title", "slug", "excerpt", "category", "date", "order", "thumbnail"]);
  await upsertEntry(env, "article", fm.slug, fields, preserve);
}

async function upsertProject(env, fm, body, assets, fullOverwrite = false) {
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

  // On safe update: only body + bodyMedia are synced from Obsidian; everything else preserves Contentful edits.
  // On --full: overwrite all fields.
  const preserve = fullOverwrite
    ? new Set()
    : new Set(["title", "slug", "subtitle", "client", "year", "location", "category", "status", "collaborators", "order", "heroImage", "thumbnail", "projectImages"]);
  await upsertEntry(env, "caseStudy", fm.slug, fields, preserve);
}

function getBodyMediaLinks(body, assets) {
  const ids = new Set();
  for (const m of body.matchAll(/\{\{(?:media|video):([^}]+)\}\}/g)) {
    const filename = m[1];
    if (assets[filename]) ids.add(assets[filename].id);
  }
  return [...ids].map((id) => ({ sys: { type: "Link", linkType: "Asset", id } }));
}

async function upsertEntry(env, contentType, id, fields, preserveOnUpdate = new Set()) {
  // Try to fetch the existing entry first; any error means it doesn't exist yet
  let existing = null;
  try {
    existing = await env.getEntry(id);
  } catch (_) {
    // Entry not found — will create below
  }

  if (existing) {
    const mode = preserveOnUpdate.size === 0 ? "full overwrite" : "body-only update";
    console.log(`  ℹ  Mode: ${mode}`);
    // On safe update: skip any field in preserveOnUpdate that already has a value
    // in Contentful — protects manual edits to text, images, etc.
    const mergedFields = { ...existing.fields };
    for (const [key, value] of Object.entries(fields)) {
      if (preserveOnUpdate.has(key) && existing.fields[key]) {
        continue;
      }
      mergedFields[key] = value;
    }
    existing.fields = mergedFields;
    const updated = await existing.update();
    await updated.publish();
    console.log(`  ✓  Updated existing entry: ${id}`);
  } else {
    const entry = await env.createEntryWithId(contentType, id, { fields });
    await entry.publish();
    console.log(`  ✓  Created new entry: ${id}`);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Run ──────────────────────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error("\n❌ Error:", err.message || err);
  process.exit(1);
});
