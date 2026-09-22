"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = query
    ? products.filter((p) => p.name.toLowerCase().includes(query))
    : products;

  if (loading) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
      {filtered.length > 0 ? (
        filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {query ? "Aucun résultat" : "No products found"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {query
              ? `Aucun produit ne correspond à "${query}"`
              : "Try adjusting your filters or search terms"}
          </p>
        </div>
      )}
    </div>
  );
}