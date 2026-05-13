import Link from "next/link";
import { essays } from "@/data/writing";

export default function WritingPage() {
  return (
    <div>
      <header className="mb-10">
        <h1 className="font-serif text-4xl tracking-tight text-ink-900">Writing</h1>
        <p className="text-ink-600 mt-2 max-w-prose">
          Stories, notes on engineering, on switching careers, on building things for myself before
          building them for other people.
        </p>
      </header>
      <div className="border-t border-cream-300/60">
        {essays.map((e) => {
          const href = e.url ?? `/writing/${e.slug}`;
          const isExternal = !!e.url;
          return (
            <Link
              key={e.slug}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group block py-6 border-b border-cream-300/60 no-underline"
            >
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h2 className="font-serif text-xl tracking-tight text-ink-900 group-hover:text-terra-600 transition-colors">
                  {e.title}
                  {isExternal && <span className="text-ink-400 text-base ml-1">↗</span>}
                </h2>
                <span className="text-xs text-ink-400 font-mono uppercase tracking-wider">
                  {e.status === "draft" ? "draft" : e.date.slice(0, 4)}
                </span>
              </div>
              <p className="mt-1 text-ink-600 max-w-prose">{e.summary}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
