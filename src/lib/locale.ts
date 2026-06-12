// src/lib/locale.ts
// Language detection and management for bilingual support

export type Locale = "en-US" | "fr";
export type SiteLang = "en" | "fr";

export const LOCALE_MAP: Record<SiteLang, Locale> = {
  en: "en-US",
  fr: "fr",
};

export const SITE_LANGS: SiteLang[] = ["fr", "en"];

/**
 * Detect preferred language from Accept-Language header.
 * Defaults to French (site default).
 */
export function detectLang(acceptLanguage?: string | null): SiteLang {
  if (!acceptLanguage) return "fr";

  // Parse Accept-Language, take highest priority
  const langs = acceptLanguage
    .split(",")
    .map((l) => {
      const [tag, q = "1"] = l.trim().split(";q=");
      return { tag: tag.split("-")[0], q: parseFloat(q) || 1 };
    })
    .filter((l) => ["fr", "en"].includes(l.tag))
    .sort((a, b) => b.q - a.q);

  return langs.length > 0 ? (langs[0].tag as SiteLang) : "fr";
}

/**
 * Get language from URL search params (?lang=fr|en) or cookie.
 */
export function getLangFromRequest(
  searchParams: URLSearchParams,
  acceptLanguage?: string | null
): SiteLang {
  // 1. Explicit ?lang= overrides everything
  const langParam = searchParams.get("lang");
  if (langParam === "en") return "en";
  if (langParam === "fr") return "fr";
  // 2. Fall back to browser detection
  return detectLang(acceptLanguage);
}

/**
 * Alternate URLs for hreflang tags.
 */
export function getAlternateUrls(slug: string): {
  href: string;
  hrefLang: string;
}[] {
  const base = "https://wwworkflows.com";
  return [
    { href: `${base}/article/${slug}`, hrefLang: "x-default" },
    { href: `${base}/article/${slug}?lang=fr`, hrefLang: "fr" },
    { href: `${base}/article/${slug}?lang=en`, hrefLang: "en" },
  ];
}