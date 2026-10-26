"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Monogramme from "./Monogramme";

// En-tête : papier au repos. Il passe peu à peu en bleu (textes et logo blancs, Contact inversé)
// en descendant dans le fondu vers le footer. Pas de changement au survol (Mahmoud, 26.10.26).
export default function Header() {
  const pathname = usePathname();
  const [descente, setDescente] = useState(0);

  useEffect(() => {
    // Avancement dans le fondu : 0 quand il atteint le bas de l'en-tête, 1 quand il l'a dépassé
    const defile = () => {
      const f = document.querySelector("[data-fondu]");
      if (!f) return setDescente(0);
      const r = f.getBoundingClientRect();
      setDescente(Math.min(1, Math.max(0, (64 - r.top) / r.height)));
    };
    window.addEventListener("scroll", defile, { passive: true });
    window.addEventListener("resize", defile);
    defile();
    return () => {
      window.removeEventListener("scroll", defile);
      window.removeEventListener("resize", defile);
    };
  }, [pathname]);

  const t = descente;
  const bleu = t > 0.5;

  const navLinks = [
    { href: "/cas-etudes", label: "Cas d'études" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "Studio" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,color] duration-150 ${bleu ? "text-white" : "text-encre"}`}
      style={{
        backgroundColor: `color-mix(in srgb, var(--bleu) ${Math.round(t * 100)}%, var(--papier))`,
      }}
    >
      {/* Même grain que la page derrière les textes ; pas de ligne de séparation */}
      <div className="grain-aplat absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-[1240px] mx-auto px-4 md:px-8 flex items-center justify-between h-16 gap-4">
        <Link href="/" className="transition-opacity duration-300 hover:opacity-70" aria-label="WWWORKFLOWS, accueil">
          <Monogramme className="h-[18px] w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const actif = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mono relative py-1 transition-colors duration-300 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-current after:transition-all after:duration-300 ${
                  actif ? "after:w-full" : "after:w-0 hover:after:w-full"
                } ${!bleu && actif ? "text-bleu" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Lien vers l'école : les deux sites se répondent */}
          <a
            href="https://afterworkworkflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`mono hidden sm:inline-flex items-center px-3 py-2 border transition-colors duration-500 ${
              bleu ? "bg-bleu border-white hover:bg-white hover:text-bleu" : "bg-papier border-encre hover:bg-encre hover:text-papier"
            }`}
          >
            Formation ↗
          </a>
          <Link
            href="/contact"
            className={`mono inline-flex items-center px-3 py-2 border transition-colors duration-500 ${
              bleu ? "bg-white text-bleu border-white hover:bg-encre hover:text-white hover:border-encre" : "bg-bleu text-white border-bleu hover:bg-encre hover:border-encre"
            }`}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
