"use client";

import { usePlayer } from "./PlayerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function Playlist({ playlist }: { playlist: any }) {
  const { playTrack } = usePlayer();

  return (
    <Card className="bg-neutral-800 border-none hover:bg-neutral-750 transition">
      <CardHeader>
        <CardTitle className="text-lg">{playlist.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {playlist.tracks.map((track: string) => {
            const src = `/music/${playlist.name}/${track}`;
            return (
              <li
                key={track}
                className="flex items-center justify-between text-sm text-gray-300 hover:text-white"
              >
                <span>{track.replace(".mp3", "")}</span>
                <button
                  type="button"
                  aria-label={`Play ${track.replace(".mp3", "")}`}
                  title={`Play ${track.replace(".mp3", "")}`}
                  className="text-green-400 hover:text-green-500"
                  onClick={() => playTrack(src)}
                >
                  <Play className="w-4 h-4" />
                  <span className="sr-only">Play {track.replace(".mp3", "")}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
