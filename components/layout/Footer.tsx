"use client";

import { Banknote, Heart, Instagram, Mail, MapPin, Phone, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const socialLinks = [
  { href: "https://www.instagram.com/ivraclothing/", icon: Instagram, label: "Instagram" },
];

const footerSections = [
  {
    title: "Boutique",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/cart", label: "Mon panier" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-border">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Livraison à domicile</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-primary" />
              <span>Paiement à la livraison</span>
            </div>
          </div>
        </div>

        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
            <div className="lg:col-span-3">
              <Link
                className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
                href="/"
                aria-label="IVRA - Accueil"
              >
                IVRA
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm mt-2">
                Découvrez notre collection et commandez en quelques clics.
                Paiement en espèces à la livraison.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+21628733815" className="hover:text-foreground transition-colors">
                    +216 28 733 815
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:ivraclothing@gmail.com" className="hover:text-foreground transition-colors">
                    ivraclothing@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Tunis, Tunisie</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-10 w-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-1">
                <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

       <div className="py-6 flex items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2026 IVRA. Fait avec</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}