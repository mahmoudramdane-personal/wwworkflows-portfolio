import Image from "next/image";
import { MediaAsset } from "@/lib/types";

interface RichBodyProps {
  body: string;
  bodyMedia: MediaAsset[];
}

/**
 * Renders body text with rich media embeds.
 *
 * Supported syntax in body markdown:
 *   {{media:filename.gif}}   — image/GIF from bodyMedia assets
 *   {{youtube:VIDEO_ID}}     — YouTube iframe embed
 *   {{video:filename.mp4}}   — video player from bodyMedia assets
 */
export default function RichBody({ body, bodyMedia }: RichBodyProps) {
  const blocks = body.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        // {{media:filename}}
        const mediaMatch = trimmed.match(/^\{\{media:(.+?)\}\}$/);
        if (mediaMatch) {
          const filename = mediaMatch[1];
          const asset = bodyMedia.find(
            (m) => m.filename === filename || m.url.endsWith(filename)
          );
          if (!asset) return null;

          const isGif =
            asset.contentType === "image/gif" || filename.endsWith(".gif");

          return (
            <figure key={i} className="my-4">
              <div className="relative overflow-hidden bg-neutral-200">
                {isGif ? (
                  // GIFs: use <img> to preserve animation (next/image optimizes away animation)
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

        // {{youtube:VIDEO_ID}}
        const ytMatch = trimmed.match(/^\{\{youtube:(.+?)\}\}$/);
        if (ytMatch) {
          const videoId = ytMatch[1];
          return (
            <figure key={i} className="my-4">
              <div className="relative aspect-video overflow-hidden bg-neutral-200">
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

        // {{video:filename}}
        const videoMatch = trimmed.match(/^\{\{video:(.+?)\}\}$/);
        if (videoMatch) {
          const filename = videoMatch[1];
          const asset = bodyMedia.find(
            (m) => m.filename === filename || m.url.endsWith(filename)
          );
          if (!asset) return null;

          return (
            <figure key={i} className="my-4">
              <div className="relative overflow-hidden bg-neutral-200">
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

        // Regular paragraph
        return (
          <p
            key={i}
            className="text-neutral-600 text-base leading-[1.8] tracking-wide"
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
