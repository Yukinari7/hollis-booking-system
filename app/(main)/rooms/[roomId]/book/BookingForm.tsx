"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";

interface Props {
  room: {
    id: string;
    room_number: string;
    type: string;
    pricePerNight: number;
    description: string;
    amenities: string[];
    images: string[];
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};



export default function BookingForm({ room }: Props) {
  const router = useRouter();
  const params = useParams();

  const roomId = params.roomId as string;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  let minCheckOut = today;

  if (checkIn) {
    const nextDay = new Date(checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    minCheckOut = nextDay.toISOString().split("T")[0];
  }

  const { totalNights, calculatedTotalPrice } = useMemo(() => {
    if (!checkIn || !checkOut) {
      return {
        totalNights: 0,
        calculatedTotalPrice: 0,
      };
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const nights = Math.ceil(
      (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      totalNights: nights,
      calculatedTotalPrice: nights * room.pricePerNight,
    };
  }, [checkIn, checkOut, room.pricePerNight]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!checkIn || !checkOut) {
      toast.error("Please choose valid dates.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!name || !email || !phone) {
      toast.error("Please complete all guest information.");
      return;
    }

    if (totalNights <= 0) {
      toast.error("Invalid booking duration.");
      return;
    }

    const paystackKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!paystackKey) {
      toast.error("Paystack public key not configured.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { default: PaystackPop } =
        await import("@paystack/inline-js");

      const popup = new PaystackPop();

   

      popup.newTransaction({
        key: paystackKey,

        email,

        amount: Math.round(
          calculatedTotalPrice * 100
        ),

        currency: "NGN",

        ref: `booking_${roomId}_${Date.now()}`,

        metadata: {
          custom_fields: [
            {
              display_name: "Guest",
              variable_name: "guest_name",
              value: name,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: phone,
            },
            {
              display_name: "Room",
              variable_name: "room_id",
              value: roomId,
            },
          ],
        },

        onSuccess: async (transaction: { reference?: string }) => {
          try {
            const response = await fetch(
              "/api/paystack/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  reference: transaction.reference,
                  roomId,
                  checkIn,
                  checkOut,
                  name,
                }),
              }
            );

            const result = await response.json();

            if (!response.ok) {
              throw new Error(
                result.error ??
                  "Unable to verify payment."
              );
            }

            if (!result.success) {
              throw new Error(
                result.error ??
                  "Booking verification failed."
              );
            }

            toast.success(
              "Booking confirmed successfully."
            );

            router.replace(`/rooms/${roomId}`);
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unable to verify booking.";
            toast.error(message);
          } finally {
            setIsSubmitting(false);
          }
        },

        onClose: () => {
          setIsSubmitting(false);

          toast.info("Payment cancelled.");
        },
      });
    } catch (error: unknown) {
      setIsSubmitting(false);

      const message = error instanceof Error ? error.message : "Unable to initialize payment.";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6 py-10">
      <div>
        <Button
          type="button"
          onClick={() => router.back()}
        >
          <ChevronLeft />
          Back
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Confirm Your Stay
        </h1>

        <p className="text-sm text-gray-500">
          Please provide booking registration
          information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-900 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Guest Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                <input required type="text" name="name" placeholder="Emem Princeson" className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Email Address</label>
                <input required type="email" name="email" placeholder="emem@example.com" className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Phone Number</label>
                <input required type="tel" name="phone" placeholder="+234 801 234 5678" className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-900" />

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Stay Window Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Check-In Date</label>
                <input required type="date" name="checkIn" min={today} value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Check-Out Date</label>
                <input required type="date" name="checkOut" disabled={!checkIn} min={minCheckOut} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-900" />

        </div>

        <div className="lg:col-span-5 md:sticky md:top-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-900">
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Pricing Configuration</span>
            <h2 className="text-xl font-black mt-1 text-gray-900 dark:text-gray-50">{room.type}</h2>
            <p className="text-xs font-medium text-gray-500">Room layout profile allocation ref: #{room.room_number}</p>
          </div>

          <div className="p-5 space-y-4">
            <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100">
              {room.images.length > 0 && (
                <Image src={room.images[0]} alt={room.type} fill className="object-cover" />
              )}
            </div>

            <div className="space-y-2 pt-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Base Rate Pricing {totalNights > 0 ? `(${totalNights} nights)` : ""}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {totalNights > 0 ? `${formatCurrency(room.pricePerNight)}.00 x ${totalNights}` : `${formatCurrency(room.pricePerNight)}.00 / night`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Occupancy Service Tax (VAT)</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(0)}.00</span>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-900" />

            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Total Amount Due</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatCurrency(calculatedTotalPrice)}.00</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-800 text-white font-medium text-center rounded-xl shadow-sm transition-colors text-sm"
            >
              {isSubmitting ? "Processing Security Payment..." : "Confirm & Pay Your Reservation"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
