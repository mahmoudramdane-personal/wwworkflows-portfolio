import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-12 mt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="WWWorkflows"
              width={28}
              height={16}
              className="opacity-30"
            />
            <span className="text-neutral-300 text-xs tracking-[0.15em] uppercase font-[family-name:var(--font-space-mono)]">
              WWWorkflows
            </span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-6 font-[family-name:var(--font-space-mono)]">
            <Link
              href="/"
              className="text-neutral-400 text-xs tracking-[0.08em] uppercase hover:text-neutral-900 transition-colors duration-300"
            >
              Projets
            </Link>
            <Link
              href="/about"
              className="text-neutral-400 text-xs tracking-[0.08em] uppercase hover:text-neutral-900 transition-colors duration-300"
            >
              Studio
            </Link>
            <Link
              href="/contact"
              className="text-neutral-400 text-xs tracking-[0.08em] uppercase hover:text-neutral-900 transition-colors duration-300"
            >
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <span className="text-neutral-300 text-[10px] tracking-[0.1em] font-[family-name:var(--font-space-mono)]">
            &copy; {new Date().getFullYear()} WWWorkflows — Studio de Computational Design
          </span>
        </div>
      </div>
    </footer>
  );
}
