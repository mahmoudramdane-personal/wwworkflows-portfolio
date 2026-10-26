"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Monogramme from "./Monogramme";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/#cas-etudes", label: "Cas d'études" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "Studio" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-papier/90 backdrop-blur-sm border-b border-encre">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 flex items-center justify-between h-16 gap-4">
        <Link href="/" className="text-encre hover:text-bleu transition-colors duration-300" aria-label="WWWORKFLOWS, accueil">
          <Monogramme className="h-[18px] w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const actif = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mono transition-colors duration-300 ${actif ? "text-bleu" : "text-encre hover:text-bleu"}`}
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
            className="mono hidden sm:inline-flex items-center px-3 py-2 border border-encre text-encre hover:bg-encre hover:text-papier transition-colors duration-300"
          >
            Formation ↗
          </a>
          <Link
            href="/contact"
            className="mono inline-flex items-center px-3 py-2 bg-bleu text-white border border-bleu hover:bg-encre hover:border-encre transition-colors duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
