"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { formatPrice, siteConfig } from "@/lib/config";
import { Banknote, CreditCard, Truck } from "lucide-react";
import Link from "next/link";

export default function OrderSummary() {
  const { cart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = siteConfig.deliveryFee;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Résumé de la commande
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Sous-total ({itemCount} {itemCount === 1 ? "article" : "articles"})
            </span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <Badge variant="secondary" className="text-xs">
                  Gratuite
                </Badge>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href="/checkout" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Commander
          </Link>
        </Button>

        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Banknote className="h-4 w-4 text-green-500" />
            <span>Paiement en espèces à la livraison</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-blue-500" />
            <span>Livraison à domicile</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
