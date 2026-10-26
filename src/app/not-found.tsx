import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 pt-24 md:pt-36">
      <span className="mono text-bleu">Erreur 404</span>
      <h1 className="titre-large mt-6 text-4xl md:text-6xl leading-[1.04] max-w-3xl">Cette page n&apos;existe pas, ou plus.</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-gris">Elle a peut-être été déplacée. Les cas d&apos;études et les articles sont toujours là.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="mono inline-flex items-center px-4 py-3 bg-bleu text-white border border-bleu hover:bg-encre hover:border-encre transition-colors duration-300">
          ← Accueil
        </Link>
        <Link href="/cas-etudes" className="mono inline-flex items-center px-4 py-3 border border-encre bg-papier hover:bg-encre hover:text-papier transition-colors duration-300">
          Cas d&apos;études
        </Link>
      </div>
    </section>
  );
}
