"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer « ${productName} » ? Cette action est irréversible.`)) return;

    setLoading(true);
    const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}