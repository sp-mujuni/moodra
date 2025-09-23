"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";

type RepeatMode = "off" | "one" | "all";

type PlayerContextType = {
  queue: string[];
  currentIndex: number;
  src: string | null;
  loadQueue: (tracks: string[], startIndex?: number) => void;
  playTrack: (trackSrc: string, index?: number) => void;
  playing: boolean;
  togglePlay: () => void;
  progress: number;
  seek: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  repeat: RepeatMode;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [src, setSrc] = useState<string | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");

  // Setup new track
  useEffect(() => {
    if (src) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;

      audioRef.current.addEventListener("timeupdate", () => {
        setProgress(
          (audioRef.current!.currentTime / audioRef.current!.duration) * 100
        );
      });

      audioRef.current.addEventListener("ended", handleTrackEnd);

      if (playing) {
        audioRef.current.play();
      }
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener("ended", handleTrackEnd);
      audioRef.current = null;
    };
  }, [src]);

  // Handle track end
  const handleTrackEnd = () => {
    if (repeat === "one") {
      audioRef.current!.currentTime = 0;
      audioRef.current!.play();
    } else {
      nextTrack();
    }
  };

  // Load full queue
  const loadQueue = (tracks: string[], startIndex: number = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    playTrack(tracks[startIndex], startIndex);
  };

  const playTrack = (trackSrc: string, index?: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (index !== undefined) {
      setCurrentIndex(index);
    }
    setSrc(trackSrc);
    setPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const seek = (val: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime =
        (val / 100) * audioRef.current.duration;
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleShuffle = () => setShuffle((prev) => !prev);

  const toggleRepeat = () => {
    setRepeat((prev) =>
      prev === "off" ? "one" : prev === "one" ? "all" : "off"
    );
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    let nextIndex: number;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === "all") {
          nextIndex = 0;
        } else {
          setPlaying(false);
          return;
        }
      }
    }

    setCurrentIndex(nextIndex);
    playTrack(queue[nextIndex], nextIndex);
  };

  const prevTrack = () => {
    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeat === "all") {
        prevIndex = queue.length - 1;
      } else {
        return;
      }
    }

    setCurrentIndex(prevIndex);
    playTrack(queue[prevIndex], prevIndex);
  };

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentIndex,
        src,
        loadQueue,
        playTrack,
        playing,
        togglePlay,
        progress,
        seek,
        volume,
        setVolume,
        shuffle,
        toggleShuffle,
        repeat,
        toggleRepeat,
        nextTrack,
        prevTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be inside PlayerProvider");
  return ctx;
}
