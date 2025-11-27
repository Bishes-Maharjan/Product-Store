import { Home, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-10">
        {/* left: icon */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl border border-border bg-linear-to-br from-indigo-500/10 via-pink-500/10 to-amber-400/10 flex items-center justify-center">
            <SearchX
              className="w-32 h-32 text-muted-foreground/40"
              strokeWidth={1.5}
            />

            {/* subtle accent */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-pink-400/10 blur-xl" />
            <div className="absolute -left-6 -top-8 w-28 h-28 rounded-full bg-indigo-400/10 blur-2xl" />
          </div>
        </div>

        {/* right: text */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <div className="px-6 py-4 rounded-lg border border-border bg-muted/50">
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
              404
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Page not found</p>
          </div>

          <div className="rounded-2xl p-6 bg-muted/50 border border-border shadow-sm w-full">
            <h2 className="text-2xl font-semibold">
              We couldn&apos;t find that page
            </h2>
            <p className="mt-2 text-muted-foreground">
              Looks like the page you&apos;re looking for doesn&apos;t exist. It
              might have been moved or removed.
            </p>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-sm transition"
              >
                <Home className="w-4 h-4" />
                Take me home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
