import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group block py-6 border-b border-cream-300/60 no-underline"
    >
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h3 className="font-serif text-xl tracking-tight text-ink-900 group-hover:text-terra-600 transition-colors">
          {p.title}
        </h3>
        <span className="text-xs text-ink-400 font-mono uppercase tracking-wider">{p.year}</span>
      </div>
      <p className="mt-1 text-ink-600 leading-relaxed">{p.tagline}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="text-ink-500">{p.role}</span>
        {p.tags.slice(0, 4).map((t) => (
          <span key={t} className="text-ink-400">· {t}</span>
        ))}
      </div>
    </Link>
  );
}
