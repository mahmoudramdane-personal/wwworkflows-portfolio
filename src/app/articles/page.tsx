import { getArticles } from "@/lib/contentful";
import { detectLang } from "@/lib/locale";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

export const revalidate = 60;

export default async function ArticlesPage() {
  const hdrs = await headers();
  const acceptLanguage = hdrs.get("accept-language");
  const lang = detectLang(acceptLanguage);
  const locale = lang === "fr" ? "fr" as const : "en-US" as const;
  const articles = await getArticles(locale);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      {/* Header */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
          {lang === "fr" ? "Articles" : "Articles"}
        </h1>
        <p className="mt-4 text-neutral-500 text-base md:text-lg max-w-2xl leading-relaxed">
          {lang === "fr"
            ? "Réflexions sur le Computational Design, l&apos;architecture paramétrique et la technologie de construction."
            : "Thoughts on Computational Design, parametric architecture, and construction technology."}
        </p>
        <div className="mt-8 w-16 h-0.5 bg-accent/30" />
      </section>

      {/* Articles grid */}
      <section className="pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={`${article.slug}-${locale}`} article={article} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ArticleCard({
  article,
  lang,
}: {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    category?: string;
    date: string;
    thumbnail?: string;
  };
  lang: string;
}) {
  const formattedDate = new Date(article.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:border-accent/20 hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-accent-muted/30">
        {article.thumbnail ? (
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-accent/20 text-6xl font-serif">W</span>
          </div>
        )}
      </div>

      <div className="p-5 md:p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          {article.category && (
            <span className="text-[10px] tracking-[0.15em] uppercase text-accent/70 font-medium">
              {article.category}
            </span>
          )}
          <span className="text-[10px] tracking-[0.1em] text-neutral-400">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-accent transition-colors duration-300">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}