"use client";
import { useQuery } from "@tanstack/react-query";

export default function ProductDetails({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      fetch(`https://dummyjson.com/products/${id}`).then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}
