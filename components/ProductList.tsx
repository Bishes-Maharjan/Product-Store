// components/ProductList.tsx
"use client";

import { fetchProductById, fetchProducts } from "@/lib/queries";
import { useCartStore } from "@/store/cartStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Check, Edit, Package, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Spinner } from "./ui/spinner";

interface ProductListProps {
  filterByCart?: boolean;
}

export default function ProductList({
  filterByCart = false,
}: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const order = searchParams.get("order") || "asc";
  const sortBy = searchParams.get("sortBy") || "";

  const [activeProductId, setActiveProductId] = useState<number | null>(null); //The id of the product, card, we are gonna edit = add to card
  const [quantities, setQuantities] = useState<Record<number, number>>({}); // Since all cards are being displayed, we need an object containing id,quanity ad key nd value

  //zustand store
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addItem);
  const removeFromCart = useCartStore((state) => state.removeItem);

  // for cart page = fetch products by their ids
  const cartProductIds = useMemo(
    () => cartItems.map((item) => item.id),
    [cartItems]
  );

  // Fetching products that are in the cartStore
  const { data: cartProductsData, isLoading: isLoadingCartProducts } = useQuery(
    {
      queryKey: ["cart-products", cartProductIds],
      queryFn: async () => {
        if (cartProductIds.length === 0) return [];

        // Fetch all cart products individually
        const promises = cartProductIds.map(async (id) => {
          try {
            const response = await fetchProductById(id);

            return response;
          } catch (error) {
            console.error(`Failed to fetch product ${id}:`, error);
            return null;
          }
        });

        const results = await Promise.all(promises);
        return results.filter((p) => p !== null);
      },
      enabled: filterByCart && cartProductIds.length > 0,
    }
  );

  // for homepage: infinite query
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["products", query, category, sortBy, order],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return fetchProducts(pageParam, query, sortBy, order, 20, category);
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) return pages.length + 1;
      return undefined;
    },
    enabled: !filterByCart, // =only run on homepage
  });

  // display products will hold products respectively, whether it is cart or homepage.
  const displayProducts = useMemo(() => {
    // If we're on the cart page, use the specifically fetched cart products
    if (filterByCart) {
      if (!cartProductsData) return [];

      return cartProductsData.map((product) => {
        const cartItem = cartItems.find((c) => c.id === product.id);
        return {
          ...product,
          inCart: true,
          quantity: cartItem?.quantity || 0,
        };
      });
    }

    // if not cartpage, use the infinite query data for the homepage
    const allProducts = data?.pages.flatMap((page) => page.products) || [];
    return allProducts.map((product) => {
      const cartItem = cartItems.find((c) => c.id === product.id);
      return {
        ...product,
        inCart: !!cartItem,
        quantity: cartItem?.quantity || 0,
      };
    });
  }, [data, cartItems, filterByCart, cartProductsData]);

  // this is the bottom div, used for intersection observer to observe to infinite load
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite load logic = basically when browser sees the loadMoreRef div, it will run fetchNextPage() from the inffinite query
  useEffect(() => {
    if (!hasNextPage || filterByCart) return;

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
  }, [hasNextPage, fetchNextPage, filterByCart]);

  // Add to cart: It adds the products quantity, for whom we want to add to cart
  const handleAddToCart = (productId: number, stock: number) => {
    const quantity = quantities[productId] || 1;
    addToCart({ id: productId }, Math.min(quantity, stock));
    setActiveProductId(null);
    setQuantities((prev) => ({ ...prev, [productId]: 1 })); // now that the quantity is added, we reset
  };

  //Changes the input value and the quantity for the product we are adding to cart
  const handleQuantityChange = (
    productId: number,
    value: number,
    stock: number
  ) => {
    const clampedValue = Math.max(1, Math.min(value, stock)); // to prevent more value than stock
    setQuantities((prev) => ({ ...prev, [productId]: clampedValue }));
  };

  const currentIsLoading = filterByCart ? isLoadingCartProducts : isLoading;

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
        {displayProducts.map((product) => (
          <div key={product.id} className="relative">
            <Link href={`/products/${product.id}`} title={product.description}>
              <div className="w-[220px] bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-foreground/20 transition-all duration-300">
                <div className="p-5 flex flex-col gap-2">
                  <div className="w-full aspect-square bg-muted overflow-hidden mb-3 flex items-center justify-center border border-border rounded-xl">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-[1.04]"
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

                {/* Separator line and cart controls section */}
                <div className="border-t border-border">
                  <div className="p-3" onClick={(e) => e.preventDefault()}>
                    {product.inCart && !filterByCart ? ( //If product is in cart and this is the homepage
                      // Homepage: Show "In Cart" button
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          router.push("/cart");
                        }}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        In Cart ({product.quantity})
                      </button>
                    ) : activeProductId === product.id ? ( // For both homepage and cart , The quantity input and buttons
                      // Edit mode - show quantity input with save/cancel
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">
                            Qty:
                          </span>
                          <input
                            type="number"
                            value={
                              quantities[product.id] || product.quantity || 1
                            }
                            min={1}
                            max={product.stock}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.id,
                                Number(e.target.value),
                                product.stock
                              )
                            }
                            onClick={(e) => e.preventDefault()}
                            className="flex-1 px-2 py-1 text-sm text-center bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              //Adds to cart
                              e.preventDefault();
                              handleAddToCart(product.id, product.stock);
                              toast.success(
                                `Added to Cart \n Quantity: ${
                                  quantities[product.id]
                                }`
                              );
                            }}
                            className="flex-1 px-3 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Confirm
                          </button>
                          <button
                            onClick={(e) => {
                              //sets the activeproductId false = this whole section of input closes
                              e.preventDefault();
                              setActiveProductId(null);
                            }}
                            className="flex-1 px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 text-muted-foreground rounded transition-colors flex items-center justify-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : filterByCart ? (
                      // Edit and Delete button only for cart page
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveProductId(product.id);
                            setQuantities((prev) => ({
                              ...prev,
                              [product.id]: product.quantity,
                            }));
                          }}
                          className="flex-1 px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-md flex items-center justify-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromCart(product.id);
                            toast.success("Removed Successfully");
                          }}
                          className="flex-1 px-3 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow-md flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    ) : (
                      // Finally the homepage button , add to cart, only shown when its homepage and its not in cart
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveProductId(product.id);
                          if (!quantities[product.id]) {
                            setQuantities((prev) => ({
                              ...prev,
                              [product.id]: 1,
                            }));
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>

            {/* Quantity badge - only on cart page, top right */}
            {filterByCart && (
              <div className="absolute top-2 right-2 z-10">
                <div className="text-xs bg-card/90 px-2 py-1 border border-border rounded-lg shadow-sm flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Qty:{" "}
                  <strong className="text-foreground">
                    {product.quantity}
                  </strong>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!currentIsLoading && displayProducts.length === 0 && (
        <div className="flex justify-center items-center h-32 text-muted-foreground text-lg">
          {filterByCart ? "Your cart is empty." : "No products found."}
        </div>
      )}

      <div className="h-80 flex justify-center items-center">
        {currentIsLoading && <Spinner text="Loading ..." />}
      </div>

      {!filterByCart && (
        <div
          ref={loadMoreRef}
          className="h-20 flex justify-center items-center"
        >
          {hasNextPage && <Spinner text="Loading..." />}
        </div>
      )}
    </main>
  );
}
