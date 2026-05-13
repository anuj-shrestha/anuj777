import Link from "next/link";
import { notFound } from "next/navigation";
import { essays } from "@/data/writing";

export function generateStaticParams() {
  return essays.filter((e) => !e.url).map((e) => ({ slug: e.slug }));
}

export default function EssayDetail({ params }: { params: { slug: string } }) {
  const e = essays.find((x) => x.slug === params.slug);
  if (!e) return notFound();

  const paras = (e.body ?? "").split(/\n\n+/);

  return (
    <article>
      <Link href="/writing" className="text-sm text-ink-500 hover:text-terra-600 no-underline">
        ← All writing
      </Link>

      <header className="mt-6 mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-terra-500 mb-3">
          {e.status === "draft" ? "Draft" : e.date}
        </div>
        <h1 className="font-serif text-4xl tracking-tight text-ink-900 leading-tight">{e.title}</h1>
        <p className="text-ink-600 mt-3 text-lg max-w-prose">{e.summary}</p>
      </header>

      <div className="prose-warm">
        {paras.map((para, i) => {
          if (para.startsWith("[ ") && para.endsWith(" ]")) {
            return (
              <p key={i} className="text-ink-400 italic text-sm">
                {para}
              </p>
            );
          }
          return <p key={i}>{para}</p>;
        })}
      </div>
    </article>
  );
}
