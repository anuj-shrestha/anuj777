import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return notFound();

  const paras = p.body.split(/\n\n+/);

  return (
    <article>
      <Link href="/projects" className="text-sm text-ink-500 hover:text-terra-600 no-underline">
        ← All projects
      </Link>

      <header className="mt-6 mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-terra-500 mb-3">{p.year} · {p.role}</div>
        <h1 className="font-serif text-4xl tracking-tight text-ink-900 leading-tight">{p.title}</h1>
        <p className="text-ink-600 mt-3 text-lg max-w-prose">{p.tagline}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {p.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-mono uppercase tracking-wider text-ink-500 bg-cream-200 px-2 py-1 rounded"
            >
              {t}
            </span>
          ))}
        </div>

        {(p.links || p.link || p.repo) && (
          <div className="flex flex-wrap gap-4 mt-5 text-sm">
            {(p.links ?? (p.link ? [p.link] : [])).map((l) => (
              <Link key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-terra-600 hover:text-terra-700">
                {l.label} ↗
              </Link>
            ))}
            {p.repo && (
              <Link href={p.repo.href} target="_blank" rel="noopener noreferrer" className="text-terra-600 hover:text-terra-700">
                {p.repo.label} ↗
              </Link>
            )}
          </div>
        )}
      </header>

      <div className="prose-warm">
        {paras.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
