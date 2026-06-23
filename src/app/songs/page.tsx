import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { songs, channelUrl, channelName } from "@/data/songs";
import SongRow from "@/components/SongRow";

const ThreeVinyl = dynamic(() => import("@/components/ThreeVinyl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[340px] rounded-2xl bg-cream-50 border border-cream-200 animate-pulse flex items-center justify-center font-mono text-xs text-ink-400">
      Loading 3D Player...
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Songs",
  description: "Explore bilingual songwriting catalog of Anuj Shrestha featuring Nepali, Hindi, and English songs with themes of storytelling and social justice.",
};

export default function SongsPage() {
  const shipped = songs.filter((s) => s.status === "shipped");

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-4xl tracking-tight text-ink-900">Songs</h1>
        <p className="text-ink-600 mt-2 max-w-prose leading-relaxed">
          I&apos;ve written 12+ songs across Nepali, Hindi, and English. Themes: love, longing,
          self-reliance, social justice, bilingual storytelling.
        </p>
        <div className="mt-4 text-sm">
          <Link
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terra-600 hover:text-terra-700"
          >
            youtube.com/@{channelName} ↗
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-6 border-t border-cream-300/60">
          {shipped.map((s) => (
            <SongRow key={s.title} s={s} />
          ))}
        </div>
        <div className="md:col-span-6 md:sticky md:top-6">
          <ThreeVinyl />
        </div>
      </div>
    </div>
  );
}
