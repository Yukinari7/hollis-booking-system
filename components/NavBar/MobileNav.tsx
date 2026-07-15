import Link from "next/link"
import { navLinks } from "../Constant/constant"
import { usePathname } from "next/navigation"

type Props = {
  open: boolean,
  setOpen: (value: boolean) => void
}

const MobileNav = ({ open, setOpen }: Props) => {
const pathname = usePathname();
  return (
    <div className="absolute z-[1050]">
        <div className="mx-auto max-w-6xl fixed w-full">
          <div className={`bg-zinc-950 ${open ? "max-h scale-y-100" : "opacity-0 scale-y-0"} transition-all 
          duration-300 duration-500 ease-in-out origin-top overflow-hidden flex items-center justify-center h-full flex-col 
          space-y-4 py-4`}>
            {navLinks.map((link)=>{
              return(
                <Link key={link.id} href={link.url} className={`text-white ${pathname === link.url ? "font-semibold border-b":""}`} onClick={()=>setOpen(false)}>
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
    </div>
  )
}

export default MobileNav