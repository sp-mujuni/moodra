import "./globals.css";
import type { Metadata } from "next";
import { PlayerProvider } from "@/components/PlayerContext";
import { PlaylistProvider } from "@/components/PlaylistContext";
import { SidebarProvider } from "@/components/SidebarContext";
import NowPlayingBar from "@/components/NowPlayingBar";

export const metadata: Metadata = {
  title: "Moodra - Your Music Player",
  description: "A sleek personal music player for all your moods",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white overflow-x-hidden">
        <SidebarProvider>
          <PlaylistProvider>
            <PlayerProvider>
              {children}
              <NowPlayingBar />
            </PlayerProvider>
          </PlaylistProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
