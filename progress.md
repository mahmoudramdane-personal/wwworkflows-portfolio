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

### One-time setup still needed
- [ ] Add `CONTENTFUL_MANAGEMENT_TOKEN` to `.env.local` (get from Contentful → Settings → API Keys → Personal Access Tokens) — required to use the publish script

---

## Next Steps

### Priority
- [ ] **Sitemap** — add `src/app/sitemap.ts` so Google discovers all pages automatically
- [ ] **Test the publish pipeline** — write a real article in Obsidian, run `npm run publish-note`, verify it goes live
- [ ] **Upload remaining case studies** to Contentful using the publish script

### Content
- [ ] Write + publish first real article via Obsidian pipeline
- [ ] Add real thumbnail/hero images (replace placeholder SVGs)
- [ ] Add more case studies

### Polish
- [ ] Custom 404 page
- [ ] `loading.tsx` skeleton for project/article pages
- [ ] Verify OG previews on LinkedIn (use https://www.linkedin.com/post-inspector/)
