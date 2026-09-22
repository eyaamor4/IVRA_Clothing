"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/config";
import type { Order, OrderStatus } from "@/types/order";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STATUS_LABELS } from "./orderStatus";

const STATUS_ORDER: OrderStatus[] = ["new", "confirmed", "delivered", "cancelled"];

function deliveryText(order: Order): string {
  const lines = [
    `Commande ${order.id}`,
    `Client : ${order.customer.fullName}`,
    `Tél : ${order.customer.phone}`,
    `Adresse : ${order.customer.address}, ${order.customer.city}`,
  ];
  if (order.customer.notes) lines.push(`Remarque : ${order.customer.notes}`);
  lines.push("Articles :");
  
  order.items.forEach((i) => lines.push(`- ${i.name} (${i.size}) × ${i.quantity}`));
  lines.push(`À encaisser : ${formatPrice(order.total)}`);
  return lines.join("\n");
}

export default function OrderActions({ order }: { order: Order }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  async function setStatus(status: OrderStatus) {
    setPending(true);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function copyForDriver() {
    try {
      await navigator.clipboard.writeText(deliveryText(order));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_ORDER.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={order.status === status ? "default" : "outline"}
          disabled={pending || order.status === status}
          onClick={() => setStatus(status)}
        >
          {STATUS_LABELS[status]}
        </Button>
      ))}
      <Button size="sm" variant="secondary" onClick={copyForDriver}>
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1" /> Copié
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" /> Copier pour le livreur
          </>
        )}
      </Button>
    </div>
  );
}