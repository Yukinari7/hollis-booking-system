"use client";

import { UserButton } from "@neondatabase/auth/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "../Constant/constant";

type Props = {
  open: boolean,
  setOpen: (value: boolean) => void
}

export const Nav = ({open, setOpen}: Props) => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="z-1000 flex border-b border-gray-300">
      <div className="mx-auto flex h-12 w-[90%] items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md w-6 h-6 p- flex items-center justify-center bg-black dark:bg-zinc-300">
            <p className="text-white dark:text-black font-semibold">H</p>
          </div>
          <Link href={"/"} className="font-bold">
            HOLLIS.
          </Link>
        </div>
        <div className="flex items-center md:gap-3 gap-2">
          <div className="flex items-center gap-6 hidden md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                className={`text-sm ${pathname === link.url ? "font-semibold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <UserButton size="icon" />
          <button
            type="button"
            aria-label="Toggle theme"
            className="rounded-md p-2 transition-colors hover:bg-muted"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {mounted ? (
              resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />
            ) : (
              <span className="h-5 w-5" />
            )}
          </button>
          <div className="md:hidden flex">
            <button onClick={()=>setOpen(!open)} className="relative w-5 h-4 text-black dark:text-white flex flex-col justify-between">
              <span className={`h-[2px] w-full bg-black dark:bg-white transition-all duration-300
                 ${open ? "rotate-45 translate-y-[8px]":""}`}></span>
              <span className={`h-[2px] w-full bg-black dark:bg-white transition-all duration-300
                 ${open ? "opacity-0":""}`}></span>
              <span className={`h-[2px] w-full bg-black dark:bg-white transition-all duration-300
                 ${open ? "-rotate-45 -translate-y-[6px]":""}`}></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;