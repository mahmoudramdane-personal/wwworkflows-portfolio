import { getArticleBySlug, getArticles } from "@/lib/contentful";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RichBody from "@/components/RichBody";
import type { Metadata } from "next";

export const revalidate = 60;
export const dynamicParams = true;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/article/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      images: article.thumbnail
        ? [{ url: article.thumbnail, width: 1200, height: 630, alt: article.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white min-h-screen -mt-16 pt-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Back navigation */}
        <div className="pt-8">
          <Link
            href="/articles"
            className="text-neutral-400 text-xs tracking-[0.12em] uppercase hover:text-neutral-900 transition-colors duration-300"
          >
            &larr; Retour aux articles
          </Link>
        </div>

        {/* Title section */}
        <section className="pt-12 pb-8 md:pt-16 md:pb-12 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            {article.category && (
              <span className="text-xs tracking-[0.12em] uppercase text-neutral-400">
                {article.category}
              </span>
            )}
            <span className="text-xs tracking-[0.1em] text-neutral-300">
              {formattedDate}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-neutral-500 text-lg md:text-xl leading-relaxed">
            {article.excerpt}
          </p>
        </section>

        {/* Hero image */}
        {article.thumbnail && (
          <section className="mb-12">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </div>
          </section>
        )}

        {/* Body content */}
        <section className="mb-16">
          <RichBody body={article.body} bodyMedia={[]} />
        </section>

        {/* Back to articles */}
        <section className="border-t border-black/10 py-12 text-center">
          <Link
            href="/articles"
            className="text-neutral-400 text-xs tracking-[0.12em] uppercase hover:text-neutral-900 transition-colors duration-300"
          >
            Voir tous les articles &rarr;
          </Link>
        </section>
      </div>
    </div>
  );
}
