import { Product } from "@/types/product";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface ProductBreadcrumbProps {
  product: Product;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground mb-6"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>

      <ChevronRight className="h-3.5 w-3.5" />

      <span className="text-foreground font-medium line-clamp-1">
        {product.name}
      </span>
    </nav>
  );
}