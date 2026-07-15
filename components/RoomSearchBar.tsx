// components/StaffManagement/SearchBar.tsx
"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export function RoomSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(() => searchParams.get("search")?.toString() ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSearch = (term: string) => {
    const nextValue = term.trim();
    setValue(term);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (nextValue) {
        params.set("search", nextValue);
      } else {
        params.delete("search");
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        replace(nextUrl);
      });
    }, 250);
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="search" className="sr-only">Search Rooms</label>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        id="search"
        type="text"
        value={value}
        placeholder="Search rooms by type, room number, amenity, or price..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-full border border-slate-200 bg-white py-2 pl-8 pr-2 text-sm text-black shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
