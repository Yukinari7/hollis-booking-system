import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer/Footer";
import Nav from "@/components/NavBar/Nav";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {

  return (
    <>
    <Nav/>
    <main className="w-[90%] mx-auto">{children}</main>
    </>
  );
}
