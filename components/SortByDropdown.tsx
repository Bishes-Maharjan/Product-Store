"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownAZ, ArrowUpZA, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function SortByDropdown() {
  const sortByOptions = {
    None: "",
    price: "Price",
    rating: "Rating",
    title: "Title",
    discountPercentage: "Discount",
    stock: "Stock",
    brand: "Brand",
    category: "Category",
  };
  type SortBy = keyof typeof sortByOptions;

  const [sortBy, setSortBy] = React.useState<SortBy>("None");
  const [isOpen, setIsOpen] = React.useState(false);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/") return;

    const params = new URLSearchParams(window.location.search);

    if (!sortBy || sortBy === "None") {
      params.delete("sortBy");
      params.delete("order");
    } else {
      params.set("sortBy", sortBy);
      params.set("order", order);
    }

    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  return (
    <div className="flex items-center gap-2">
      {/* Sort Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors focus:outline-none"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
            <span>{sortBy === "None" ? "Sort" : sortByOptions[sortBy]}</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 bg-card border border-border shadow-xl text-foreground">
          <DropdownMenuLabel className="text-muted-foreground">
            Sort By
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortBy)}
          >
            {Object.entries(sortByOptions).map(([key, value]) => (
              <DropdownMenuRadioItem
                value={key}
                key={key}
                className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted"
              >
                {value === "" ? "None" : value}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Order Toggle with better icons */}
      {sortBy !== "None" && (
        <button
          className="p-2 bg-card hover:bg-muted border border-border rounded transition-colors text-foreground"
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          title={`Sort ${order === "asc" ? "ascending" : "descending"}`}
        >
          {order === "asc" ? (
            <ArrowUpZA className="w-4 h-4" />
          ) : (
            <ArrowDownAZ className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}
