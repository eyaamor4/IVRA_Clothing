"use client";

import { cn } from "@/lib/utils";
import { SIZES } from "@/types/product";

export default function SizeSelector({
  stock,
  selected,
  onSelect,
}: {
  stock: Record<string, number>;
  selected: string | null;
  onSelect: (size: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground block">Taille</label>
      <div className="flex gap-2">
        {SIZES.map((size) => {
          const qty = stock?.[size] ?? 0;
          const outOfStock = qty <= 0;
          return (
            <button
              key={size}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(size)}
              className={cn(
                "h-11 w-11 rounded-md border text-sm font-medium transition-colors",
                outOfStock &&
                  "cursor-not-allowed opacity-40 line-through border-border",
                !outOfStock && selected === size &&
                  "border-primary bg-primary text-primary-foreground",
                !outOfStock && selected !== size &&
                  "border-border hover:border-primary"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
      {selected && stock?.[selected] > 0 && stock[selected] <= 3 && (
        <p className="text-xs text-amber-600">
          Plus que {stock[selected]} en stock
        </p>
      )}
    </div>
  );
}
