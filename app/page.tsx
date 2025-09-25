"use client";

import Sidebar from "@/components/Sidebar";
import Playlist from "@/components/Playlist";
import { usePlaylist } from "@/components/PlaylistContext";
import { useSidebar } from "@/components/SidebarContext";
import { Loader2, Music, Menu, ChevronsDown, ChevronsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/components/PlayerContext";

export default function Home() {
  const { activePlaylist, loading } = usePlaylist();
  const { src } = usePlayer();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();

  // Ref & state for scroll navigation in main content
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToolbar, setShowScrollToolbar] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleAssess = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollToolbar(scrollHeight - clientHeight > 100); // show if overflow > 100px
      setAtTop(scrollTop <= 10);
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    };

    handleAssess();
    el.addEventListener("scroll", handleAssess, { passive: true });
    window.addEventListener("resize", handleAssess);
    return () => {
      el.removeEventListener("scroll", handleAssess);
      window.removeEventListener("resize", handleAssess);
    };
  }, [activePlaylist]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <main className="flex min-h-screen bg-neutral-950">
      <Sidebar />
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto transition-all duration-300 relative ${
          !isMobile && !isCollapsed ? "ml-0" : ""
        }`}
      >
        {/* Mobile header with menu button */}
        {isMobile && (
          <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800 p-4 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-white">
              {activePlaylist
                ? activePlaylist.name.replace(/[-_]/g, " ")
                : "Moodra"}
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        )}

        <div
          className={`p-4 md:p-6 lg:p-8 pb-24 md:pb-28 transition-[padding] duration-300 ${
            src ? "pb-48 md:pb-56" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
                <p className="text-gray-400">Loading your music...</p>
              </div>
            </div>
          ) : activePlaylist ? (
            <div className="space-y-6">
              {!isMobile && (
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl md:text-4xl font-bold text-white capitalize truncate">
                      {activePlaylist.name.replace(/[-_]/g, " ")}
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm md:text-base">
                      {activePlaylist.tracks.length}{" "}
                      {activePlaylist.tracks.length === 1 ? "song" : "songs"}
                    </p>
                  </div>
                </div>
              )}

              <div className="max-w-full">
                <Playlist playlist={activePlaylist} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Music className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-400 mb-2">
                  No playlists found
                </h2>
                <p className="text-sm md:text-base text-gray-500">
                  Add some music to your public/music folder to get started.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Spacer element at bottom to ensure last item not hidden under player (extra safety) */}
        {src && <div className="h-10 md:h-12" />}

        {/* Scroll navigation toolbar (appears when overflow) */}
        {showScrollToolbar && (
          <div className="hidden md:flex flex-col gap-2 items-center rounded-full p-2 bg-neutral-900/70 backdrop-blur border border-neutral-700 shadow-lg fixed right-4 md:right-6 lg:right-8 bottom-32 md:bottom-36 z-40">
            <button
              onClick={scrollToTop}
              disabled={atTop}
              aria-label="Scroll to top"
              className={`p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white ${
                atTop ? "" : "shadow-inner"
              }`}
            >
              <ChevronsUp className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-neutral-700" />
            <button
              onClick={scrollToBottom}
              disabled={atBottom}
              aria-label="Scroll to bottom"
              className={`p-2 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-neutral-800 hover:bg-neutral-700 text-gray-300 hover:text-white ${
                atBottom ? "" : "shadow-inner"
              }`}
            >
              <ChevronsDown className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
