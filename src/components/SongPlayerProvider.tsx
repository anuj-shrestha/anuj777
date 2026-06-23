"use client";

import { createContext, useContext, useState } from "react";

type SongPlayerContextType = {
  playing: string | null;
  hovered: string | null;
  play: (title: string) => void;
  stop: () => void;
  setHovered: (title: string | null) => void;
};

const SongPlayerContext = createContext<SongPlayerContextType>({
  playing: null,
  hovered: null,
  play: () => {},
  stop: () => {},
  setHovered: () => {},
});

export function useSongPlayer() {
  return useContext(SongPlayerContext);
}

export function SongPlayerProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <SongPlayerContext.Provider
      value={{
        playing,
        hovered,
        play: setPlaying,
        stop: () => setPlaying(null),
        setHovered,
      }}
    >
      {children}
    </SongPlayerContext.Provider>
  );
}
