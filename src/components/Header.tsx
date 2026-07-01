"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Projets" },
    { href: "/about", label: "Studio" },
    { href: "/articles", label: "Articles" },
    { href: "https://afterworkworkflow.com", label: "Formation", external: true },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f1f1f1]/90 backdrop-blur-sm border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="group">
          <Image
            src="/logo.png"
            alt="WWWorkflows"
            width={56}
            height={30}
            className="transition-opacity duration-300 group-hover:opacity-60"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = !link.external && pathname === link.href;
            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-xs tracking-[0.12em] uppercase transition-all duration-300 group text-neutral-400 hover:text-neutral-900 hover:font-semibold"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-[1.5px] bg-neutral-900 transition-all duration-300 ease-out w-0 group-hover:w-full" />
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs tracking-[0.12em] uppercase transition-all duration-300 group ${
                  isActive
                    ? "text-neutral-900 font-semibold"
                    : "text-neutral-400 hover:text-neutral-900 hover:font-semibold"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-neutral-900 transition-all duration-300 ease-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
