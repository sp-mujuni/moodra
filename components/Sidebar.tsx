"use client";

import {
  Music,
  Library,
  Disc3,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { usePlaylist } from "./PlaylistContext";
import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const { playlists, activePlaylist, setActivePlaylist, loading } =
    usePlaylist();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();

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
        } left-0 top-0 z-50 bg-neutral-900 min-h-screen flex flex-col border-r border-neutral-800 overflow-y-auto transition-all duration-300 ease-in-out ${
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
          className={`flex-1 flex flex-col gap-6 px-4 md:px-6 pb-6 transition-all duration-300 ${
            isCollapsed && !isMobile
              ? "opacity-0 invisible h-0 overflow-hidden"
              : "opacity-100 visible"
          }`}
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Library className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Your Library</span>
            </h2>

            {loading ? (
              <div className="flex items-center gap-2 text-gray-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>Loading playlists...</span>
              </div>
            ) : (
              <div className="space-y-1">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.name}
                    onClick={() => {
                      setActivePlaylist(playlist);
                      if (isMobile) toggleSidebar();
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover:bg-neutral-800 ${
                      activePlaylist?.name === playlist.name
                        ? "bg-neutral-800 text-green-400 border-l-2 border-green-500"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Disc3 className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate capitalize">
                        {playlist.name.replace(/[-_]/g, " ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {playlist.tracks.length}{" "}
                        {playlist.tracks.length === 1 ? "song" : "songs"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
