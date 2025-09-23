import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const musicDir = path.join(process.cwd(), "public", "music");
  const folders = fs.readdirSync(musicDir);

  const playlists = folders.map((folder) => {
    const files = fs.readdirSync(path.join(musicDir, folder))
      .filter((f) => f.endsWith(".mp3"));
    return { name: folder, tracks: files };
  });

  return NextResponse.json(playlists);
}
