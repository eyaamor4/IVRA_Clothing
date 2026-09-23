import { isAdmin } from "@/lib/adminAuth";
import ProductForm from "@/components/admin/ProductForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nouveau produit", robots: { index: false, follow: false } };

export default async function NewProductPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Ajouter un produit</h1>
      <ProductForm />
    </div>
  );
}
