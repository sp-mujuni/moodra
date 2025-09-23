import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MUSIC_DIR = path.join(process.cwd(), 'public/music');

export async function GET(req: Request, { params }: { params: { playlist: string } }) {
  const { playlist } = params;
  const dir = path.join(MUSIC_DIR, playlist);
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }
  const songs = fs.readdirSync(dir).filter(f => f.endsWith('.mp3'));
  return NextResponse.json(songs);
}
