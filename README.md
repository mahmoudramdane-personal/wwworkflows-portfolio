# WWWorkflows Portfolio

Portfolio / case study site for **WWWorkflows** — Computational Design Studio.

Built with Next.js 16, Tailwind CSS 4, TypeScript, and Contentful CMS.
Visual direction inspired by [vorhammer.net](https://vorhammer.net/).

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Framework   | Next.js 16 (App Router, SSG) |
| Styling     | Tailwind CSS 4       |
| CMS         | Contentful (Headless) |
| Language    | TypeScript           |
| Hosting     | Vercel               |
| Font        | Inter (Google Fonts)  |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (Header + Footer)
│   ├── page.tsx              # Homepage — hero + project grid
│   ├── globals.css           # Global styles, scrollbar, selection
│   ├── about/page.tsx        # About — services + tools
│   ├── contact/page.tsx      # Contact — email, LinkedIn, Instagram
│   └── project/[slug]/
│       └── page.tsx          # Dynamic case study detail page
├── components/
│   ├── Header.tsx            # Fixed nav — Work / About / Contact + EN/FR
│   ├── Footer.tsx            # Minimal footer
│   ├── ProjectGrid.tsx       # Filterable project grid (client component)
│   ├── ProjectCard.tsx       # Card with hover zoom
│   ├── CategoryFilter.tsx    # Category filter buttons
│   └── RichBody.tsx          # Rich content renderer (Markdown + media embeds)
├── lib/
│   ├── types.ts              # Project interface, Category type, labels
│   └── contentful.ts         # Contentful client + mock data fallback
└── data/
    └── projects.ts           # Mock projects (used when Contentful not configured)
```

## Design System

- **Background:** `#F1F1F1` (light warm gray)
- **Text:** `text-neutral-900` (primary), `text-neutral-500` (secondary), `text-neutral-400` (muted)
- **Borders:** `border-black/10` (subtle), `border-black/5` (header/footer)
- **Max width:** `1400px` with `px-6 md:px-12` padding
- **Typography:** Inter, uppercase labels with `tracking-[0.12em]`
- **Hover:** `opacity-60` transitions, `scale-105` on cards (700ms)

## Getting Started

```bash
npm install
npm run dev       # dev server (uses webpack)
npm run build     # production build
npm start         # production server
```

The site runs with **mock data** by default. To connect Contentful, see below.

## Contentful Setup

### 1. Create a Contentful Space

1. Go to [app.contentful.com](https://app.contentful.com)
2. Create a new **Space** (free tier works)
3. Go to **Settings > API keys**
4. Create a new API key — copy the **Space ID** and **Content Delivery API access token**

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
```

### 3. Create the Content Model

In Contentful, create content type **Case Study** (API ID: `caseStudy`):

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

### 4. Category Values

Use one of: `facade-design`, `algorithmic-systems`, `fabrication-planning`, `landscape-urban`, `interior`

## Rich Media in Body Content

The body field supports special embed syntax:

```markdown
Regular paragraph text.

{{media:facade-animation.gif}}

{{youtube:dQw4w9WgXcQ}}

{{video:process-timelapse.mp4}}
```

- `{{media:filename}}` — GIF/image from Body Media assets
- `{{youtube:VIDEO_ID}}` — YouTube embed
- `{{video:filename}}` — Video from Body Media assets

## Image Guidelines

| Usage      | Format     | Max Width | Aspect Ratio |
|------------|------------|-----------|--------------|
| Thumbnail  | WebP/AVIF  | 1200px    | 3:2          |
| Hero       | WebP/AVIF  | 2400px    | 16:9         |
| Gallery    | WebP/AVIF  | 2000px    | 16:9         |
| Body GIF   | GIF/WebP   | 1200px    | Any          |
| Body Video | MP4 (H.264)| 1920px    | Any          |

## Deployment

Deploy on Vercel. Set `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` in Vercel env vars.

## License

Private project. All rights reserved.
