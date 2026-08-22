"use client";

import { usePlayer } from "./PlayerContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Play, Music2, PlayCircle } from "lucide-react";

interface PlaylistData {
  name: string;
  tracks: string[];
}

export default function Playlist({ playlist }: { playlist: PlaylistData }) {
  const { /* playTrack */ loadQueue, src } = usePlayer();

  const formatTrackName = (track: string) => {
    return track
      .replace(".mp3", "")
      .replace(/^y2mate--/, "") // Remove y2mate prefix if present
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize first letter of each word
  };

  const handlePlayAll = () => {
    const allTracks = playlist.tracks.map(
      (track: string) => `/music/${playlist.name}/${track}`
    );
    loadQueue(allTracks, 0);
  };

  const handlePlayTrack = (trackSrc: string) => {
    const allTracks = playlist.tracks.map(
      (track: string) => `/music/${playlist.name}/${track}`
    );
    const trackIndex = allTracks.indexOf(trackSrc);
    loadQueue(allTracks, trackIndex);
  };

  return (
    <Card className="bg-neutral-900/50 border-neutral-700 backdrop-blur-sm">
      {playlist.tracks.length > 0 && (
        <CardHeader className="pb-2 md:pb-4 px-4 md:px-6">
          <button
            onClick={handlePlayAll}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 w-fit text-sm md:text-base"
          >
            <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
            Play All
          </button>
        </CardHeader>
      )}
      <CardContent className="p-0 pb-20 md:pb-24">
        <div className="space-y-0">
          {playlist.tracks.map((track: string, index: number) => {
            const trackSrc = `/music/${playlist.name}/${track}`;
            const isCurrentlyPlaying = src === trackSrc;
            const formattedName = formatTrackName(track);

            return (
              <div
                key={track}
                className={`flex items-center group p-3 md:p-4 transition-all duration-200 hover:bg-neutral-800/60 border-b border-neutral-800 last:border-b-0 ${
                  isCurrentlyPlaying
                    ? "bg-green-500/10 border-green-500/20"
                    : ""
                }`}
              >
                {/* Track number */}
                <div className="w-6 md:w-8 text-center text-gray-400 text-xs md:text-sm font-mono mr-2 md:mr-4 flex-shrink-0">
                  {index + 1}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0 flex items-center gap-2 md:gap-3">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                      isCurrentlyPlaying ? "bg-green-500/20" : "bg-neutral-800"
                    }`}
                  >
                    <Music2
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        isCurrentlyPlaying ? "text-green-400" : "text-gray-400"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-medium truncate leading-5 text-sm md:text-base ${
                        isCurrentlyPlaying ? "text-green-400" : "text-white"
                      }`}
                    >
                      {formattedName}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 mt-1 hidden md:block">
                      {playlist.name
                        .replace(/[-_]/g, " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </p>
                  </div>
                </div>

                {/* Play button */}
                <button
                  type="button"
                  aria-label={`Play ${formattedName}`}
                  title={`Play ${formattedName}`}
                  className={`p-1.5 md:p-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                    isCurrentlyPlaying
                      ? "opacity-100 bg-green-500 text-white hover:bg-green-600"
                      : "opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-neutral-700 text-white hover:bg-neutral-600 hover:scale-105"
                  }`}
                  onClick={() => handlePlayTrack(trackSrc)}
                >
                  <Play
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      isCurrentlyPlaying ? "" : "ml-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {playlist.tracks.length === 0 && (
          <div className="text-center py-12">
            <Music2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">This playlist is empty</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
