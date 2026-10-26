import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Apparition from "@/components/Apparition";
import { listeArticles, dateLisible } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description: "Design computationnel, intelligence artificielle et pratique de l'architecture : nos articles.",
};

export default function ArticlesPage() {
  const articles = listeArticles();

  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-16 md:pt-24">
      <span className="mono text-gris">Articles · {String(articles.length).padStart(2, "0")}</span>
      <h1 className="texte-net titre-large mt-6 text-4xl md:text-6xl leading-[1.04] max-w-3xl">Ce que nous apprenons en chemin.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gris">
        Design computationnel, intelligence artificielle et pratique de l&apos;architecture.
      </p>

      <div className="mt-14 md:mt-20 grid gap-x-10 gap-y-16 md:grid-cols-2 border-t border-encre pt-10">
        {articles.map((a, i) => (
          <Apparition key={a.slug} delai={(i % 2) * 120}>
            <Link href={`/article/${a.slug}`} className="group block">
              <div className="volet relative aspect-[16/9] overflow-hidden bg-trait">
                <Image src={a.image} alt={a.imageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 590px" />
                {/* Duotone bleu au repos, couleur au survol */}
                <div className="duotone absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" aria-hidden="true">
                  <Image src={a.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 590px" />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="mono text-bleu">{a.category}</span>
                <span className="mono text-gris">
                  {a.minutes ? `Lecture · ${a.minutes} min` : ""}
                  {a.date ? ` · ${dateLisible(a.date)}` : ""}
                </span>
              </div>
              <h2 className="titre-large mt-3 text-2xl md:text-3xl leading-tight transition-colors duration-300 group-hover:text-bleu">
                {a.title}
              </h2>
              <p className="mt-3 text-gris leading-relaxed">{a.excerpt}</p>
              <span className="mono mt-4 inline-block text-encre transition-transform duration-300 group-hover:translate-x-1 group-hover:text-bleu">
                Lire →
              </span>
            </Link>
          </Apparition>
        ))}
      </div>
    </section>
  );
}
