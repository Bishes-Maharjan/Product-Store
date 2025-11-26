"use client";

import { Spinner2 } from "@/components/ui/spinner";
import { fetchProducts } from "@/lib/queries";
import { Product } from "@/types/products";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const order = searchParams.get("order") || "asc";
  const sortBy = searchParams.get("sortBy") || "";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["products", query, category, sortBy, order],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        return fetchProducts(pageParam, query, sortBy, order, 20, category);
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.hasMore) return pages.length + 1;
        return undefined;
      },
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <main className="container mx-auto px-4 py-8 bg-background min-h-screen">
      {(query || category) && (
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-card/70 text-muted-foreground px-4 py-2 rounded-xl border border-border shadow-sm">
            {category && (
              <span className="text-sm">
                Category:{" "}
                <strong className="text-foreground">{category}</strong>
              </span>
            )}
            {query && (
              <span className="text-sm">
                Search:{" "}
                <strong className="text-foreground">&quot;{query}&quot;</strong>
              </span>
            )}
          </div>
        </div>
      )}

      <div
        className="grid justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, 220px)",
          gap: "2rem",
        }}
      >
        {data?.pages.map((page) =>
          page.products.map((product: Product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              title={product.description}
            >
              <div className="w-[220px] bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 hover:shadow-xl hover:shadow-foreground/20 hover:-translate-y-2 transition-all duration-300">
                <div className="w-full aspect-square bg-muted overflow-hidden mb-3 flex items-center justify-center border border-border rounded-xl">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-[1.04] "
                  />
                </div>

                <h2 className="text-lg font-semibold text-foreground line-clamp-1">
                  {product.title}
                </h2>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">
                    {product.category.replace(/-/g, " ")}
                  </span>

                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <span>★</span>
                    <span className="text-muted-foreground">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <p className="text-foreground font-bold text-xl">
                    ${product.price}
                  </p>

                  {product.discountPercentage > 0 && (
                    <span className="text-xs bg-red-600/80 text-white px-2 py-1 rounded-lg">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {product.availabilityStatus} ({product.stock})
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {!isLoading && data?.pages[0]?.products.length === 0 && (
        <div className="flex justify-center items-center h-32 text-muted-foreground text-lg">
          No products found.
        </div>
      )}
      <div className="h-80 flex justify-center items-center">
        {isLoading && <Spinner2 className="size-6" />}
      </div>
      <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
        {hasNextPage && <Spinner2 className="size-6" />}
      </div>
    </main>
  );
}
