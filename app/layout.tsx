import "./globals.css";
import type { Metadata } from "next";
import { PlayerProvider } from "@/components/PlayerContext";
import NowPlayingBar from "@/components/NowPlayingBar";

export const metadata: Metadata = {
  title: "My MP3 Player",
  description: "A sleek personal music player",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        <PlayerProvider>
          {children}
          <NowPlayingBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
