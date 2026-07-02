// app/rooms/[roomId]/RoomDetail.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Users, BedDouble, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomDetailProps {
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

export function RoomDetail({ room }: RoomDetailProps) {
  // Helper utility to clean numeric presentation values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 py-10">
      {/* Back Button Link Navigation */}
        <Link href="/rooms" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 
            font-medium transition"><ChevronLeft className="w-4 h-4" />Back to Inventory Grid
        </Link>

      {/* Grid Layout Shell split between Content Focus and Sidebar Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left/Center Main Column (Spans 2 spaces on desktop layouts) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Hero Showcase Media Box Container */}
          <div className="w-full h-[400px] relative rounded-2xl overflow-hidden shadow-sm border bg-white">
            {room.images.length > 0 && (
            <Image
              src={room.images[0] || "/placeholder-room.jpg"}
              alt={room.type}
              fill
              priority
              className="object-cover"
            />
            ) }
          </div>

          {/* Heading Core Metadata block */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 uppercase tracking-wider px-2.5 py-1 rounded-md">
                {room.room_number}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                {room.type}
              </h1>
            </div>

            <hr className="border-slate-100" />

            {/* Standard structural floor features list icons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-slate-600 text-sm py-2">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-slate-400" />
                <span>King Bed Configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                <span>Up to 2 Guests Max</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-slate-400" />
                <span>45 sq m floorplan</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Room description copy block summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900">Room Overview Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {room.description?.trim() ? room.description: "No description available."}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Premium room amenities pills array list mapping */}
            <div className="space-y-2.5">
              <h3 className="font-semibold text-slate-900">Available Premium Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities?.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-xs md:text-sm bg-blue-50/80 text-blue-700 font-medium px-3.5 py-1.5 rounded-xl border border-blue-100"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Panel Column (Action booking card anchor box) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-6 space-y-6">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pricing Configuration</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(room.pricePerNight)}
              </span>
              <span className="text-slate-500 text-sm font-medium">/ night</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Free Modification and Cancellation</span>
            </div>
            <p className="pl-6">Cancel or update your structural check-in milestones anytime up to 24 hours prior to calendar arrival windows.</p>
          </div>

          {/* Core booking call-to-action pipeline placeholder trigger button */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-5 rounded-xl shadow-sm transition">
            Proceed to Reservation System
          </Button>
        </div>

      </div>
    </div>
  );
}