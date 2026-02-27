# Progress Tracker — WWWorkflows Portfolio

## Session 1 (2026-02-23)

### Completed
- [x] Project scaffolded with Next.js 16 + TypeScript + Tailwind CSS 4
- [x] Contentful SDK installed (`contentful ^11.10.4`)
- [x] Core pages: Home, About, Contact, Project/[slug]
- [x] Components: Header, Footer, ProjectGrid, ProjectCard, CategoryFilter
- [x] Contentful client with mock data fallback (`src/lib/contentful.ts`)
- [x] 5 mock projects with SVG placeholders
- [x] Light theme applied (#F1F1F1 background)
- [x] Category filtering (client-side)
- [x] SSG with `generateStaticParams` for project pages
- [x] Production build passing (11 static pages)
- [x] Turbopack workaround: `--webpack` flag for dev

### Known Issues
- Turbopack crashes on `next dev` without `--webpack` flag (Next.js 16 bug)

---

## Session 2 (2026-02-23)

### Completed
- [x] README.md created with full project docs
- [x] progress.md created for session tracking
- [x] Contentful content model documented (caseStudy type)
- [x] Rich media syntax designed: `{{media:}}`, `{{youtube:}}`, `{{video:}}`
- [x] Project types updated for rich media support
- [x] RichBody renderer component created
- [x] Project detail page updated to render rich content
- [x] Image guidelines documented

---

## Session 3 (2026-02-23)

### Completed
- [x] Contentful API connected — `CONTENTFUL_SPACE_ID` + `CONTENTFUL_ACCESS_TOKEN` set locally and on Vercel
- [x] First case study (WWW x YDA) uploaded to Contentful
- [x] Vercel deployed — production at `wwworkflows.com`, multiple Ready deployments
- [x] Vercel Analytics integrated (`@vercel/analytics/next`)
- [x] ISR enabled on all pages (`export const revalidate = 60`)
- [x] Articles section added — `/articles` list page + `/article/[slug]` detail page
- [x] `getArticles` + `getArticleBySlug` added to `contentful.ts` (content type: `article`)
- [x] About page enriched — philosophy, founder, clients & collaborators, tools sections
- [x] Contact page enriched — email, phone, LinkedIn, Instagram, footer note
- [x] `getAboutPage` + `getContactPage` added to `contentful.ts` (content types: `aboutPage`, `contactPage`)
- [x] Nav updated to French labels: Projets / Studio / Articles / Contact
- [x] EN/FR language toggle removed — site is French-only (`lang="fr"`)
- [x] Nav hover animations added (underline slide-in)
- [x] Favicon fixed (square) + tab title updated

### Decision — Language
EN/FR toggle was dropped in favour of French-only. All static copy and CMS content is in French. Browser-level auto-translation (Chrome) handles visitors who need English. If bilingual becomes a requirement later, Next.js i18n routing is the path.

---

## Session 4 (2026-02-24)

### Completed
- [x] **SEO metadata** — `generateMetadata()` added to `project/[slug]/page.tsx` and `article/[slug]/page.tsx`
- [x] **Open Graph tags** — `og:title`, `og:description`, `og:image`, `og:url`, `og:type` per page; link previews now work on LinkedIn/WhatsApp/Twitter
- [x] **Twitter card** — `summary_large_image` on all content pages
- [x] **`metadataBase`** — set to `https://wwworkflows.com` in root layout so OG image URLs resolve correctly
- [x] **Title template** — `%s — WWWorkflows` applied globally via root layout; individual pages just return `title: project.title`
- [x] **Obsidian → Contentful publish pipeline** — `scripts/publish.mjs` (Node ESM, one command)
  - Parses YAML frontmatter (`type: article` or `type: project`)
  - Collects all local media refs from frontmatter + body
  - Optimizes images with `sharp`: JPG/PNG → WebP (max 1200px body / 2400px hero), GIF → animated WebP
  - Uploads assets to Contentful via Management API (skips duplicates)
  - Transforms Obsidian embed syntax → site's `{{media:}}` / `{{youtube:}}` / `{{video:}}` syntax
  - Creates or updates Article/Project entry, publishes immediately
  - Content live in ~60s via ISR
- [x] **`gray-matter`** installed for frontmatter parsing
- [x] **`publish-note` npm script** added — `npm run publish-note "path/to/note.md"`
- [x] **`OBSIDIAN_WRITING_GUIDE.md`** created — complete French-language guide covering frontmatter schemas, embed syntax, naming conventions, checklist, publish command
- [x] **Design docs** saved to `docs/plans/` — design doc + implementation plan

### Commits this session
| Hash | Description |
|------|-------------|
| `1c77233` | feat: add SEO and Open Graph metadata to all pages |
| `08ca1e9` | chore: add gray-matter for frontmatter parsing |
| `71982aa` | feat: add Obsidian-to-Contentful publish script with image optimization |
| `5606cb6` | chore: add publish-note script to package.json |
| `6ae5bb0` | docs: add Obsidian writing guide for articles and projects |

### Bugs found and fixed during testing
- `contentful-management` named ESM import fails on Node 24 → switched to default import + destructure
- 404 status check didn't match SDK v11 error shape → restructured `upsertEntry` to try/catch without status code
- `article` content type has no `bodyMedia` field → articles now use inline markdown URLs `![](cdn-url)` instead
- `gray-matter` parses `date: YYYY-MM-DD` as a JS Date object → fixed with `.toISOString().split("T")[0]`
- Inline article images had no styling → added `img` renderer to `RichBody.tsx`
- Stray `nul` Windows device file in repo root → added to `.gitignore`

### Pipeline status: ✅ Fully working
End-to-end test passed: image optimized (25KB → 8KB, -67%), uploaded to Contentful, article created and live.

---

---

## Session 5 (2026-02-26)

### Completed
- [x] **Vercel Speed Insights** added (`@vercel/speed-insights/next`) — tracks real-user Core Web Vitals (LCP, INP, CLS, TTFB) visible in Vercel dashboard
- [x] **Custom domain configured** — `wwworkflows.com` and `www.wwworkflows.com` DNS records added at registrar, both pointing to Vercel
- [x] SSL certificate auto-provisioned by Vercel
- [x] Test article deleted from Contentful ("Test Pipeline — À Supprimer")

### Pending (DNS propagation)
- [ ] Confirm `www.wwworkflows.com` resolves (can take up to a few hours after DNS change)

---

## Session 6 (2026-02-26)

### Completed
- [x] **First real case study published** — WWWorkflows × YDA — Tours Casablanca
  - Slug: `wwworkflows-yda-tours-casablanca`
  - 23 assets uploaded (5 GIFs + 18 PNGs), all optimized to WebP
  - Compression: up to −98% on PNGs, −90% on hero GIF (49MB → 5MB)
  - Live at `https://wwworkflows.com/project/wwworkflows-yda-tours-casablanca`
- [x] **GIF pixel limit bug fixed** — added `limitInputPixels: false` + resize to GIF→WebP conversion in `scripts/publish.mjs`
- [x] **Obsidian vault organized** — `TEST VAULT/Projects/wwworkflows-yda-tours-casablanca/` with `note.md` + `attachments/` (23 files, no spaces)
- [x] **Case study body rewritten** — narrative structure (Étape 1→7) with closing "Ce que cette mission démontre"
- [x] **Typography overhaul** (`RichBody.tsx`) — body 15px / leading-[1.75], H2 text-lg semibold, H3 text-[15px] semibold, removed tracking-wide on prose, tightened all spacing
- [x] **Hero image made optional** — page hides the section if `heroImage` is empty in Contentful; `heroImage` field set to non-required in Contentful content model
- [x] **Homepage hero text updated** — "Computational Design" → "Workflows", "as a Service" → "Design Paramétrique et Computationnel"

### Folder structure created in Obsidian
```
TEST VAULT/Projects/wwworkflows-yda-tours-casablanca/
  note.md              ← frontmatter + body, all refs updated
  attachments/         ← 23 files, all renamed (no spaces)
```

### Bugs fixed
- `scripts/publish.mjs`: large GIFs crash sharp with "pixel limit exceeded" → fixed with `limitInputPixels: false` + resize on GIF branch

---

## Next Steps

### Priority
- [ ] **Sitemap** — add `src/app/sitemap.ts` so Google discovers all pages automatically
- [ ] **Submit to Google Search Console** — verify domain and submit sitemap
- [ ] **Verify OG previews** on LinkedIn (use https://www.linkedin.com/post-inspector/)

### Content
- [ ] Write + publish first real article via Obsidian pipeline
- [ ] Add more case studies via publish pipeline
- [ ] Replace placeholder images with real ones

### Polish
- [ ] Custom 404 page
- [ ] `loading.tsx` skeleton for project/article pages
