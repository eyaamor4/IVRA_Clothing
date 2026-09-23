import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Suspense } from "react";
import { CartProvider } from "@/context/CartContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IVRA",
  description:
    "IVRA - Découvrez notre collection de vêtements tendance. Commandez en quelques clics, paiement en espèces à la livraison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className}  antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}