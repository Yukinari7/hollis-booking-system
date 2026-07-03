"use client";
import { Button } from '@/components/ui/button';
import { createBookingAction } from '@/lib/actions/events';
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useActionState, useState } from 'react'
import { toast } from 'react-toastify';

interface Props {
  room: {
    id: string;
    room_number: string;
    type: string;
    pricePerNight: number;
    description: string;
    amenities: string[];
    images: string[];
  }
};

type FormState = {
    success: boolean,
    message: string
}

const formState: FormState = {
    success: false,
    message: ""
}


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

export default function BookingForm({room}: Props) {
const router = useRouter();
const params = useParams();
const roomId = (params.roomId as string).split("-")[0];
const createBookingId = createBookingAction.bind(null, roomId);
const [state, formAction, isPending] = useActionState(createBookingId, formState);
    useEffect(()=>{
        if(!state.message && state.message) toast.error(state.message)
        if(state.success) toast.success("Booking done successfully")
    }, [state])
const [checkIn, setCheckIn] = useState("");
const [checkOut, setCheckOut] = useState("");
const today = new Date().toISOString().split("T")[0];
let minCheckOut = today;
if (checkIn) {
  const nextDay = new Date(checkIn);
  nextDay.setDate(nextDay.getDate() + 1);
  minCheckOut = nextDay.toISOString().split("T")[0];
}

let totalNights = 0;
let calculatedTotalPrice = room.pricePerNight;
if (checkIn && checkOut) {
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const timeDiff = date2.getTime() - date1.getTime();
  if (timeDiff > 0) {
    totalNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    calculatedTotalPrice = totalNights * room.pricePerNight
  }
}
  return (
    <div className="space-y-6 py-10">
        <div>       
            <Button type="button" onClick={()=>router.back()}><ChevronLeft/>Back</Button>
        </div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Confirm Your Stay</h1>
            <p className="text-sm text-gray-500">Please provide booking registration and billing info.</p>
        </div>
        {/* TWO-COLUMN GRID IMPLEMENTATION ROW */}
      <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN 1: INTERACTIVE CONTENT FORMS (60% Desktop Split Width Layout) */}
        <div className="lg:col-span-7 space-y-6 bg-white dark:bg-gray-950 p-6 rounded-xl border border-gray-100 dark:border-gray-900 shadow-sm">
          
          {/* SECTION A: GUEST ACCOUNTS DATA INPUTS */}
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

          {/* SECTION B: DATE PICKERS */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Stay Window Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Check-In Date</label>
                <input required type="date" name="checkIn" min={today} value={checkIn}
                 onChange={(e) => {setCheckIn(e.target.value)
                  if (checkOut && e.target.value >=checkOut) setCheckOut("");
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

          {/* SECTION C: CREDIT CARD PAYMENTS PREVIEW FORM */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">3. Secure Card Processing Gateways</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Cardholder Name</label>
                <input required type="text" placeholder="EMEM PRINCESON" className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent uppercase" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Card Number</label>
                <input required type="text" maxLength={19} placeholder="4111 2222 3333 4444" className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Expiration Date</label>
                  <input required type="text" placeholder="12 / 29" className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent text-center" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Security Code (CVV)</label>
                  <input required type="password" maxLength={3} placeholder="321" className="px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-transparent text-center" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2: STICKY INVOICE SUMMARY SIDEBAR (40% Width Layout) */}
        <div className="lg:col-span-5 md:sticky md:top-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-900">
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Pricing Configuration</span>
            <h2 className="text-xl font-black mt-1 text-gray-900 dark:text-gray-50">{room.type}</h2>
            <p className="text-xs font-medium text-gray-500">Room layout profile allocation ref: #{room.room_number}</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Visual Thumbnail Preview Container */}
            <div className="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100">
              {room.images.length > 0 && (
                <Image src={room.images[0]} alt={room.type} fill className="object-cover" />
              )}
            </div>

            {/* Price Line Invoicing Row Items */}
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Base Rate Pricing {totalNights > 0 ? `(${totalNights} nights)`:""}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {totalNights > 0 ? `$${room.pricePerNight}.00 x ${totalNights}`: `$${room.pricePerNight}.00 / night`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Occupancy Service Tax (VAT)</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">$0.00</span>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-900" />

            {/* Total Display Section */}
            <div className="flex justify-between items-center py-1">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Total Amount Due</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">${calculatedTotalPrice}.00</span>
            </div>

            {/* Submission Interactive Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-800 text-white font-medium text-center rounded-xl shadow-sm transition-colors text-sm"
            >
              {isPending ? "Processing Security Payment..." : "Confirm & Pay Your Reservation"}
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}
