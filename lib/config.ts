export const siteConfig = {
  storeName: "Bloom",
  currency: "TND", // change ici la devise affichée partout sur le site
  deliveryFee: 0, // frais de livraison fixes (0 = livraison gratuite)
};

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} ${siteConfig.currency}`;
}