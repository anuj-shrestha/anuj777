"use client";

import { createContext, useContext, useState } from "react";

type SongPlayerContextType = {
  playing: string | null;
  play: (title: string) => void;
  stop: () => void;
};

const SongPlayerContext = createContext<SongPlayerContextType>({
  playing: null,
  play: () => {},
  stop: () => {},
});

export function useSongPlayer() {
  return useContext(SongPlayerContext);
}

export function SongPlayerProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <SongPlayerContext.Provider value={{ playing, play: setPlaying, stop: () => setPlaying(null) }}>
      {children}
    </SongPlayerContext.Provider>
  );
}
