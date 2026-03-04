import type { Booking, Order } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarRange,
  ClipboardList,
  Loader2,
  LogOut,
  ShieldAlert,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-IN");
}

function sortByTimestampDesc<T extends { timestamp: bigint }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    b.timestamp > a.timestamp ? 1 : b.timestamp < a.timestamp ? -1 : 0,
  );
}

// ── Status Badges ─────────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
    confirmed:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
    ready:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        variants[status] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
    confirmed:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
    cancelled:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        variants[status] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

const SKELETON_COL_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

function TableSkeleton({ cols }: { cols: number }) {
  const colKeys = SKELETON_COL_KEYS.slice(0, cols);
  return (
    <>
      {(["row1", "row2", "row3"] as const).map((rowKey) => (
        <TableRow key={rowKey}>
          {colKeys.map((colKey) => (
            <TableCell key={colKey}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────

function OrdersTab() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });

  const sorted = orders ? sortByTimestampDesc(orders) : [];

  async function handleStatusChange(id: bigint, status: string) {
    if (!actor) return;
    setUpdatingId(id);
    try {
      await actor.updateOrderStatus(id, status);
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12 font-semibold text-foreground">
              #
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Customer
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Phone
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Items
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Total
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Date / Time
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Status
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton cols={8} />
          ) : sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                <div
                  data-ocid="orders.empty_state"
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                >
                  <ClipboardList className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm font-medium">No orders yet</p>
                  <p className="text-xs mt-1 opacity-70">
                    Orders placed by customers will appear here
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((order, idx) => (
              <TableRow
                key={order.id.toString()}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-muted-foreground text-sm font-mono">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {order.customerName}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {order.phone}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px]">
                  <span className="line-clamp-2">
                    {order.items
                      .map(
                        (item) =>
                          `${item.itemName}${Number(item.quantity) > 1 ? ` ×${item.quantity}` : ""}`,
                      )
                      .join(", ")}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  ₹{order.totalAmount.toFixed(0)}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {formatTimestamp(order.timestamp)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(val) => handleStatusChange(order.id, val)}
                    disabled={updatingId === order.id}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs focus:ring-primary">
                      {updatingId === order.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Bookings Tab ──────────────────────────────────────────────────────────────

function BookingsTab() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });

  const sorted = bookings ? sortByTimestampDesc(bookings) : [];

  async function handleStatusChange(id: bigint, status: string) {
    if (!actor) return;
    setUpdatingId(id);
    try {
      await actor.updateBookingStatus(id, status);
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12 font-semibold text-foreground">
              #
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Customer
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Phone
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Date
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Time
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Guests
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Status
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton cols={8} />
          ) : sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                <div
                  data-ocid="bookings.empty_state"
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                >
                  <CalendarRange className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm font-medium">No bookings yet</p>
                  <p className="text-xs mt-1 opacity-70">
                    Table reservations will appear here
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((booking, idx) => (
              <TableRow
                key={booking.id.toString()}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-muted-foreground text-sm font-mono">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {booking.customerName}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {booking.phone}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {booking.date}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {booking.time}
                </TableCell>
                <TableCell className="text-center text-foreground font-medium">
                  {Number(booking.guestCount)}
                </TableCell>
                <TableCell>
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(val) => handleStatusChange(booking.id, val)}
                    disabled={updatingId === booking.id}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs focus:ring-primary">
                      {updatingId === booking.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSecretParam(name: string): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminCheckError, setAdminCheckError] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Check admin status when actor changes
  useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) {
        setIsAdmin(null);
        return false;
      }
      try {
        const result = await actor.isCallerAdmin();
        setIsAdmin(result);
        return result;
      } catch (err: unknown) {
        // User is not registered at all yet -- try registering with URL token
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("not registered") ||
          msg.includes("Reject") ||
          msg.includes("trapped")
        ) {
          try {
            setIsRegistering(true);
            const token = getSecretParam("caffeineAdminToken");
            await actor._initializeAccessControlWithSecret(token);
            const result = await actor.isCallerAdmin();
            setIsAdmin(result);
            setIsRegistering(false);
            return result;
          } catch {
            setIsRegistering(false);
            setAdminCheckError(true);
            return false;
          }
        }
        setAdminCheckError(true);
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  // ── Initializing ────────────────────────────────────────────────────────────
  if (isInitializing || (identity && isFetching && isAdmin === null)) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm">
            {isRegistering
              ? "Setting up admin access…"
              : "Loading admin panel…"}
          </p>
        </div>
      </main>
    );
  }

  // ── Not Logged In ───────────────────────────────────────────────────────────
  if (!identity) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="w-full max-w-sm shadow-lg border-border">
            <CardHeader className="text-center pb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl text-foreground">
                Admin Login
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Securely access restaurant orders and bookings
              </p>
            </CardHeader>
            <CardContent>
              <Button
                data-ocid="admin.primary_button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={login}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  "Login with Internet Identity"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  // ── Logged In, Admin Check Error ────────────────────────────────────────────
  if (adminCheckError) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <Card
          data-ocid="admin.error_state"
          className="w-full max-w-sm text-center shadow-lg"
        >
          <CardContent className="pt-8 pb-8">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-foreground font-semibold mb-2">
              Could not verify admin access
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              There was an error checking your permissions. Please try again.
            </p>
            <Button
              variant="outline"
              data-ocid="admin.secondary_button"
              onClick={clear}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ── Logged In, Not Admin ────────────────────────────────────────────────────
  if (isAdmin === false) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="w-full max-w-sm shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="font-display text-xl text-foreground">
                Admin Setup Required
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-6 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                To activate your admin account, log out and log back in using
                the special admin link from your Caffeine dashboard.
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>
                  Go to your{" "}
                  <strong className="text-foreground">
                    Caffeine dashboard
                  </strong>
                </li>
                <li>
                  Open your project and copy the{" "}
                  <strong className="text-foreground">Admin Setup Link</strong>
                </li>
                <li>Open that link, then click Admin and log in</li>
              </ol>
              <Button
                data-ocid="admin.secondary_button"
                variant="outline"
                onClick={clear}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout &amp; Try Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  // ── Still checking admin (null = pending) ───────────────────────────────────
  if (isAdmin === null) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">
            {isRegistering ? "Setting up admin access…" : "Verifying access…"}
          </p>
        </div>
      </main>
    );
  }

  // ── Admin Dashboard ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Anandaahar Family Restaurant
            </p>
          </div>
          <Button
            variant="outline"
            data-ocid="admin.secondary_button"
            onClick={clear}
            className="self-start sm:self-auto border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="orders">
          <TabsList className="mb-6 bg-muted/60 border border-border">
            <TabsTrigger
              value="orders"
              data-ocid="admin.orders_tab"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              data-ocid="admin.bookings_tab"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
            >
              <CalendarRange className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  All Orders
                </h2>
                <Badge variant="outline" className="text-xs">
                  Most recent first
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <OrdersTab />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="bookings">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  All Bookings
                </h2>
                <Badge variant="outline" className="text-xs">
                  Most recent first
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <BookingsTab />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
