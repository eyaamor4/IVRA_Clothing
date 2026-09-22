import { isAdmin } from "@/lib/adminAuth";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import AdminNav from "@/components/admin/AdminNav";
import { SIZES } from "@/types/product";


export const metadata = {
  title: "Produits",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { q } = await searchParams;
  const all = await getProducts();

  const query = q?.trim().toLowerCase();
  const products = query
    ? all.filter((p) => p.name.toLowerCase().includes(query))
    : all;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminNav />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Produits ({products.length})</h1>
        <Button asChild>
          <Link href="/admin/products/new">+ Ajouter un produit</Link>
        </Button>
      </div>
      
      {query && (
        <p className="text-sm text-muted-foreground mb-4">
          Résultats pour « {q} »
        </p>
      )}

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative w-full aspect-square bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="font-semibold truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {SIZES.map((s) => `${s}: ${product.stock?.[s] ?? 0}`).join(" · ")}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/admin/products/${product.id}/edit`}>Modifier</Link>
                </Button>
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <p className="text-muted-foreground text-center py-16 col-span-full">
            {query ? "Aucun produit ne correspond à cette recherche." : "Aucun produit."}
          </p>
        )}
      </div>
    </div>
  );
}