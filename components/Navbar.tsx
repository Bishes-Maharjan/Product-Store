"use client";

import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryDropdown } from "./CategoryDropdown";
import ModeToggle from "./ModeToggle";
import SortByDropdown from "./SortByDropdown";

export default function Navbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    if (pathname !== "/") return;
    const params = new URLSearchParams(searchParams.toString());
    const timeout = setTimeout(() => {
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      router.push(`/?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <nav className="w-full bg-background/90 backdrop-blur-md border-b border-border shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-wide">
            <Link href="/">Product Store</Link>
          </h1>

          {/* Right side - wraps on small screens */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 max-w-full">
            <Link href="/cart" className="flex items-center gap-2">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Cart</span>
            </Link>

            {pathname == "/" && (
              <>
                <CategoryDropdown />

                <SortByDropdown />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-32 sm:w-48 md:w-64 rounded-xl bg-card text-foreground border border-border 
                     px-3 sm:px-4 py-2 text-sm placeholder-muted-foreground 
                     focus:outline-none focus:ring-2 focus:ring-border 
                     transition-all duration-200"
                />
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
