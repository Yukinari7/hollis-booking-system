import SideNav from "@/components/NavBar/SideNav";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({children,} : {children: React.ReactNode}) {
  const session = await auth.getSession();
   if (!session.data?.user) {
    redirect("/auth/sign-in");
  }
  const userRole = session.data.user.role?.toLowerCase()
  if(userRole === "user") {
    redirect("/bookings")
  }
  return (
    <>
        <SideNav userRole={userRole as "staff" | "admin"}/>
        <main className="flex-1 lg:ml-60 mx-auto">
            {children}
        </main>
    </>
  )
}
