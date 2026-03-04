import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useGetMenuItems } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "../backend.d";

// Fallback local menu data
const LOCAL_MENU: MenuItem[] = [
  // Starters
  {
    id: 1n,
    name: "Mushroom Manchurian",
    category: "Starters",
    price: 170,
    description: "Crispy mushrooms in tangy Manchurian sauce",
    isAvailable: true,
  },
  {
    id: 2n,
    name: "Mushroom 65",
    category: "Starters",
    price: 165,
    description: "Spiced and fried mushrooms South Indian style",
    isAvailable: true,
  },
  {
    id: 3n,
    name: "Babycorn Manchurian",
    category: "Starters",
    price: 170,
    description: "Tender babycorn in rich Manchurian gravy",
    isAvailable: true,
  },
  {
    id: 4n,
    name: "Babycorn 65",
    category: "Starters",
    price: 160,
    description: "Crispy babycorn with aromatic spices",
    isAvailable: true,
  },
  {
    id: 5n,
    name: "Gobhi 65",
    category: "Starters",
    price: 159,
    description: "Golden fried cauliflower with bold spices",
    isAvailable: true,
  },
  {
    id: 6n,
    name: "Gobhi Manchurian",
    category: "Starters",
    price: 150,
    description: "Cauliflower florets in savory Manchurian sauce",
    isAvailable: true,
  },
  {
    id: 7n,
    name: "Paneer Manchurian",
    category: "Starters",
    price: 230,
    description: "Cottage cheese cubes in spicy Manchurian sauce",
    isAvailable: true,
  },
  {
    id: 8n,
    name: "Finger Chips",
    category: "Starters",
    price: 140,
    description: "Crispy golden potato fingers with seasoning",
    isAvailable: true,
  },
  {
    id: 9n,
    name: "Paneer 65",
    category: "Starters",
    price: 220,
    description: "Marinated and fried paneer with vibrant spices",
    isAvailable: true,
  },
  // Main Course
  {
    id: 10n,
    name: "A2 Special Curry",
    category: "Main Course",
    price: 199,
    description: "Our signature house curry with fresh vegetables",
    isAvailable: true,
  },
  {
    id: 11n,
    name: "Veg Kofta",
    category: "Main Course",
    price: 189,
    description: "Soft vegetable dumplings in rich tomato gravy",
    isAvailable: true,
  },
  {
    id: 12n,
    name: "Kaju Paneer Mix",
    category: "Main Course",
    price: 189,
    description: "Cashews and paneer in aromatic masala",
    isAvailable: true,
  },
  {
    id: 13n,
    name: "Paneer Bhurji",
    category: "Main Course",
    price: 190,
    description: "Crumbled spiced paneer with onions and tomatoes",
    isAvailable: true,
  },
  {
    id: 14n,
    name: "Kaju Mushroom Masala",
    category: "Main Course",
    price: 189,
    description: "Mushrooms and cashews in flavorful masala",
    isAvailable: true,
  },
  {
    id: 15n,
    name: "Paneer Kadhai",
    category: "Main Course",
    price: 189,
    description: "Paneer cooked in traditional kadhai style",
    isAvailable: true,
  },
  {
    id: 16n,
    name: "Shahi Paneer",
    category: "Main Course",
    price: 189,
    description: "Paneer in rich royal cream and cashew gravy",
    isAvailable: true,
  },
  {
    id: 17n,
    name: "Palak Paneer",
    category: "Main Course",
    price: 159,
    description: "Paneer cubes in smooth spinach gravy",
    isAvailable: true,
  },
  {
    id: 18n,
    name: "Kaju Korma",
    category: "Main Course",
    price: 179,
    description: "Cashews in mildly spiced korma sauce",
    isAvailable: true,
  },
  {
    id: 19n,
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 179,
    description: "Classic paneer in buttery tomato-cashew gravy",
    isAvailable: true,
  },
  {
    id: 20n,
    name: "Dal Methi",
    category: "Main Course",
    price: 149,
    description: "Lentils cooked with fresh fenugreek leaves",
    isAvailable: true,
  },
  {
    id: 21n,
    name: "Methi Masala",
    category: "Main Course",
    price: 159,
    description: "Fenugreek-flavored vegetable masala",
    isAvailable: true,
  },
  {
    id: 22n,
    name: "Malai Kofta",
    category: "Main Course",
    price: 170,
    description: "Creamy paneer koftas in luscious Mughlai gravy",
    isAvailable: true,
  },
  // Breads
  {
    id: 23n,
    name: "Tandoori Roti",
    category: "Breads",
    price: 20,
    description: "Whole wheat bread baked in clay tandoor",
    isAvailable: true,
  },
  {
    id: 24n,
    name: "Plain Naan",
    category: "Breads",
    price: 30,
    description: "Soft leavened flatbread from tandoor",
    isAvailable: true,
  },
  {
    id: 25n,
    name: "Butter Roti",
    category: "Breads",
    price: 30,
    description: "Whole wheat roti with fresh butter",
    isAvailable: true,
  },
  {
    id: 26n,
    name: "Butter Naan",
    category: "Breads",
    price: 35,
    description: "Fluffy naan brushed with golden butter",
    isAvailable: true,
  },
  {
    id: 27n,
    name: "Special Roti",
    category: "Breads",
    price: 30,
    description: "Chef's special seasoned roti",
    isAvailable: true,
  },
  {
    id: 28n,
    name: "Double Roast Roti",
    category: "Breads",
    price: 20,
    description: "Crispy double-roasted wheat bread",
    isAvailable: true,
  },
  {
    id: 29n,
    name: "Kulcha",
    category: "Breads",
    price: 40,
    description: "Soft leavened bread with savory stuffing",
    isAvailable: true,
  },
  {
    id: 30n,
    name: "Butter Kulcha",
    category: "Breads",
    price: 45,
    description: "Kulcha generously topped with fresh butter",
    isAvailable: true,
  },
  // Rice and Biryani
  {
    id: 31n,
    name: "Hyderabadi Veg Biryani",
    category: "Rice and Biryani",
    price: 199,
    description:
      "Aromatic long-grain rice with veggies in Hyderabadi dum style",
    isAvailable: true,
  },
  {
    id: 32n,
    name: "Mix Veg Biryani",
    category: "Rice and Biryani",
    price: 189,
    description: "Fragrant biryani with seasonal mixed vegetables",
    isAvailable: true,
  },
  {
    id: 33n,
    name: "Dal Khichdi",
    category: "Rice and Biryani",
    price: 170,
    description: "Comforting rice and lentil porridge",
    isAvailable: true,
  },
  {
    id: 34n,
    name: "Green Peas Pulao",
    category: "Rice and Biryani",
    price: 140,
    description: "Fragrant rice cooked with green peas",
    isAvailable: true,
  },
  {
    id: 35n,
    name: "Kantilal Rice",
    category: "Rice and Biryani",
    price: 170,
    description: "Special rice preparation house style",
    isAvailable: true,
  },
  {
    id: 36n,
    name: "White Rice",
    category: "Rice and Biryani",
    price: 50,
    description: "Steamed basmati rice",
    isAvailable: true,
  },
  {
    id: 37n,
    name: "Jeera Rice",
    category: "Rice and Biryani",
    price: 80,
    description: "Fragrant cumin-seasoned basmati rice",
    isAvailable: true,
  },
  {
    id: 38n,
    name: "Masala Rice",
    category: "Rice and Biryani",
    price: 110,
    description: "Spiced rice with aromatic whole spices",
    isAvailable: true,
  },
  {
    id: 39n,
    name: "Tomato Rice",
    category: "Rice and Biryani",
    price: 100,
    description: "Tangy and flavorful tomato-infused rice",
    isAvailable: true,
  },
  // Fried Rice
  {
    id: 40n,
    name: "Kaju Fried Rice",
    category: "Fried Rice",
    price: 179,
    description: "Stir-fried rice with cashews and vegetables",
    isAvailable: true,
  },
  {
    id: 41n,
    name: "Veg Fried Rice",
    category: "Fried Rice",
    price: 150,
    description: "Classic Indo-Chinese vegetable fried rice",
    isAvailable: true,
  },
  // Accompaniments
  {
    id: 42n,
    name: "Roast Papad",
    category: "Accompaniments",
    price: 30,
    description: "Crispy roasted lentil wafer",
    isAvailable: true,
  },
  {
    id: 43n,
    name: "Fry Papad",
    category: "Accompaniments",
    price: 30,
    description: "Deep-fried crispy papad",
    isAvailable: true,
  },
  {
    id: 44n,
    name: "Tomato Chutney",
    category: "Accompaniments",
    price: 139,
    description: "Fresh tangy tomato chutney",
    isAvailable: true,
  },
  {
    id: 45n,
    name: "Curd",
    category: "Accompaniments",
    price: 20,
    description: "Fresh homestyle curd",
    isAvailable: true,
  },
  // Drinks
  {
    id: 46n,
    name: "Cool Beverage",
    category: "Drinks",
    price: 25,
    description: "Refreshing chilled beverage",
    isAvailable: true,
  },
  // Meals
  {
    id: 47n,
    name: "North Indian Veg Thali",
    category: "Meals",
    price: 219,
    description:
      "Serves 1 — 2 Tandoori Roti + Paneer Butter Masala + Mix Veg Curry + Jeera Rice",
    isAvailable: true,
  },
  {
    id: 48n,
    name: "North Indian Special Thali",
    category: "Meals",
    price: 249,
    description:
      "Serves 1 — 2 Butter Kulcha + Kaju Paneer Mix + Mix Veg Curry + Masala Rice",
    isAvailable: true,
  },
];

