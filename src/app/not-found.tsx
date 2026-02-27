import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-6">404</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-neutral-500 text-base mb-10 max-w-sm mx-auto leading-relaxed">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="text-xs tracking-[0.12em] uppercase text-neutral-900 hover:text-neutral-400 transition-colors duration-300"
        >
          ← Retour aux projets
        </Link>
      </div>
    </div>
  );
}
