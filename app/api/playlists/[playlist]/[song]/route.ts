import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

const MUSIC_DIR = path.join(process.cwd(), 'public/music');

export async function GET(req: NextRequest, { params }: { params: { playlist: string, song: string } }) {
  const { playlist, song } = params;
  const filePath = path.join(MUSIC_DIR, playlist, song);

  if (!fs.existsSync(filePath)) {
    return new Response('File not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.get('range');

  if (!range) {
    return new Response(fs.readFileSync(filePath), {
      headers: { 'Content-Type': 'audio/mpeg' }
    });
  }

  const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
  const chunkSize = (end - start) + 1;

  const file = fs.createReadStream(filePath, { start, end });
  return new Response(file as any, {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': 'audio/mpeg',
    },
  });
}
