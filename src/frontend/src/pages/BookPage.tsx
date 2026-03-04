import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBooking } from "@/hooks/useQueries";
import { CalendarCheck, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function generateTimeSlots() {
  const slots: string[] = [];
  for (let h = 11; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break;
      const hour = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const min = m === 0 ? "00" : "30";
      slots.push(`${hour}:${min} ${ampm}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();
const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function BookPage() {
  const { mutateAsync: createBooking, isPending, isError } = useCreateBooking();
  const [bookingId, setBookingId] = useState<bigint | null>(null);
  const [formError, setFormError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setFormError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!date) {
      setFormError("Please select a date.");
      return;
    }
    if (!time) {
      setFormError("Please select a time slot.");
      return;
    }
    if (!guests) {
      setFormError("Please select the number of guests.");
      return;
    }

    try {
      const id = await createBooking({
        customerName: name.trim(),
        phone: phone.trim(),
        date,
        time,
        guestCount: BigInt(guests),
      });
      setBookingId(id);
    } catch {
      // handled by isError
    }
  };

  if (bookingId !== null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          data-ocid="book.success_state"
          className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-md"
        >
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-9 h-9 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Table Booked!
          </h2>
          <p className="text-muted-foreground mb-1">
            Your reservation has been confirmed.
          </p>
          <p className="text-sm font-medium text-primary mb-4">
            Booking ID: #{bookingId.toString()}
          </p>
          <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground mb-6 space-y-1 text-left">
            <p>
              <strong className="text-foreground">Name:</strong> {name}
            </p>
            <p>
              <strong className="text-foreground">Date:</strong> {date}
            </p>
            <p>
              <strong className="text-foreground">Time:</strong> {time}
            </p>
            <p>
              <strong className="text-foreground">Guests:</strong> {guests}
            </p>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            We look forward to welcoming you! For any changes, please call us at
            +91 98765 43210.
          </p>
          <Button
            onClick={() => {
              setBookingId(null);
              setName("");
              setPhone("");
              setDate("");
              setTime("");
              setGuests("");
            }}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
          >
            Make Another Booking
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Book a Table
          </h1>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-3" />
          <p className="text-muted-foreground">
            Reserve your spot for a memorable dining experience
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            <p className="font-medium text-foreground mb-0.5">
              Instant Confirmation
            </p>
            <p>
              Your table will be held for 15 minutes after the booked time.
              Please arrive on time. For large groups (10+), call us directly.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="book-name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="book-name"
                  data-ocid="book.name_input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="book-phone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="book-phone"
                  data-ocid="book.phone_input"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="book-date" className="text-sm font-medium">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="book-date"
                  data-ocid="book.date_input"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Time <span className="text-destructive">*</span>
                </Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger
                    data-ocid="book.time_select"
                    className="focus:ring-primary"
                  >
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Number of Guests <span className="text-destructive">*</span>
              </Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger
                  data-ocid="book.guests_select"
                  className="focus:ring-primary"
                >
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {GUEST_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formError && (
              <p
                data-ocid="book.error_state"
                className="text-destructive text-sm"
              >
                {formError}
              </p>
            )}

            {isError && !formError && (
              <p
                data-ocid="book.error_state"
                className="text-destructive text-sm"
              >
                Failed to create booking. Please try again or call us.
              </p>
            )}

            {isPending && (
              <div
                data-ocid="book.loading_state"
                className="text-center text-sm text-muted-foreground"
              >
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Confirming your reservation…
              </div>
            )}

            <Button
              type="submit"
              data-ocid="book.submit_button"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirming…
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
