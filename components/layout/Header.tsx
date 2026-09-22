"use client";

import { useCart } from "@/context/CartContext";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function Header() {
  const { cart } = useCart();
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAdminRoute = pathname.startsWith("/admin");
const isLoginRoute = pathname === "/admin/login";


  // Garde le champ synchronisé avec ?q= existant quand on navigue dans l'admin
  useEffect(() => {
    if (isAdminRoute) {
      setSearchQuery(searchParams.get("q") ?? "");
    }
  }, [isAdminRoute, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const isActivePath = (path: string) => pathname === path;

  const navItems = [{ href: "/contact", label: "Contact" }];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();

    if (isAdminRoute) {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
    }

    setIsSearchOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 lg:space-x-12">
            <Link
  className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
  href="/"
  aria-label="IVRA - Accueil"
>
  IVRA
</Link>

            {!isAdminRoute && (
              <nav
                className="hidden md:flex items-center space-x-1"
                role="navigation"
                aria-label="Main navigation"
              >
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`relative py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(href)
                        ? "bg-orange-100 shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    aria-current={isActivePath(href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

               <div className={`hidden ${isLoginRoute ? "lg:hidden" : "lg:flex"} flex-1 max-w-md mx-8`}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="search"
                placeholder={
                  isAdminRoute
                    ? "Rechercher dans cette liste..."
                    : "Rechercher un produit..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                aria-label="Rechercher"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
                       {!isLoginRoute && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>
            )}

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {!isAdminRoute && (
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>

           {isSearchOpen && !isLoginRoute && (
          <div className="lg:hidden mt-4 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder={
                  isAdminRoute
                    ? "Rechercher dans cette liste..."
                    : "Rechercher un produit..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                aria-label="Rechercher"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        )}

        {isMobileOpen && (
          <nav
            className="md:hidden mt-4 animate-in slide-in-from-top duration-200"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {!isAdminRoute && (
              <div className="flex flex-col space-y-3 pb-4 border-b border-gray-200">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                      isActivePath(href)
                        ? "bg-orange-100"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    aria-current={isActivePath(href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}