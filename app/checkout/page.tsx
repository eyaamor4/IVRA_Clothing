"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { formatPrice, siteConfig } from "@/lib/config";
import { ArrowLeft, Banknote, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    website: "", // champ piège anti-robots (invisible)
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + siteConfig.deliveryFee;

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map((i) => ({ id: i.id, size: i.size, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue. Réessayez.");
        setLoading(false);
        return;
      }
      router.push(`/checkout/success?id=${encodeURIComponent(data.orderId)}`);
    } catch {
      setError("Connexion impossible. Vérifiez votre internet et réessayez.");
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Button asChild>
          <Link href="/">Voir les produits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" asChild className="mb-6 text-muted-foreground">
        <Link href="/cart" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au panier
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vos coordonnées de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nom et prénom *
                </label>
                <Input
                  id="fullName"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  value={form.fullName}
                  onChange={update("fullName")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Téléphone *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ex : 22 123 456"
                  value={form.phone}
                  onChange={update("phone")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Adresse complète *
                </label>
                <Input
                  id="address"
                  required
                  minLength={5}
                  maxLength={250}
                  autoComplete="street-address"
                  placeholder="Rue, numéro, immeuble, repère..."
                  value={form.address}
                  onChange={update("address")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  Ville *
                </label>
                <Input
                  id="city"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={update("city")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Remarque pour le livreur (facultatif)
                </label>
                <Textarea
                  id="notes"
                  rows={3}
                  maxLength={500}
                  placeholder="Étage, horaires, consignes..."
                  value={form.notes}
                  onChange={update("notes")}
                />
              </div>

              {/* Champ piège : caché aux humains */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update("website")}
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              `Confirmer la commande • ${formatPrice(total)}`
            )}
          </Button>
        </form>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Votre commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="flex justify-between gap-4">
                    <span>
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>
                    {siteConfig.deliveryFee === 0
                      ? "Gratuite"
                      : formatPrice(siteConfig.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total à payer</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-muted p-3 text-sm">
                <Banknote className="h-5 w-5 mt-0.5 shrink-0 text-green-600" />
                <p>
                  <strong>Paiement à la livraison.</strong> Vous payez en
                  espèces au livreur à la réception de votre commande.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}