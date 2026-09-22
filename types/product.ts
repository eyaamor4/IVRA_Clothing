export type Size = "S" | "M" | "L" | "XL";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string | null;
  stock: Record<Size, number>;
  created_at?: string;
}

export const SIZES: Size[] = ["S", "M", "L", "XL"];