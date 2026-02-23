import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MediaAsset } from "@/lib/types";

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
    <div className="space-y-8">
      {segments.map((segment, i) => {
        if (segment.type === "media") return renderMedia(segment.value, bodyMedia, i);
        if (segment.type === "youtube") return renderYouTube(segment.value, i);
        if (segment.type === "video") return renderVideo(segment.value, bodyMedia, i);

        // Markdown content
        return (
          <div key={i} className="prose-custom">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-12 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mt-10 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 mt-8 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-neutral-600 text-sm leading-[1.9] tracking-wide mb-4">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-neutral-900">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-neutral-700">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-2 text-neutral-600 text-sm leading-[1.9] tracking-wide mb-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 space-y-2 text-neutral-600 text-sm leading-[1.9] tracking-wide mb-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-neutral-600">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-neutral-300 pl-6 py-2 text-neutral-500 italic text-sm leading-[1.9]">
                    {children}
                  </blockquote>
                ),
                hr: () => (
                  <hr className="border-t border-black/10 my-10" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-left border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="border-b border-black/10 text-neutral-900 font-bold">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="py-2 pr-4 text-xs tracking-[0.1em] uppercase text-neutral-400">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="py-2 pr-4 text-neutral-600">{children}</td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
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
  type: "markdown" | "media" | "youtube" | "video";
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
    <figure key={key} className="my-4">
      <div className="relative overflow-hidden bg-neutral-100">
        {isGif ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt={filename}
            className="w-full h-auto"
            loading="lazy"
          />
        ) : (
          <Image
            src={asset.url}
            alt={filename}
            width={asset.width || 1200}
            height={asset.height || 675}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}
      </div>
    </figure>
  );
}

function renderYouTube(videoId: string, key: number) {
  return (
    <figure key={key} className="my-4">
      <div className="relative aspect-video overflow-hidden bg-neutral-100">
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

function renderVideo(filename: string, bodyMedia: MediaAsset[], key: number) {
  const asset = bodyMedia.find(
    (m) => m.filename === filename || m.url.endsWith(filename)
  );
  if (!asset) return null;

  return (
    <figure key={key} className="my-4">
      <div className="relative overflow-hidden bg-neutral-100">
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
