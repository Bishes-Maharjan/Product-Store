import { Product } from "@/types/products";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchProducts(
  page = 1,
  search = "",
  sortBy = "",
  order = "asc",
  limit = 20,
  category = ""
) {
  const skip = (page - 1) * limit;

  let url;

  if (category) {
    url = `${BASE_URL}/category/${category}?limit=${limit}&skip=${skip}`;
  } else if (search) {
    url = `${BASE_URL}/search?q=${search}&limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}?limit=${limit}&skip=${skip}`;
  }

  if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();

  let filteredProducts = data.products;
  if (category && search) {
    const searchedProducts = await fetch(
      `${BASE_URL}/search?q=${search}&limit=${limit}&skip=${skip}`
    ).then((res) => res.json());

    const searchedProductIds = new Set(
      searchedProducts.products.map((p: Product) => p.id)
    );

    filteredProducts = data.products.filter((product: Product) =>
      searchedProductIds.has(product.id)
    );
  }

  return {
    ...data,
    products: filteredProducts,
    total: category && search ? filteredProducts.length : data.total,
    hasMore: skip + filteredProducts.length < data.total,
  };
}

export const fetchProductById = async (id: number) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Unknown error");
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};

export const fetchCategoryLists = async () => {
  try {
    const res = await fetch(`${BASE_URL}/category-list`);
    const data = await res.json();

    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Unknown error");
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
};
