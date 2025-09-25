"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Playlist = {
  name: string;
  tracks: string[];
};

type PlaylistContextType = {
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  setActivePlaylist: (playlist: Playlist) => void;
  loading: boolean;
};

const PlaylistContext = createContext<PlaylistContextType | null>(null);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch("/api/playlists");
        const data = await res.json();
        setPlaylists(data);
        // Set first playlist as default active
        if (data.length > 0) {
          setActivePlaylist(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        activePlaylist,
        setActivePlaylist,
        loading,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within a PlaylistProvider");
  }
  return context;
}
