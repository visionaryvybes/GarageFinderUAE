import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-zinc-800 mb-2">404</p>
        <h2 className="text-2xl font-bold text-zinc-100 mb-3">Page not found</h2>
        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white font-medium text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/garages"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            Find Garages
          </Link>
        </div>
      </div>
    </div>
  );
}
