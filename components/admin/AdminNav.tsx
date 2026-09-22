"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin", label: "Commandes" },
    { href: "/admin/products", label: "Produits" },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-border">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}