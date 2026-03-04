import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { usePlaceOrder } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function OrderPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCart();
  const { mutateAsync: placeOrder, isPending, isError } = usePlaceOrder();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState<bigint | null>(null);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (items.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        quantity: BigInt(item.quantity),
        price: item.price,
      }));
      const id = await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        items: orderItems,
      });
      setOrderId(id);
      clearCart();
    } catch {
      // isError from mutation handles display
    }
  };

  // Success state
  if (orderId !== null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          data-ocid="order.success_state"
          className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-md"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-secondary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Order Placed!
          </h2>
          <p className="text-muted-foreground mb-1">
            Your order has been received.
          </p>
          <p className="text-sm font-medium text-primary mb-6">
            Order ID: #{orderId.toString()}
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            We'll prepare your delicious meal shortly. Thank you for choosing
            Anandaahar!
          </p>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
          >
            <Link to="/menu">
              Order More <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-5xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Your Order
          </h1>
          <p className="text-muted-foreground">
            Review your cart and place your order
          </p>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="order.empty_state"
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Browse our menu and add some items!
            </p>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </motion.div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">
                    Cart Items ({items.length})
                  </h2>
                </div>
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id.toString()}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                      data-ocid={`order.item.${idx + 1}`}
                      className="px-5 py-4 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{item.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-foreground text-sm w-16 text-right">
                          ₹{item.price * item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive/70 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="px-5 py-4 bg-muted/30">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h2 className="font-semibold text-foreground mb-4">
                  Customer Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="order-name" className="text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="order-name"
                      data-ocid="order.name_input"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                      className="focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="order-phone" className="text-sm">
                      Phone Number
                    </Label>
                    <Input
                      id="order-phone"
                      data-ocid="order.phone_input"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="tel"
                      className="focus-visible:ring-primary"
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground">
                    <span>Grand Total</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  {formError && (
                    <p
                      data-ocid="order.error_state"
                      className="text-destructive text-sm"
                    >
                      {formError}
                    </p>
                  )}

                  {isError && !formError && (
                    <p
                      data-ocid="order.error_state"
                      className="text-destructive text-sm"
                    >
                      Failed to place order. Please try again.
                    </p>
                  )}

                  {isPending && (
                    <div
                      data-ocid="order.loading_state"
                      className="text-center text-sm text-muted-foreground"
                    >
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Placing your order…
                    </div>
                  )}

                  <Button
                    type="submit"
                    data-ocid="order.submit_button"
                    disabled={isPending || items.length === 0}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
