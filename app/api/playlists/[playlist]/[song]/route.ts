import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

const MUSIC_DIR = path.join(process.cwd(), "public/music");

// Adjusted signature: Next.js validator expects context.params as a Promise type
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ playlist: string; song: string }> }
) {
  const { playlist, song } = await context.params;
  const filePath = path.join(MUSIC_DIR, playlist, song);

  if (!fs.existsSync(filePath)) {
    return new Response("File not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.get("range");

  if (!range) {
    const data = fs.readFileSync(filePath);
    return new Response(data, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": stat.size.toString(),
      },
    });
  }

  const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
  const chunkSize = end - start + 1;

  const fileStream = fs.createReadStream(filePath, { start, end });
  // Node.js readable stream is acceptable as body; cast to BodyInit using unknown -> BodyInit to avoid 'any'
  return new Response(fileStream as unknown as BodyInit, {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": "audio/mpeg",
    },
  });
}
