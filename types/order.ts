export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string; // ex: CMD-20260921-4821
  createdAt: string; // date ISO
  status: OrderStatus;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number; // montant que le livreur doit encaisser
  paymentMethod: "cash_on_delivery";
}