"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f1f1f1]/90 backdrop-blur-sm border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="group">
          <span className="text-neutral-900 text-sm font-bold tracking-[0.2em] uppercase transition-opacity duration-300 group-hover:opacity-60">
            WWWorkflows
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-[0.12em] uppercase transition-colors duration-300 ${
                pathname === link.href
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Language toggle */}
          <div className="flex items-center gap-1 ml-4 text-xs tracking-[0.08em]">
            <button className="text-neutral-900 transition-opacity duration-300 hover:opacity-60">
              EN
            </button>
            <span className="text-neutral-300">/</span>
            <button className="text-neutral-400 transition-colors duration-300 hover:text-neutral-900">
              FR
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
