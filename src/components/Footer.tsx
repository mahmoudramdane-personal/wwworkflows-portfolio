import Link from "next/link";
import Monogramme from "./Monogramme";

export default function Footer() {
  const liens = [
    { href: "/#cas-etudes", label: "Cas d'études" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "Studio" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="border-t border-encre mt-24">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <Link href="/" className="text-encre hover:text-bleu transition-colors duration-300" aria-label="WWWORKFLOWS, accueil">
          <Monogramme className="h-[14px] w-auto" />
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {liens.map((l) => (
            <Link key={l.href} href={l.href} className="mono text-gris hover:text-bleu transition-colors duration-300">
              {l.label}
            </Link>
          ))}
          <a
            href="https://afterworkworkflow.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-gris hover:text-bleu transition-colors duration-300"
          >
            Formation ↗
          </a>
        </nav>

        <span className="mono text-gris">&copy; {new Date().getFullYear()} WWWORKFLOWS</span>
      </div>
    </footer>
  );
}
