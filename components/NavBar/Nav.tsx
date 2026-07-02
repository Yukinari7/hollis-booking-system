"use client";

import { UserButton } from "@neondatabase/auth/react";
import Link from "next/link";
import { navLinks } from "../Constant/constant";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react";

export const Nav = () => {
const pathname = usePathname();
const {resolvedTheme, setTheme} = useTheme();
  return (
    <div className="flex border-b border-gray-300 z-1000">
      <div className="w-[90%] mx-auto flex items-center justify-between h-12">
        <div>
          <Link href={"/"} className="font-bold">HOLLIS.</Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            {navLinks.map((link)=>(
              <Link key={link.id} href={link.url} className={`text-sm  ${pathname === link.url ? "font-semibold":""}`}>{link.label}</Link>
            ))}
          </div>
          <UserButton size="icon"/>
          <button aria-label="Toggle theme" onClick={()=>setTheme(resolvedTheme === "light" ? "dark":"light")}>
            {resolvedTheme === "light" ? (<Moon size={20}/>):(<Sun size={20}/>)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Nav