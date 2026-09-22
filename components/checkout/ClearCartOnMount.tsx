"use client";

import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

// Vide le panier une fois la commande confirmée.
export default function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}