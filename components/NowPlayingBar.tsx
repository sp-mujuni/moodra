"use client";

import { usePlayer } from "./PlayerContext";
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

  if (!src) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 flex flex-col">
      <div className="flex items-center justify-between">
        {/* Track name */}
        <div className="text-sm text-gray-300 truncate">
          {src.split("/").pop()}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant={shuffle ? "default" : "ghost"}
            size="icon"
            className={shuffle ? "bg-green-500 hover:bg-green-600" : ""}
            onClick={toggleShuffle}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={prevTrack}>
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            className="bg-green-500 hover:bg-green-600"
            onClick={togglePlay}
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={nextTrack}>
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            variant={repeat === "off" ? "ghost" : "default"}
            size="icon"
            className={repeat !== "off" ? "bg-green-500 hover:bg-green-600" : ""}
            onClick={toggleRepeat}
          >
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 w-40">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume(val[0] / 100)}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2">
        <Slider
          value={[progress]}
          max={100}
          step={1}
          onValueChange={(val) => seek(val[0])}
        />
      </div>
    </div>
  );
}
