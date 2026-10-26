import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RichBody from "@/components/RichBody";
import OutilsLecture from "@/components/OutilsLecture";
import { titresDe, minutesDeLecture } from "@/lib/titres";
import { listeArticles, articleParSlug, dateLisible } from "@/lib/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return listeArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = articleParSlug(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    // Même texte que sur afterworkworkflow.com : l'original y reste la référence pour les moteurs de recherche
    alternates: { canonical: a.source },
    openGraph: { title: a.title, description: a.excerpt, url: `/article/${a.slug}`, type: "article", images: [{ url: a.image }] },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const a = articleParSlug(slug);
  if (!a) notFound();

  const titres = titresDe(a.body);
  const autres = listeArticles().filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-encre">
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <Link href="/articles" className="mono text-gris hover:text-bleu transition-colors duration-300">
            &larr; Tous les articles
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="mono px-2.5 py-1.5 bg-bleu text-white">{a.category}</span>
            <span className="mono text-gris">Lecture · {a.minutes ?? minutesDeLecture(a.body)} min</span>
            {a.date && <span className="mono text-gris">{dateLisible(a.date)}</span>}
          </div>
          <h1 className="texte-net titre-large mt-6 text-4xl md:text-6xl leading-[1.04] max-w-4xl">{a.title}</h1>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-gris">{a.excerpt}</p>
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-10 md:pt-14">
        <div className="relative aspect-[16/9] overflow-hidden bg-trait">
          <Image src={a.image} alt={a.imageAlt} fill className="object-cover" priority sizes="(max-width: 1240px) 100vw, 1176px" />
        </div>
      </section>

      <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
        <article id="texte-cas" className="corps-cas relative max-w-[940px] xl:ml-[262px]">
          <OutilsLecture titres={titres} libelle="Dans cet article" />
          <RichBody body={a.body} bodyMedia={[]} />
          <p className="max-w-[680px] mt-10 pt-4 border-t border-trait mono text-gris">
            Publié d&apos;abord sur{" "}
            <a href={a.source} target="_blank" rel="noopener noreferrer" className="text-bleu hover:text-encre">
              Afterwork Workflow ↗
            </a>
          </p>
        </article>
      </section>

      {autres.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-20 md:pt-28">
          <div className="flex items-baseline justify-between border-b border-encre pb-4 mb-8">
            <h2 className="mono text-encre">À lire aussi</h2>
            <Link href="/articles" className="mono text-gris hover:text-bleu transition-colors duration-300">
              Tous les articles →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {autres.map((x) => (
              <Link key={x.slug} href={`/article/${x.slug}`} className="group block border-t border-trait pt-4">
                <span className="mono text-bleu">{x.category}</span>
                <h3 className="titre-large mt-3 text-xl leading-snug transition-colors duration-300 group-hover:text-bleu">{x.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
