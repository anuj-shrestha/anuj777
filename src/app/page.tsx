import Image from "next/image";
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
        {/* Editorial header rule */}
        <div className="flex items-center gap-4 mb-10 text-[11px] uppercase tracking-[0.3em] font-mono">
          <span className="text-terra-600">{profile.location}</span>
          <div className="h-px flex-1 bg-cream-300" />
          <span className="text-ink-400">2026</span>
        </div>

        {/* Portrait + name — side by side, bottom-aligned, feet land on the paragraph below */}
        <div className="grid grid-cols-12 gap-4 sm:gap-8 items-end mb-6">
          <div className="col-span-5">
            <div className="aspect-square rounded-full bg-terra-50 ring-1 ring-terra-200/60 overflow-hidden">
              <Image
                src="/anuj-2025-pp.png"
                alt={`Portrait of ${profile.name}`}
                width={400}
                height={500}
                priority
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
          <div className="col-span-7 flex flex-col justify-end pb-1">
            <h1 className="font-serif font-light text-[clamp(2rem,7vw,4.75rem)] leading-[0.9] tracking-tight text-ink-900">
              Anuj<br />Shrestha.
            </h1>
            <p className="font-serif italic font-light text-[clamp(1.125rem,3vw,2rem)] text-ink-500 leading-[1.05] mt-3">
              Engineer,<br className="sm:hidden" /> songwriter, maker.
            </p>
          </div>
        </div>

        {/* Bio — portrait stands on top of this */}
        <p className="text-ink-700 text-lg leading-relaxed max-w-prose">
          {profile.pitch}
        </p>

        {/* Colophon — inline prose, replaces stat grid */}
        <p className="mt-6 text-sm text-ink-500 max-w-prose leading-relaxed">
          Lead engineer at <span className="text-ink-800">Parewa Labs (Programiz)</span>.
          Creator of <span className="text-ink-800">Visual Story Editor AI</span>.
          Previously <span className="text-ink-800">Leapfrog Technology</span>.
          Around <span className="text-ink-800">eight years</span> on React.
        </p>
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
