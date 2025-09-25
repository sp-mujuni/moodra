"use client";

import {
  Music,
  Library,
  Disc3,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlaylist } from "./PlaylistContext";
import { useSidebar } from "./SidebarContext";
import { usePlayer } from "./PlayerContext";

export default function Sidebar() {
  const { playlists, activePlaylist, setActivePlaylist, loading } = usePlaylist();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const { src } = usePlayer();

  // Scroll nav for playlists when long
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const assess = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowNav(scrollHeight - clientHeight > 80); // threshold
      setAtTop(scrollTop <= 8);
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 8);
    };
    assess();
    el.addEventListener("scroll", assess, { passive: true });
    window.addEventListener("resize", assess);
    return () => {
      el.removeEventListener("scroll", assess);
      window.removeEventListener("resize", assess);
    };
  }, [playlists, isCollapsed]);

  const scrollToTop = () =>
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`${
          isMobile ? "fixed" : "relative"
        } left-0 top-0 z-50 bg-neutral-900 min-h-screen flex flex-col border-r border-neutral-800 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? isMobile
              ? "-translate-x-full"
              : "w-16"
            : "w-64 md:w-72"
        }`}
      >
        {/* Header with toggle button */}
        <div className="p-4 md:p-6 flex items-center justify-between">
          <h1
            className={`font-bold flex items-center gap-2 text-white transition-all duration-300 ${
              isCollapsed && !isMobile
                ? "opacity-0 w-0 overflow-hidden"
                : "text-xl md:text-2xl opacity-100"
            }`}
          >
            <Music className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
            <span className="whitespace-nowrap">Moodra</span>
          </h1>

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMobile ? (
              <X className="w-5 h-5" />
            ) : isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation content - completely hidden when collapsed on desktop/tablet */}
        <nav
          className={`flex-1 flex flex-col gap-6 px-4 md:px-6 pb-6 transition-all duration-300 relative ${
            isCollapsed && !isMobile
              ? "opacity-0 invisible h-0 overflow-hidden"
              : "opacity-100 visible"
          }`}
        >
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Library className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">My Library</span>
            </h2>

            <div
              ref={scrollRef}
              className="space-y-1 overflow-y-auto custom-scrollbar pr-1"
            >
              {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-2">
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>Loading playlists...</span>
                </div>
              ) : playlists.length === 0 ? (
                <p className="text-xs text-gray-500">No playlists found.</p>
              ) : (
                playlists.map((playlist) => {
                  const playlistBasePath = `/music/${playlist.name}/`;
                  const isPlaylistPlaying = src?.startsWith(playlistBasePath);
                  return (
                    <button
                      key={playlist.name}
                      onClick={() => {
                        setActivePlaylist(playlist);
                        if (isMobile) toggleSidebar();
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover:bg-neutral-800 relative ${
                        activePlaylist?.name === playlist.name
                          ? "bg-neutral-800 text-green-400 border-l-2 border-green-500"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      <Disc3 className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate capitalize flex items-center gap-2">
                          {playlist.name.replace(/[-_]/g, " ")}
                          {isPlaylistPlaying && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 tracking-wide">
                              <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                              Now Playing
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {playlist.tracks.length}{" "}
                          {playlist.tracks.length === 1 ? "song" : "songs"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {showNav && !isCollapsed && (
            <div className="absolute right-1 -bottom-1 translate-y-full mb-4 flex flex-col items-center gap-2 bg-neutral-900/80 backdrop-blur px-2 py-2 rounded-full border border-neutral-700 shadow-lg">
              <button
                onClick={scrollToTop}
                disabled={atTop}
                aria-label="Scroll to top"
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronsUp className="w-4 h-4" />
              </button>
              <div className="w-px h-3 bg-neutral-700" />
              <button
                onClick={scrollToBottom}
                disabled={atBottom}
                aria-label="Scroll to bottom"
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronsDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
