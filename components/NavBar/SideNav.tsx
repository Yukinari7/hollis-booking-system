"use client"
import Link from "next/link"
import { sideNavLinks } from "@/components/Constant/constant"
import { UserButton } from "@neondatabase/auth/react"
import { usePathname } from "next/navigation"

interface Props {
    userRole: "staff" | "admin"
}
const SideNav = ({ userRole }: Props) => {
const visibleLinks = sideNavLinks.filter((link) =>
link.roles.includes(userRole)
)
const pathname = usePathname();
  return (
    <div className="fixed bg-black/90 py-5 left-0 top-0 h-screen w-60 border-r border-gray-300 z-50">
        <div className="w-[80%] mx-auto h-15 flex flex-col items-start gap-4">
            <div className="flex items-start justify-between">
                <Link href={"/"} className="font-bold text-2xl text-white">Hollis</Link>
                <p className="text-xs text-white">{userRole} portal</p>
            </div>
            <div className="flex flex-col space-y-2 w-full">
                {visibleLinks.map((link) =>{
                    const Icon = link.icon
                    return (
                        <Link key={link.id} href={link.url} className={`flex text-sm items-center gap-2 rounded-lg p-2 ${pathname === link.url ? "bg-zinc-700 text-white" : "text-white hover:bg-zinc-700"}`}>
                            <Icon className="w-3 h-3"/>{link.label}</Link>
                    )
                })}
            </div>
            <div>
            <UserButton size="default"/>
            </div>
        </div>
    </div>
  )
}

export default SideNav