const CATEGORY_ORDER = [
  "Meals",
  "Starters",
  "Main Course",
  "Breads",
  "Rice and Biryani",
  "Fried Rice",
  "Accompaniments",
  "Drinks",
];

function MenuItemCard({
  item,
  index,
}: {
  item: MenuItem;
  index: number;
}) {
  const { addItem, items } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const inCart = cartItem ? cartItem.quantity : 0;

  return (
    <div
      data-ocid={`menu.item.${index + 1}`}
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className="w-3 h-3 rounded-sm border-2 border-secondary flex items-center justify-center shrink-0"
              title="Vegetarian"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
            <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
              {item.name}
            </h3>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
        <span className="font-bold text-primary text-sm shrink-0">
          ₹{item.price}
        </span>
      </div>
      <div className="flex items-center justify-end gap-2 mt-1">
        {inCart > 0 && (
          <Badge variant="secondary" className="text-xs">
            {inCart} in cart
          </Badge>
        )}
        <Button
          size="sm"
          className="h-8 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          onClick={() =>
            addItem({ id: item.id, name: item.name, price: item.price })
          }
          data-ocid={`menu.add_button.${index + 1}`}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { data: backendItems, isLoading } = useGetMenuItems();
  const menuItems =
    backendItems && backendItems.length > 0 ? backendItems : LOCAL_MENU;

  const categories = CATEGORY_ORDER.filter((cat) =>
    menuItems.some((item) => item.category === cat),
  );

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "");

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Our Menu
          </h1>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-3" />
          <p className="text-muted-foreground">
            Pure vegetarian delights crafted with love
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid="menu.tab"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card border border-border text-foreground/70 hover:text-primary hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="menu.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, idx) => (
              <MenuItemCard key={item.id.toString()} item={item} index={idx} />
            ))}
          </div>
        )}

        {/* View Cart prompt */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-sm mb-3">
            Added items to cart?
          </p>
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/order">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart & Checkout
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
