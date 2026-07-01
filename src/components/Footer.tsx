import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-12 mt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="group">
            <Image
              src="/logo.png"
              alt="WWWorkflows"
              width={32}
              height={18}
              className="opacity-25 transition-opacity duration-300 group-hover:opacity-50"
            />
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-6">
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
              href="/articles"
              className="text-neutral-400 text-xs tracking-[0.08em] uppercase hover:text-neutral-900 transition-colors duration-300"
            >
              Articles
            </Link>
            <a
              href="https://afterworkworkflow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 text-xs tracking-[0.08em] uppercase hover:text-neutral-900 transition-colors duration-300"
            >
              Formation
            </a>
            <Link
              href="/contact"
              className="text-neutral-400 text-xs tracking-[0.08em] uppercase hover:text-neutral-900 transition-colors duration-300"
            >
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <span className="text-neutral-300 text-[10px] tracking-[0.1em]">
            &copy; {new Date().getFullYear()} WWWorkflows
          </span>
        </div>
      </div>
    </footer>
  );
}
