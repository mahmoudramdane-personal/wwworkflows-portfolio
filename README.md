# WWWorkflows Portfolio

Portfolio / case study site for **WWWorkflows** — Computational Design Studio.

Built with Next.js 16, Tailwind CSS 4, TypeScript, and Contentful CMS.
Visual direction inspired by [vorhammer.net](https://vorhammer.net/).

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Framework   | Next.js 16 (App Router, ISR) |
| Styling     | Tailwind CSS 4       |
| CMS         | Contentful (Headless) |
| Language    | TypeScript           |
| Hosting     | Vercel               |
| Analytics   | Vercel Analytics     |
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
│   ├── types.ts                  # Project, Article, AboutPage, ContactPage interfaces
│   └── contentful.ts             # Contentful client + all fetch functions + fallbacks
└── data/
    └── projects.ts               # Mock projects (fallback when Contentful not configured)

scripts/
└── publish.mjs                   # Obsidian → Contentful publish pipeline

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

The site runs with **mock data** by default. To connect Contentful, see below.

## Contentful Setup

### 1. Create a Contentful Space

1. Go to [app.contentful.com](https://app.contentful.com)
2. Create a new **Space** (free tier works)
3. Go to **Settings > API keys** — create a new API key
4. Copy the **Space ID** and **Content Delivery API access token**

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_MANAGEMENT_TOKEN=your_personal_access_token   # for publish script only
```

Get the Management Token from: Contentful → click your avatar → Account Settings → Tokens → Personal access tokens.

### 3. Content Models

#### Case Study (`caseStudy`)

| Field Name      | Field ID        | Type            | Required |
|-----------------|-----------------|-----------------|----------|
| Title           | `title`         | Short text      | Yes      |
| Slug            | `slug`          | Short text      | Yes      |
| Subtitle        | `subtitle`      | Short text      | Yes      |
| Client          | `client`        | Short text      | Yes      |
| Year            | `year`          | Integer         | Yes      |
| Location        | `location`      | Short text      | Yes      |
| Category        | `category`      | Short text      | Yes      |
| Status          | `status`        | Short text      | Yes      |
| Collaborators   | `collaborators` | Short text      | No       |
| Order           | `order`         | Integer         | No       |
| Thumbnail       | `thumbnail`     | Media (image)   | Yes      |
| Hero Image      | `heroImage`     | Media (image)   | Yes      |
| Body            | `body`          | Long text       | Yes      |
| Project Images  | `projectImages` | Media (many)    | No       |
| Body Media      | `bodyMedia`     | Media (many)    | No       |

Category values: `facade-design`, `algorithmic-systems`, `fabrication-planning`, `landscape-urban`, `interior`

#### Article (`article`)

| Field Name  | Field ID    | Type          | Required |
|-------------|-------------|---------------|----------|
| Title       | `title`     | Short text    | Yes      |
| Slug        | `slug`      | Short text    | Yes      |
| Excerpt     | `excerpt`   | Short text    | Yes      |
| Body        | `body`      | Long text     | Yes      |
| Category    | `category`  | Short text    | No       |
| Date        | `date`      | Date          | Yes      |
| Thumbnail   | `thumbnail` | Media (image) | No       |
| Body Media  | `bodyMedia` | Media (many)  | No       |
| Order       | `order`     | Integer       | No       |

#### About Page (`aboutPage`) and Contact Page (`contactPage`)

Managed via the `getAboutPage()` and `getContactPage()` functions in `src/lib/contentful.ts`. Both have hardcoded fallbacks — Contentful entries are optional.

## Publishing from Obsidian

Write articles and case studies in Obsidian, then publish with one command. See **`OBSIDIAN_WRITING_GUIDE.md`** for the full reference.

**Quick start:**

1. Add `CONTENTFUL_MANAGEMENT_TOKEN` to `.env.local`
2. Write your note with the correct frontmatter (see guide)
3. Run:

```bash
npm run publish-note "C:/path/to/Obsidian/Articles/My Article/note.md"
```

The script automatically:
- Converts JPG/PNG → WebP (resized for web)
- Converts GIFs → animated WebP (−40 to −70% file size)
- Uploads all assets to Contentful
- Transforms Obsidian embed syntax to the site's format
- Creates or updates the Contentful entry
- Content goes live in ~60 seconds via ISR

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

Deployed on Vercel. Set `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` in Vercel environment variables. The `CONTENTFUL_MANAGEMENT_TOKEN` is only needed locally (for the publish script).

ISR revalidation is **60 seconds** on all pages — content updates in Contentful appear within 1 minute without a redeploy.

## License

Private project. All rights reserved.
