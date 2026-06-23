import { Metadata } from "next";
import { notFound } from "next/navigation";
import { essays } from "@/data/writing";
import ExternalRedirect from "./ExternalRedirect";
import Link from "next/link";

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const e = essays.find((x) => x.slug === params.slug);
  if (!e) return {};
  return {
    title: e.title,
    description: e.summary,
    openGraph: {
      title: `${e.title} | Anuj Shrestha`,
      description: e.summary,
      type: "article",
      url: `https://anuj-shrestha.github.io/writing/${e.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${e.title} | Anuj Shrestha`,
      description: e.summary,
    },
  };
}

export default function EssayDetail({ params }: { params: { slug: string } }) {
  const e = essays.find((x) => x.slug === params.slug);
  if (!e) return notFound();

  if (e.url) {
    return <ExternalRedirect url={e.url} />;
  }

  const paras = (e.body ?? "").split(/\n\n+/);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": e.title,
    "description": e.summary,
    "datePublished": e.date,
    "author": {
      "@type": "Person",
      "name": "Anuj Shrestha",
      "url": "https://anuj-shrestha.github.io"
    },
    "url": e.url ?? `https://anuj-shrestha.github.io/writing/${e.slug}`
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
