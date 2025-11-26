"use client";

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchCategoryLists } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CategoryDropdown() {
  const [category, setCategory] = React.useState("none");
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryLists,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (category === "none") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`/?${params.toString()}`);

    return;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
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
          <span>
            {category === "none"
              ? "Category"
              : category
                  .split("-")
                  .map((word) => word[0].toUpperCase() + word.slice(1))
                  .join(" ")}
          </span>
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown container */}
      <DropdownMenuContent className="w-56 bg-card border border-border shadow-xl text-foreground">
        <DropdownMenuLabel className="text-muted-foreground">
          Category List
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
          {/* NONE option */}
          <DropdownMenuRadioItem
            value="none"
            className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted"
          >
            None
          </DropdownMenuRadioItem>

          {/* Categories */}
          {data?.map((cat: string) => (
            <DropdownMenuRadioItem
              key={cat}
              value={cat}
              className="cursor-pointer text-foreground hover:bg-muted focus:bg-muted capitalize"
            >
              {cat.split("-").join(" ")}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
