import { Music, Library } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-900 p-6 min-h-screen flex flex-col gap-6 border-r border-neutral-800">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Music className="w-6 h-6 text-green-500" />
        My Player
      </h1>
      <nav className="flex flex-col gap-4 text-gray-300">
        <a href="/" className="hover:text-white flex items-center gap-2">
          <Library className="w-5 h-5" /> Library
        </a>
      </nav>
    </aside>
  );
}
