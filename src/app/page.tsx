import Link from "next/link";
import { profile } from "@/data/profile";
import { projects, featuredSlugs } from "@/data/projects";
import { songs, channelUrl, channelName } from "@/data/songs";
import { essays } from "@/data/writing";
import ProjectCard from "@/components/ProjectCard";
import SongRow from "@/components/SongRow";

export default function Home() {
  const featured = featuredSlugs.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);
  const shipped = songs.filter((s) => s.status === "shipped").slice(0, 5);
  const recentEssays = essays.filter((e) => !!e.url).slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section className="mb-20">
        <div className="text-sm uppercase tracking-[0.2em] text-terra-500 mb-3">
          {profile.location}
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight text-ink-900 mb-6">
          {profile.name}.<br />
          <span className="text-ink-500 italic">{profile.short}</span>
        </h1>
        <p className="text-ink-700 text-lg leading-relaxed max-w-prose">{profile.pitch}</p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
          {profile.highlights.map((h) => (
            <div key={h.label}>
              <div className="text-xs uppercase tracking-wider text-ink-400">{h.label}</div>
              <div className="text-sm text-ink-800 mt-0.5">{h.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="mb-20">
        <header className="flex items-baseline justify-between mb-1">
          <h2 className="font-serif text-2xl tracking-tight text-ink-900">Selected work</h2>
          <Link href="/projects" className="text-sm text-ink-500 hover:text-terra-600 no-underline">
            All projects →
          </Link>
        </header>
        <div className="border-t border-cream-300/60">
          {featured.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* Songs preview */}
      <section className="mb-20">
        <header className="flex items-baseline justify-between mb-1 gap-3 flex-wrap">
          <h2 className="font-serif text-2xl tracking-tight text-ink-900">Songs</h2>
          <div className="flex gap-4 text-sm">
            <Link href={channelUrl} target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-terra-600 no-underline">
              @{channelName}
            </Link>
            <Link href="/songs" className="text-ink-500 hover:text-terra-600 no-underline">
              All songs →
            </Link>
          </div>
        </header>
        <p className="text-ink-600 max-w-prose mb-3">
          12 songs across Nepali, Hindi, and English. Bilingual storytelling is its own craft — I keep
          working at it. Most of the catalog lives on my YouTube channel.
        </p>
        <div className="border-t border-cream-300/60">
          {shipped.map((s) => (
            <SongRow key={s.title} s={s} />
          ))}
        </div>
      </section>

      {/* Writing preview */}
      <section className="mb-12">
        <header className="flex items-baseline justify-between mb-1">
          <h2 className="font-serif text-2xl tracking-tight text-ink-900">Writing</h2>
          <Link href="/writing" className="text-sm text-ink-500 hover:text-terra-600 no-underline">
            All stories →
          </Link>
        </header>
        <div className="border-t border-cream-300/60">
          {recentEssays.map((e) => (
            <Link
              key={e.slug}
              href={e.url ?? `/writing/${e.slug}`}
              target={e.url ? "_blank" : undefined}
              rel={e.url ? "noopener noreferrer" : undefined}
              className="group block py-5 border-b border-cream-300/60 no-underline"
            >
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h3 className="font-serif text-lg tracking-tight text-ink-900 group-hover:text-terra-600 transition-colors">
                  {e.title}
                  {e.url && <span className="text-ink-400 text-base ml-1">↗</span>}
                </h3>
                <span className="text-xs text-ink-400 font-mono uppercase tracking-wider">
                  {e.status === "draft" ? "draft" : e.date.slice(0, 4)}
                </span>
              </div>
              <p className="mt-1 text-ink-600">{e.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
