"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SIZES } from "@/types/product";
import type { Product } from "@/types/product";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [stock, setStock] = useState<Record<string, string>>(
    Object.fromEntries(SIZES.map((s) => [s, String(product?.stock?.[s] ?? 0)]))
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'upload.");
      setImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const stockPayload = Object.fromEntries(
      SIZES.map((s) => [s, Number(stock[s])])
    );

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            price: Number(price),
            description: description || null,
            image,
            stock: stockPayload,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom du produit *</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Prix (en votre devise) *</label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Photo *</label>
        <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        {uploading && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Upload en cours...
          </p>
        )}
        {image && !uploading && (
          <div className="relative w-32 h-32 mt-2">
            <Image src={image} alt="Aperçu" fill className="object-cover rounded-lg" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Stock par taille *</label>
        <div className="grid grid-cols-4 gap-3">
          {SIZES.map((size) => (
            <div key={size} className="space-y-1">
              <label className="text-xs text-muted-foreground">{size}</label>
              <Input
                type="number"
                min="0"
                value={stock[size]}
                onChange={(e) => setStock((s) => ({ ...s, [size]: e.target.value }))}
                required
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" disabled={saving || uploading || !image}>
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Enregistrement...
          </>
        ) : isEdit ? (
          "Enregistrer les modifications"
        ) : (
          "Créer le produit"
        )}
      </Button>
    </form>
  );
}