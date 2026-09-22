import type { OrderStatus } from "@/types/order";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nouvelle",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  confirmed: "bg-amber-100 text-amber-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};