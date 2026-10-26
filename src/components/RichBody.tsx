import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MediaAsset } from "@/lib/types";
import AnimatedMedia from "./AnimatedMedia";
import Eclate from "./Eclate";
import Construction from "./Construction";
import Familles from "./Familles";
import LamesH2A from "./LamesH2A";
import { idTitre } from "@/lib/titres";

// Texte brut d'un enfant React (pour l'ancre d'un intertitre)
function texteDe(n: React.ReactNode): string {
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(texteDe).join("");
  if (n && typeof n === "object" && "props" in n) return texteDe((n as { props: { children?: React.ReactNode } }).props.children);
  return "";
}

interface RichBodyProps {
  body: string;
  bodyMedia: MediaAsset[];
}

/**
 * Renders body text with markdown formatting and rich media embeds.
 *
 * Supported syntax in body markdown:
 *   {{media:filename.gif}}   — image/GIF from bodyMedia assets
 *   {{youtube:VIDEO_ID}}     — YouTube iframe embed
 *   {{video:filename.mp4}}   — video player from bodyMedia assets
 *
 * Markdown: ## headers, **bold**, *italic*, tables, lists, ---, > blockquotes
 */
export default function RichBody({ body, bodyMedia }: RichBodyProps) {
  // Split body into segments: media embeds vs markdown content
  const segments = splitMediaSegments(body);

  return (
    <div>
      {segments.map((segment, i) => {
        if (segment.type === "media") return renderMedia(segment.value, bodyMedia, i);
        if (segment.type === "youtube") return renderYouTube(segment.value, i);
        if (segment.type === "video") return renderVideo(segment.value, bodyMedia, i);
        if (segment.type === "miro") return renderMiro(segment.value, i);
        if (segment.type === "eclate") return renderEclate(segment.value, bodyMedia, i);
        if (segment.type === "construction") return renderConstruction(segment.value, bodyMedia, i);
        if (segment.type === "familles") return renderFamilles(segment.value, bodyMedia, i);
        if (segment.type === "module") return renderModule(segment.value, i);

        // Markdown content
        return (
          <div key={i} className="max-w-[680px]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="titre-large text-3xl md:text-4xl leading-tight mt-14 mb-5">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 id={idTitre(texteDe(children))} className="titre-large text-2xl md:text-[2rem] leading-[1.12] mt-14 mb-5">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold mt-8 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-encre/85 text-[1.08rem] md:text-[1.125rem] leading-[1.75] mb-5">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-encre">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-1.5 text-encre/85 text-[1.08rem] md:text-[1.125rem] leading-[1.75] mb-5">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 space-y-1.5 text-encre/85 text-[1.08rem] md:text-[1.125rem] leading-[1.75] mb-5">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-encre/85 text-[1.08rem] md:text-[1.125rem] leading-[1.75]">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-bleu bg-bleu-pale/60 pl-6 pr-4 py-3 text-encre/80 text-[1.05rem] leading-[1.7]">
                    {children}
                  </blockquote>
                ),
                hr: () => (
                  <hr className="border-t border-trait my-10" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-5">
                    <table className="w-full text-[15px] text-left border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="border-b border-encre text-encre">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="py-2.5 pr-6 font-mono text-[10.5px] tracking-[0.1em] uppercase text-gris font-medium">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="py-2.5 pr-6 text-encre/85 text-[15px] border-b border-trait">{children}</td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-bleu underline underline-offset-4 decoration-1 hover:text-encre transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // eslint-disable-next-line @next/next/no-img-element
                img: ({ src, alt }) => (
                  <figure className="figure-cas">
                    <div className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={alt || ""}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  </figure>
                ),
              }}
            >
              {segment.value}
            </ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
}

// --- Helpers ---

interface Segment {
  type: "markdown" | "media" | "youtube" | "video" | "miro" | "eclate" | "construction" | "familles" | "module";
  value: string;
}

function splitMediaSegments(body: string): Segment[] {
  const segments: Segment[] = [];
  const lines = body.split("\n");
  let mdBuffer: string[] = [];

  const flushMd = () => {
    const text = mdBuffer.join("\n").trim();
    if (text) segments.push({ type: "markdown", value: text });
    mdBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    const mediaMatch = trimmed.match(/^\{\{media:(.+?)\}\}$/);
    if (mediaMatch) {
      flushMd();
      segments.push({ type: "media", value: mediaMatch[1] });
      continue;
    }

    const ytMatch = trimmed.match(/^\{\{youtube:(.+?)\}\}$/);
    if (ytMatch) {
      flushMd();
      segments.push({ type: "youtube", value: ytMatch[1] });
      continue;
    }

    const videoMatch = trimmed.match(/^\{\{video:(.+?)\}\}$/);
    if (videoMatch) {
      flushMd();
      segments.push({ type: "video", value: videoMatch[1] });
      continue;
    }

    const miroMatch = trimmed.match(/^\{\{miro:(.+?)\}\}$/);
    if (miroMatch) {
      flushMd();
      segments.push({ type: "miro", value: miroMatch[1] });
      continue;
    }

    const moduleMatch = trimmed.match(/^\{\{module:(.+?)\}\}$/);
    if (moduleMatch) {
      flushMd();
      segments.push({ type: "module", value: moduleMatch[1].trim() });
      continue;
    }

    const constructionMatch = trimmed.match(/^\{\{construction:(.+?)\}\}$/);
    if (constructionMatch) {
      flushMd();
      segments.push({ type: "construction", value: constructionMatch[1] });
      continue;
    }

    const famillesMatch = trimmed.match(/^\{\{familles:(.+?)\}\}$/);
    if (famillesMatch) {
      flushMd();
      segments.push({ type: "familles", value: famillesMatch[1] });
      continue;
    }

    const eclateMatch = trimmed.match(/^\{\{eclate:(.+?)\}\}$/);
    if (eclateMatch) {
      flushMd();
      segments.push({ type: "eclate", value: eclateMatch[1] });
      continue;
    }

    mdBuffer.push(line);
  }

  flushMd();
  return segments;
}

function renderMedia(filename: string, bodyMedia: MediaAsset[], key: number) {
  const asset = bodyMedia.find(
    (m) => m.filename === filename || m.url.endsWith(filename)
  );
  if (!asset) return null;

  const isGif =
    asset.contentType === "image/gif" || filename.endsWith(".gif");

  return (
    <figure key={key} className="figure-cas">
      <div className="relative overflow-hidden">
        {isGif ? (
          <AnimatedMedia src={asset.url} alt={filename} />
        ) : (
          <Image
            src={asset.url}
            alt={filename}
            width={asset.width || 1600}
            height={asset.height || 900}
            className="w-full h-auto"
            sizes="(max-width: 940px) calc(100vw - 32px), 940px"
          />
        )}
      </div>
    </figure>
  );
}

function renderYouTube(videoId: string, key: number) {
  return (
    <figure key={key} className="figure-cas">
      <div className="relative aspect-video overflow-hidden bg-trait">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </figure>
  );
}

// {{eclate:nom|Légende#couleur|…}} : couches nom-1.png (bas) … nom-N.png (haut) prises dans bodyMedia
function renderEclate(value: string, bodyMedia: MediaAsset[], key: number) {
  const [nom, ...legendes] = value.split("|").map((t) => t.trim());
  const rangDe = (f: string) => {
    if (!f.toLowerCase().startsWith(`${nom.toLowerCase()}-`)) return 0;
    const r = f.slice(nom.length + 1).match(/^(\d+)\.(png|webp)$/i);
    return r ? Number(r[1]) : 0;
  };
  const calques = bodyMedia
    .map((m) => ({ m, rang: rangDe(m.filename) }))
    .filter((c) => c.rang > 0)
    .sort((a, b) => a.rang - b.rang);
  if (!calques.length) return null;
  const couches = calques.map(({ m }, i) => {
    const [legende, couleur] = (legendes[i] || "").split("#");
    return { url: m.url, legende: legende?.trim() || undefined, couleur: couleur ? `#${couleur.trim()}` : undefined };
  });
  const { width = 1560, height = 940 } = calques[0].m;
  return <Eclate key={key} couches={couches} largeur={width} hauteur={height} />;
}

// {{module:nom}} : module interactif écrit pour un cas d'études précis
function renderModule(nom: string, key: number) {
  if (nom === "h2a-lames") return <LamesH2A key={key} />;
  return null;
}

// {{construction:nom|Libellé#couleur:Phrase|…}} : images nom-<vue>-01.webp … dans bodyMedia, une série par angle
const ORDRE_VUES = ["so", "ne", "se", "no"];
function renderConstruction(value: string, bodyMedia: MediaAsset[], key: number) {
  const [nom, ...brut] = value.split("|").map((t) => t.trim());
  const etapes = brut.map((t) => {
    const deuxPoints = t.indexOf(":");
    const tete = deuxPoints < 0 ? t : t.slice(0, deuxPoints);
    const [libelle, couleur] = tete.split("#");
    return {
      libelle: libelle.trim(),
      couleur: couleur ? `#${couleur.trim()}` : undefined,
      phrase: deuxPoints < 0 ? undefined : t.slice(deuxPoints + 1).trim(),
    };
  });
  const prefixe = `${nom.toLowerCase()}-`;
  const parVue = new Map<string, { rang: number; m: MediaAsset }[]>();
  for (const m of bodyMedia) {
    const f = m.filename.toLowerCase();
    if (!f.startsWith(prefixe)) continue;
    const r = f.slice(prefixe.length).match(/^([a-z]+)-(\d+)\.(png|webp)$/);
    if (!r) continue;
    if (!parVue.has(r[1])) parVue.set(r[1], []);
    parVue.get(r[1])!.push({ rang: Number(r[2]), m });
  }
  const rangVue = (v: string) => (ORDRE_VUES.includes(v) ? ORDRE_VUES.indexOf(v) : 99);
  const vues = [...parVue.entries()]
    .sort((a, b) => rangVue(a[0]) - rangVue(b[0]) || a[0].localeCompare(b[0]))
    .map(([v, liste]) => {
      liste.sort((a, b) => a.rang - b.rang);
      return {
        nom: v,
        images: liste.map((x) => x.m.url),
        largeur: liste[0].m.width || 1200,
        hauteur: liste[0].m.height || 1200,
      };
    })
    .filter((v) => v.images.length === etapes.length);
  if (!vues.length || !etapes.length) return null;
  return <Construction key={key} etapes={etapes} vues={vues} />;
}

// {{familles:nom|Phrase d'ouverture|Libellé#couleur:Phrase:Nombre|…}} : images nom-01.webp … (une famille seule)
// et nom-tout.webp (le modèle entier) dans bodyMedia
function renderFamilles(value: string, bodyMedia: MediaAsset[], key: number) {
  const [nom, ...brut] = value.split("|").map((t) => t.trim());
  const intro = brut[0] && !brut[0].includes("#") ? brut.shift() : undefined;
  const image = (suffixe: string) =>
    bodyMedia.find((m) => new RegExp(`^${nom}-${suffixe}\\.(png|webp)$`, "i").test(m.filename));
  const tout = image("tout");
  const familles = brut.map((t, k) => {
    const [tete, phrase, nombre] = t.split(":").map((x) => x.trim());
    const [libelle, couleur] = tete.split("#");
    return {
      libelle: libelle.trim(),
      couleur: couleur ? `#${couleur.trim()}` : undefined,
      phrase,
      nombre: nombre || undefined,
      image: image(String(k + 1).padStart(2, "0"))?.url,
    };
  });
  if (!tout || !familles.length || familles.some((f) => !f.image)) return null;
  return (
    <Familles
      key={key}
      intro={intro}
      familles={familles as (typeof familles[number] & { image: string })[]}
      tout={tout.url}
      largeur={tout.width || 1200}
      hauteur={tout.height || 1200}
    />
  );
}

function renderMiro(value: string, key: number) {
  // value is like "BOARD_ID?moveToViewport=...&embedId=..."
  const [boardId, params] = value.split("?");
  const src = `https://miro.com/app/live-embed/${boardId}/?embedMode=view_only_without_ui${params ? `&${params}` : ""}`;

  return (
    <figure key={key} className="figure-cas">
      <div className="relative aspect-video overflow-hidden bg-trait">
        <iframe
          src={src}
          title="Miro board"
          frameBorder="0"
          scrolling="no"
          allow="fullscreen; clipboard-read; clipboard-write"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </figure>
  );
}

function renderVideo(filename: string, bodyMedia: MediaAsset[], key: number) {
  const asset = bodyMedia.find(
    (m) => m.filename === filename || m.url.endsWith(filename)
  );
  if (!asset) return null;

  return (
    <figure key={key} className="figure-cas">
      <div className="relative overflow-hidden">
        <video
          src={asset.url}
          controls
          playsInline
          preload="metadata"
          className="w-full h-auto"
        />
      </div>
    </figure>
  );
}
