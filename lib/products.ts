import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types/product";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data as Product[];
}

export async function getProduct(id: number): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? (data as Product) : undefined;
}

export type ProductInput = {
  name: string;
  price: number;
  image: string;
  description: string | null;
  stock: Record<string, number>;
};

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(
  id: number,
  input: ProductInput
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}



export async function uploadProductImage(
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
}
// Réduit le stock d'une taille après une commande.
export async function reserveStock(
  productId: number,
  size: string,
  quantity: number
): Promise<boolean> {
  const product = await getProduct(productId);
  if (!product) return false;

  const current = product.stock?.[size as keyof typeof product.stock] ?? 0;
  if (current < quantity) return false;

  const newStock = { ...product.stock, [size]: current - quantity };

  const { data, error } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

export interface StockAdjustment {
  productId: number;
  size: string;
  quantity: number;
}


export async function adjustStock(
  adjustments: StockAdjustment[],
  direction: 1 | -1
): Promise<void> {
  for (const { productId, size, quantity } of adjustments) {
    const product = await getProduct(productId);
    if (!product) continue;

    const current = product.stock?.[size] ?? 0;
    const next = Math.max(0, current + direction * quantity);
    const nextStock = { ...product.stock, [size]: next };

    const { error } = await supabase
      .from("products")
      .update({ stock: nextStock })
      .eq("id", productId);

    if (error) throw error;
  }
}