import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Leaf, Star, Users } from "lucide-react";
import { motion } from "motion/react";

const galleryPhotos = [
  {
    src: "/assets/uploads/unnamed-1--1.jpg",
    alt: "Crispy bhajji with dipping sauce",
    caption: "Crispy Bhajji",
  },
  {
    src: "/assets/uploads/unnamed-2--2.jpg",
    alt: "Mixed starter platter with chutney",
    caption: "Mixed Starters Platter",
  },
  {
    src: "/assets/uploads/unnamed-3.jpg",
    alt: "Golden finger chips",
    caption: "Finger Chips",
  },
];

const highlights = [
  {
    icon: <Leaf className="w-7 h-7" />,
    title: "Pure Vegetarian",
    desc: "100% vegetarian menu crafted from fresh, wholesome ingredients. No compromise on tradition.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Family Friendly",
    desc: "A welcoming space for families to gather, celebrate, and create cherished memories together.",
  },
  {
    icon: <Star className="w-7 h-7" />,
    title: "Authentic Flavors",
    desc: "Time-honored recipes passed through generations, bringing the essence of Indian cooking to your table.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative h-[520px] sm:h-[580px]">
          <img
            src="/assets/generated/hero-banner.dim_1200x500.jpg"
            alt="Anandaahar Restaurant - delicious vegetarian food"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />

          {/* Hero content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-xl"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold tracking-wider uppercase mb-4">
                  Pure Vegetarian
                </span>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
                  Anandaahar
                  <br />
                  <span className="text-primary">Family Restaurant</span>
                </h1>
                <p className="text-white/85 text-lg mb-8 leading-relaxed">
                  A Taste of Tradition, A Feeling of Home
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-semibold"
                    data-ocid="home.primary_button"
                  >
                    <Link to="/menu">
                      View Menu <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-white bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-sm font-semibold"
                    data-ocid="home.secondary_button"
                  >
                    <Link to="/book">Book a Table</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Story
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-6" />
            <p className="text-muted-foreground text-lg leading-relaxed">
              Welcome to Anandaahar — meaning "Food of Happiness" in Sanskrit.
              We are a beloved family restaurant dedicated to serving pure
              vegetarian cuisine with warmth, authenticity, and care. From our
              kitchen to your table, every dish is prepared with love, using
              traditional recipes and fresh local ingredients.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Whether you're dining in with family, ordering online, or
              celebrating a special occasion, Anandaahar promises an experience
              that feels like home.
            </p>
          </motion.div>

          {/* Highlight cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {highlights.map((h) => (
              <motion.div key={h.title} variants={itemVariants}>
                <Card className="text-center p-6 border-border hover:shadow-md transition-shadow duration-300 group">
                  <CardContent className="pt-4 px-0 pb-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {h.icon}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {h.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {h.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              A Glimpse of Anandaahar
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground text-base">
              From our kitchen to your table — pure vegetarian happiness
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {galleryPhotos.map((photo, i) => (
              <motion.div
                key={photo.alt}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl border border-border shadow-sm aspect-[4/3]"
                data-ocid={`gallery.item.${i + 1}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-semibold">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-secondary">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-secondary-foreground mb-3">
              Ready to Order?
            </h2>
            <p className="text-secondary-foreground/80 mb-6 text-lg">
              Browse our full menu and place your order for dine-in or takeaway.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                <Link to="/order">Order Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-secondary-foreground/40 text-secondary-foreground hover:bg-secondary-foreground/10"
              >
                <Link to="/location">Find Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
