import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, UtensilsCrossed } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-background">
                Anandaahar
              </span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              A warm family restaurant serving pure vegetarian cuisine with love
              and tradition.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {[
                { to: "/", label: "Home" },
                { to: "/menu", label: "Menu" },
                { to: "/order", label: "Order Online" },
                { to: "/book", label: "Book a Table" },
                { to: "/location", label: "Location" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>
                  Lalgiri Cross, S.B. Temple Rd,
                  <br />
                  Kalyan Nagar, Kalaburagi,
                  <br />
                  Karnataka – 585103
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a
                  href="tel:+919591957447"
                  className="hover:text-primary transition-colors"
                >
                  +91 95919 57447
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>
                  Morning: Open – 4:30 PM
                  <br />
                  Evening: 7:00 PM – 10:30 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/50">
          <span>
            © {year} Anandaahar Family Restaurant. All rights reserved.
          </span>
          <span>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
        <div className="mt-3 text-center">
          <Link
            to="/admin"
            data-ocid="footer.admin_link"
            className="text-xs text-background/30 hover:text-background/60 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
