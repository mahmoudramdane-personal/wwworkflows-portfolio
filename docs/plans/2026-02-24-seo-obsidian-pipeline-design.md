# Design: SEO Metadata + Obsidian → Contentful Pipeline

**Date:** 2026-02-24
**Status:** Approved

---

## Feature 1: SEO + Open Graph Metadata

### Goal
Every project and article page gets its own `<title>`, `<meta description>`, and Open Graph tags so Google indexes them correctly and LinkedIn/WhatsApp link previews show a proper image + title card.

### Implementation
Add `generateMetadata()` to:
- `src/app/project/[slug]/page.tsx`
- `src/app/article/[slug]/page.tsx`

### Output per page
| Tag | Value |
|-----|-------|
| `<title>` | `{title} — WWWorkflows` |
| `<meta name="description">` | `{subtitle}` or `{excerpt}` |
| `og:title` | `{title}` |
| `og:description` | `{subtitle}` or `{excerpt}` |
| `og:image` | `{heroImage}` or `{thumbnail}` |
| `og:url` | `https://wwworkflows.com/{type}/{slug}` |
| `og:type` | `article` |
| `twitter:card` | `summary_large_image` |

### Root layout
Update default metadata in `layout.tsx` with proper `metadataBase: new URL('https://wwworkflows.com')` so relative OG image URLs resolve correctly.

---

## Feature 2: Obsidian → Contentful Publish Pipeline

### Goal
One command publishes an Obsidian `.md` file (with local images, GIFs, videos) to Contentful as a live Article or Case Study.

### Architecture
Single Node.js ESM script: `scripts/publish.mjs`

### Vault Structure Convention
```
Articles/
  My Article/
    article.md          ← the note
    attachments/
      hero.png
      diagram.gif
      process.mp4
```

### Frontmatter Schema

**Article:**
```yaml
---
type: article
title: "Pourquoi le Computational Design change la donne"
slug: computational-design-architecture
date: 2026-02-24
excerpt: "Le Computational Design n'est pas un gadget..."
category: Insights
thumbnail: attachments/hero.png
---
```

**Project (Case Study):**
```yaml
---
type: project
title: "WWW x YDA"
slug: www-x-yda
client: "YDA Group"
year: 2024
location: "Casablanca, Maroc"
category: facade-design
status: "Livré"
collaborators: ""
order: 1
thumbnail: attachments/thumbnail.png
heroImage: attachments/hero-full.png
---
```

### Pipeline Steps

1. **Parse** — read `.md`, extract YAML frontmatter, detect `type: article` or `type: project`
2. **Collect media** — find all local asset references in frontmatter + body
3. **Optimize**
   - JPG/PNG → WebP via `sharp`; max 2400px for heroes/thumbnails, max 1200px for body images
   - GIF → optimized GIF via `gifsicle` (strip metadata, optimize frames); keep animated
   - MP4 → pass through unchanged
4. **Upload assets** — upload each to Contentful via Management API; skip if filename already exists
5. **Transform body** — convert Obsidian embed syntax → site's `{{}}` syntax
6. **Upsert entry** — create or update Article/Project entry in Contentful

### Obsidian Embed → Site Syntax Mapping

| Obsidian syntax | Site syntax |
|-----------------|-------------|
| `![[image.png]]` | `{{media:image.png}}` |
| `![[image.png\|500]]` | `{{media:image.png}}` |
| `![alt](./attachments/image.png)` | `{{media:image.png}}` |
| `![[animation.gif]]` | `{{media:animation.gif}}` |
| `![[video.mp4]]` | `{{video:video.mp4}}` |
| Bare `https://youtu.be/VIDEO_ID` on its own line | `{{youtube:VIDEO_ID}}` |
| Bare `https://www.youtube.com/watch?v=VIDEO_ID` on its own line | `{{youtube:VIDEO_ID}}` |

### Dependencies to add
- `sharp` — image conversion and resizing
- `gifsicle` (via `imagemin-gifsicle`) — GIF optimization
- `gray-matter` — YAML frontmatter parsing
- `contentful-management` — Contentful Management API client

### Environment variable to add
```
CONTENTFUL_MANAGEMENT_TOKEN=your_personal_access_token
```
(From Contentful → Settings → API Keys → Personal Access Tokens)

### Usage
```bash
node scripts/publish.mjs "C:/path/to/Obsidian/Articles/My Article/article.md"
```

Or add to `package.json` scripts:
```json
"publish-note": "node scripts/publish.mjs"
```
Then: `npm run publish-note "path/to/article.md"`

---

## Feature 3: Obsidian Writing Guidelines

A `OBSIDIAN_WRITING_GUIDE.md` file (in the project root) with:
- Exact frontmatter templates for articles and projects
- How to embed each media type in Obsidian
- File naming conventions
- Checklist before running publish

---

## Files Changed

| File | Action |
|------|--------|
| `src/app/project/[slug]/page.tsx` | Add `generateMetadata()` |
| `src/app/article/[slug]/page.tsx` | Add `generateMetadata()` |
| `src/app/layout.tsx` | Add `metadataBase` |
| `scripts/publish.mjs` | New — full pipeline |
| `OBSIDIAN_WRITING_GUIDE.md` | New — guidelines doc |
| `package.json` | Add deps + `publish-note` script |
