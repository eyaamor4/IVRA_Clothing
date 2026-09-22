import { isAdmin } from "@/lib/adminAuth";
import { getProduct } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";
import { notFound, redirect } from "next/navigation";

export const metadata = { title: "Modifier le produit", robots: { index: false, follow: false } };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Modifier « {product.name} »</h1>
      <ProductForm product={product} />
    </div>
  );
}