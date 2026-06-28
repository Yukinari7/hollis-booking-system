"use server";

import StaffDashboard from "@/components/StaffDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.getSession();

  if (!session.data?.user) {
    redirect("/auth/sign-in");
  }

  switch (session.data.user.role) {
    case "staff":
      return <StaffDashboard/>;

    case "admin":
      return <AdminDashboard/>;

    default:
      redirect("/auth/sign-in");
  }
}