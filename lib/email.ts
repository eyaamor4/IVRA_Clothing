import { Resend } from "resend";
import { formatPrice } from "@/lib/config";
import type { Order } from "@/types/order";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewOrderEmail(order: Order): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const itemsHtml = order.items
    .map(
      (i) =>
        `<li>${i.name} (${i.size}) × ${i.quantity} — ${formatPrice(i.price * i.quantity)}</li>`
    )
    .join("");

  try {
    await resend.emails.send({
      from: "Commandes <onboarding@resend.dev>",
      to: adminEmail,
      subject: `Nouvelle commande ${order.id} — ${formatPrice(order.total)}`,
      html: `
        <h2>Nouvelle commande : ${order.id}</h2>
        <p><strong>Client :</strong> ${order.customer.fullName}</p>
        <p><strong>Téléphone :</strong> ${order.customer.phone}</p>
        <p><strong>Adresse :</strong> ${order.customer.address}, ${order.customer.city}</p>
        ${order.customer.notes ? `<p><strong>Remarque :</strong> ${order.customer.notes}</p>` : ""}
        <h3>Articles</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Total à encaisser : ${formatPrice(order.total)}</strong></p>
      `,
    });
  } catch (err) {
    // On ne bloque jamais la commande si l'email échoue.
    console.error("Erreur d'envoi de l'email de notification :", err);
  }
}