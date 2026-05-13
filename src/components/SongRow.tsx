"use client";

import Link from "next/link";
import type { Song } from "@/data/songs";
import { channelUrl } from "@/data/songs";
import { useSongPlayer } from "@/components/SongPlayerProvider";

function getVideoId(url: string): string | null {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

export default function SongRow({ s }: { s: Song }) {
  const { playing: playingTitle, play, stop } = useSongPlayer();
  const playing = playingTitle === s.title;
  const href = s.url ?? channelUrl;
  const videoId = s.url ? getVideoId(s.url) : null;

  return (
    <div className="py-4 border-b border-cream-300/60">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {videoId && (
            <button
              onClick={() => playing ? stop() : play(s.title)}
              aria-label={playing ? "Stop" : "Play"}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-cream-300 text-terra-600 hover:bg-terra-50 transition-colors shrink-0"
            >
              {playing ? (
                <span className="flex items-end gap-px h-3">
                  {[0, 160, 80].map((delay, i) => (
                    <span
                      key={i}
                      className="w-[3px] h-full bg-terra-600 rounded-sm origin-bottom"
                      style={{ animation: `eq-bar 0.8s ease-in-out ${delay}ms infinite` }}
                    />
                  ))}
                </span>
              ) : (
                <span className="text-xs">▶</span>
              )}
            </button>
          )}
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-lg tracking-tight text-ink-900 hover:text-terra-600 transition-colors no-underline"
          >
            {s.title}
          </Link>
        </div>
        <span className="text-xs text-ink-400 font-mono uppercase tracking-wider">{s.language}</span>
      </div>
      <div className="mt-1 text-sm text-ink-500 pl-10">
        {s.theme}
        {s.about && <span className="text-ink-400"> · {s.about}</span>}
      </div>
      {playing && videoId && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={s.title}
          allow="autoplay"
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
      )}
    </div>
  );
}
