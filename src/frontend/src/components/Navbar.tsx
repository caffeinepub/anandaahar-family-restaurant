import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingCart, UtensilsCrossed, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home", ocid: "nav.home_link" },
  { to: "/menu", label: "Menu", ocid: "nav.menu_link" },
  { to: "/order", label: "Order", ocid: "nav.order_link" },
  { to: "/book", label: "Book a Table", ocid: "nav.book_link" },
  { to: "/location", label: "Location", ocid: "nav.location_link" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { totalCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <nav className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-foreground leading-tight block">
                Anandaahar
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                Family Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid={link.ocid}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-accent"
                      : "text-foreground/70 hover:text-primary hover:bg-accent/50"
                  }`}
                >
                  {link.label}
                  {link.to === "/order" && totalCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                      {totalCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile: cart count + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {totalCount > 0 && (
              <Link to="/order" className="relative">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground">
                  {totalCount}
                </Badge>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 pt-2 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      data-ocid={link.ocid}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary bg-accent"
                          : "text-foreground/70 hover:text-primary hover:bg-accent/50"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.to === "/order" && totalCount > 0 && (
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                          {totalCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
