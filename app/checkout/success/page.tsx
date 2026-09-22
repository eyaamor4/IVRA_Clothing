import ClearCartOnMount from "@/components/checkout/ClearCartOnMount";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Commande confirmée" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">
      <ClearCartOnMount />
      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">Merci pour votre commande !</h1>
      {id && (
        <p className="text-muted-foreground mb-2">
          Numéro de commande : <strong className="text-foreground">{id}</strong>
        </p>
      )}
      <p className="text-muted-foreground mb-8">
        Nous vous contacterons bientôt par téléphone pour confirmer la
        livraison. Vous payez en espèces au livreur à la réception.
      </p>
      <Button asChild size="lg">
        <Link href="/">Continuer mes achats</Link>
      </Button>
    </div>
  );
}