import Sidebar from "@/components/Sidebar";
import Playlist from "@/components/Playlist";

async function getPlaylists() {
  const res = await fetch("http://localhost:3000/api/playlists", {
    cache: "no-store",
  });
  return res.json();
}

export default async function Home() {
  const playlists = await getPlaylists();

  return (
    <main className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">My Music</h1>
        <div className="grid gap-4">
          {playlists.map((pl: any) => (
            <Playlist key={pl.name} playlist={pl} />
          ))}
        </div>
      </div>
    </main>
  );
}
