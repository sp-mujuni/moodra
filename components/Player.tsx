"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function Player({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(audioRef.current!.currentTime / audioRef.current!.duration * 100);
    });
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => audioRef.current && (audioRef.current.currentTime = 0)}
        >
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
        <Button variant="ghost" size="icon" disabled>
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>
      <Slider
        value={[progress]}
        max={100}
        step={1}
        className="w-full"
        onValueChange={(val) => {
          if (audioRef.current) {
            audioRef.current.currentTime =
              (val[0] / 100) * audioRef.current.duration;
          }
        }}
      />
    </div>
  );
}
