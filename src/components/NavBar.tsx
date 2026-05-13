"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/songs", label: "Songs" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-cream-100/80 border-b border-cream-300/60">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-ink-900 no-underline hover:text-terra-600"
        >
          Anuj <span className="text-terra-500">·</span> 777
        </Link>
        <nav className="flex items-center gap-x-5 text-sm">
          {links.slice(1).map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "no-underline " +
                  (active
                    ? "text-terra-600 font-medium"
                    : "text-ink-500 hover:text-ink-900")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
