// components/StaffManagement/SearchBar.tsx
"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    // Create a mutable copy of current URL search params
    const params = new URLSearchParams(searchParams);
    const value = term.trim();
    
    if (value) {
      params.set("search", value); // Append query parameter
    } else {
      params.delete("search");    // Clear parameter if input is empty
    }

    // Wrap URL updates in a transition so the UI stays responsive
    startTransition(() => {
      const queryString = params.toString();
      replace(queryString ? `${pathname}?${queryString}` : pathname);
    });
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="search" className="sr-only">Search Staff</label>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        id="search"
        type="text"
        placeholder="Search staff by name or department..."
        defaultValue={searchParams.get("search")?.toString() ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-2 text-sm text-black shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
