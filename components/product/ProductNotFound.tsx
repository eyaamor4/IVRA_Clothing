import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <PackageSearch className="h-8 w-8 text-muted-foreground" />
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
        Product not found
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The product you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </p>

      <Button asChild size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}