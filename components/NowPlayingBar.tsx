"use client";

import { useState, useEffect } from "react";
import { usePlayer } from "./PlayerContext";
import { useSidebar } from "./SidebarContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function NowPlayingBar() {
  const {
    queue,
    currentIndex,
    src,
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
  } = usePlayer();

  const { isCollapsed, isMobile } = useSidebar();

  // Mute functionality
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const toggleMute = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      // Mute: save current volume and set to 0
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  // Update mute state when volume changes externally
  useEffect(() => {
    if (volume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume, isMuted]);

  if (!src) return null;

  const formatTrackName = (trackSrc: string) => {
    return (
      trackSrc
        .split("/")
        .pop()
        ?.replace(".mp3", "")
        .replace(/^y2mate--/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase()) || ""
    );
  };

  return (
    <div
      className={`fixed bottom-0 right-0 bg-neutral-900 border-t border-neutral-800 p-3 md:p-4 flex flex-col z-40 transition-all duration-300 ease-in-out ${
        isMobile ? "left-0" : isCollapsed ? "left-16" : "left-64 md:left-72"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Track name */}
        <div className="text-xs md:text-sm text-gray-300 truncate flex-1 min-w-0 pr-4">
          {formatTrackName(src)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          <Button
            variant={shuffle ? "default" : "ghost"}
            size="icon"
            className={`hidden md:flex ${
              shuffle ? "bg-green-500 hover:bg-green-600" : ""
            }`}
            onClick={toggleShuffle}
          >
            <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={prevTrack}
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            className="bg-green-500 hover:bg-green-600 h-10 w-10 md:h-12 md:w-12"
            onClick={togglePlay}
          >
            {playing ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <Button
            variant={repeat === "off" ? "ghost" : "default"}
            size="icon"
            className={`hidden md:flex h-8 w-8 md:h-10 md:w-10 ${
              repeat !== "off" ? "bg-green-500 hover:bg-green-600" : ""
            }`}
            onClick={toggleRepeat}
          >
            <Repeat className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        {/* Spacer for better separation */}
        <div className="hidden md:block w-8 lg:w-12"></div>

        {/* Volume control - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 w-32 lg:w-40">
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-neutral-800 rounded transition-colors flex-shrink-0"
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
            )}
          </button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={(val) => {
              const newVolume = val[0] / 100;
              setVolume(newVolume);
              if (newVolume > 0 && isMuted) {
                setIsMuted(false);
              }
            }}
            className="flex-1 [&>*:first-child]:bg-neutral-600 [&>*:first-child>*]:bg-green-500 [&>*:last-child]:bg-green-500 [&>*:last-child]:border-green-500 [&>*:last-child]:rounded-full [&>*:last-child]:h-4 [&>*:last-child]:w-4"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 md:mt-3">
        <Slider
          value={[progress]}
          max={100}
          step={1}
          onValueChange={(val) => seek(val[0])}
          className="[&>*:first-child]:bg-white [&>*:first-child>*]:bg-green-500 [&>*:last-child]:bg-green-500 [&>*:last-child]:border-green-500 [&>*:last-child]:rounded-full [&>*:last-child]:h-4 [&>*:last-child]:w-4"
        />
      </div>
    </div>
  );
}
