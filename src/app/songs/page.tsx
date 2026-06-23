import type { Metadata } from "next";
import Link from "next/link";
import { songs, channelUrl, channelName } from "@/data/songs";
import SongRow from "@/components/SongRow";

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

      <div className="border-t border-cream-300/60">
        {shipped.map((s) => (
          <SongRow key={s.title} s={s} />
        ))}
      </div>
    </div>
  );
}
