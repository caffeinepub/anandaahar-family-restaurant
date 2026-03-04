import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Leaf, MapPin, Navigation, Phone, Utensils } from "lucide-react";
import { motion } from "motion/react";

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Find Us
          </h1>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-3" />
          <p className="text-muted-foreground">
            Come visit us — we'd love to serve you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Restaurant name, address & phone */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-5">
                Anandaahar Family Restaurant
              </h2>

              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    Address
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Lalgiri Cross, S.B. Temple Rd,
                    <br />
                    Kalyan Nagar, Lalgeri Cross,
                    <br />
                    Kalaburagi, Karnataka – 585103
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">
                    Phone
                  </p>
                  <a
                    href="tel:+919591957447"
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    +91 95919 57447
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Opening Hours
                </h2>
              </div>

              {/* Split-shift hours — all days */}
              <div className="rounded-xl bg-muted/40 border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-accent/40">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    All Days
                  </p>
                </div>
                <div className="divide-y divide-border">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        Morning Session
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      11:00 AM – 4:30 PM
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        Evening Session
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      7:00 PM – 10:30 PM
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Closed between 4:30 PM – 7:00 PM daily
              </p>
            </div>

            {/* Info badges */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">
                About This Restaurant
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  All You Can Eat
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                >
                  <Leaf className="w-3.5 h-3.5" />
                  Vegan Options Available
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border-primary/30 text-primary"
                >
                  ₹1 – ₹200 per person
                </Badge>
              </div>
            </div>

            {/* Directions button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                data-ocid="location.primary_button"
              >
                <a
                  href="https://maps.app.goo.gl/DJWAy23h86enZafq9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10 font-semibold"
                data-ocid="location.secondary_button"
              >
                <a
                  href="https://maps.app.goo.gl/DJWAy23h86enZafq9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Google Maps
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Map column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <div
              className="rounded-2xl overflow-hidden border border-border shadow-sm flex-1"
              data-ocid="location.map_marker"
            >
              <iframe
                src="https://maps.google.com/maps?q=17.3297,76.8224&z=17&output=embed"
                width="100%"
                height="440"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Anandaahar Restaurant Location – Kalaburagi"
              />
            </div>

            {/* How to find us */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-5">
              <h3 className="font-display text-base font-bold text-foreground mb-3">
                How to Reach Us
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">→</span>
                  <span>
                    <strong className="text-foreground">Landmark:</strong> Near
                    S.B. Temple Road, Kalyan Nagar, Kalaburagi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">→</span>
                  <span>
                    <strong className="text-foreground">By Auto/Cab:</strong>{" "}
                    Ask for Lalgiri Cross, Kalyan Nagar — well known locally.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">→</span>
                  <span>
                    <strong className="text-foreground">By Car:</strong> Street
                    parking available near S.B. Temple Road.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">→</span>
                  <span>
                    <strong className="text-foreground">Can't find us?</strong>{" "}
                    Call us at{" "}
                    <a
                      href="tel:+919591957447"
                      className="text-primary font-medium hover:underline"
                    >
                      +91 95919 57447
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
