# WWWorkflows Portfolio

Portfolio / case study site for **WWWorkflows** — Computational Design Studio.

Built with Next.js 16, Tailwind CSS 4 and TypeScript. Content lives in this repository (no CMS since 26.10.26).
Visual direction inspired by [vorhammer.net](https://vorhammer.net/).

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Framework   | Next.js 16 (App Router, static) |
| Styling     | Tailwind CSS 4       |
| Content     | Markdown notes + images in `public/cas-etudes/`, JSON in `src/content/` |
| Language    | TypeScript           |
| Hosting     | Vercel               |
| Analytics   | Vercel Analytics + Speed Insights |
| Font        | Inter (Google Fonts)  |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                # Root layout — Header, Footer, Analytics, metadataBase
│   ├── page.tsx                  # Homepage — hero + project grid
│   ├── globals.css               # Global styles
│   ├── about/page.tsx            # Studio — philosophy, founder, services, clients, tools
│   ├── contact/page.tsx          # Contact — email, phone, LinkedIn, Instagram
│   ├── articles/page.tsx         # Articles list
│   ├── article/[slug]/page.tsx   # Article detail — SEO + OG metadata
│   └── project/[slug]/
│       └── page.tsx              # Case study detail — SEO + OG metadata
├── components/
│   ├── Header.tsx                # Fixed nav — Projets / Studio / Articles / Contact
│   ├── Footer.tsx                # Minimal footer
│   ├── ProjectGrid.tsx           # Filterable project grid (client component)
│   ├── ProjectCard.tsx           # Card with hover zoom
│   ├── CategoryFilter.tsx        # Category filter buttons
│   └── RichBody.tsx              # Rich content renderer (Markdown + media embeds)
├── lib/
│   ├── types.ts                  # Project, Article, AboutPage interfaces
│   ├── contenu.ts                # getProjects / getProjectBySlug / getAboutPage
│   ├── cas-etudes.ts             # Reads public/cas-etudes/<slug>/note.md (+ local previews)
│   └── articles.ts               # Articles from src/content/articles.json
└── content/
    ├── articles.json             # Articles
    └── studio.json               # Studio page (intro, services, tools)

public/
├── cas-etudes/<slug>/            # One folder per published case study: note.md + WebP images
└── apercu/<slug>/                # Local previews, gitignored, dev only

scripts/
└── publier-cas.mjs               # public/apercu/<slug> → public/cas-etudes/<slug> (WebP)

docs/
└── plans/                        # Design docs and implementation plans
```

## Design System

- **Background:** `#F1F1F1` (light warm gray)
- **Text:** `text-neutral-900` (primary), `text-neutral-500` (secondary), `text-neutral-400` (muted)
- **Borders:** `border-black/10` (subtle), `border-black/5` (header/footer)
- **Max width:** `1400px` with `px-6 md:px-12` padding
- **Typography:** Inter, uppercase labels with `tracking-[0.12em]`
- **Hover:** `opacity-60` transitions, `scale-105` on cards, underline slide-in on nav

## Language

The site is **French-only** (`lang="fr"`). All static copy, labels, and CMS content are in French. Browser-level auto-translation (Chrome) handles visitors who need English.

## Getting Started

```bash
npm install
npm run dev       # dev server
npm run build     # production build
npm start         # production server
```

## Content (no CMS)

Contentful was dropped on 26.10.26 (full backup in `06_SITE-WEB/_CONTENTFUL_SAUVEGARDE_261026/`, outside the repo).

- **Case study** = `public/cas-etudes/<slug>/note.md` (frontmatter: title, subtitle, client, year, location, category, status, collaborators, order, thumbnail, heroImage) + its images. The URL is `/project/<slug>`.
- **Preview** a new case study in `public/apercu/<slug>/` (gitignored, shown by `npm run dev` only), then publish it locally:

```bash
npm run publier-cas -- <slug>
```

It converts images to WebP (GIF → animated WebP), rewrites the note, and moves it to `public/cas-etudes/<slug>/`. Nothing goes online before `git push` to `main` (Vercel deploys it). The repository is **public**: no drafts, nothing awaiting client approval, no keys.

## Rich Media in Body Content

The body field supports special embed syntax (handled automatically by the publish script):

```markdown
{{media:facade-diagram.jpg}}    — image from Body Media assets
{{media:animation.gif}}         — animated image
{{youtube:dQw4w9WgXcQ}}        — YouTube embed
{{video:process-timelapse.mp4}} — video player
```

In Obsidian, just use native syntax:
```markdown
![[image.jpg]]                          → becomes {{media:image.jpg}}
![[animation.gif]]                      → becomes {{media:animation.gif}}
![[video.mp4]]                          → becomes {{video:video.mp4}}
https://youtu.be/dQw4w9WgXcQ           → becomes {{youtube:dQw4w9WgXcQ}}
```

## SEO & Open Graph

Every project and article page has:
- Custom `<title>` — `"{Project Title} — WWWorkflows"`
- `<meta description>` — subtitle or excerpt
- `og:image` — hero image (shows when link shared on LinkedIn, WhatsApp, Twitter)
- `og:title`, `og:description`, `og:url`
- `twitter:card: summary_large_image`

## Image Guidelines

| Usage          | Format  | Max Width | Notes                        |
|----------------|---------|-----------|------------------------------|
| Hero / Thumbnail | WebP  | 2400px    | Auto-handled by publish script |
| Body images    | WebP    | 1200px    | Auto-handled by publish script |
| Body GIFs      | WebP animated | 1200px | Auto-converted from GIF   |
| Body Videos    | MP4     | 1920px    | Passed through unchanged     |

## Deployment

Deployed on Vercel at **wwworkflows.com** (and www.wwworkflows.com → redirects to apex). Set `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` in Vercel environment variables. The `CONTENTFUL_MANAGEMENT_TOKEN` is only needed locally (for the publish script).

ISR revalidation is **60 seconds** on all pages — content updates in Contentful appear within 1 minute without a redeploy.

## License

Private project. All rights reserved.
