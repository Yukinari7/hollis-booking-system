import "@/app/globals.css";
import Nav from "@/components/NavBar/Nav";
import ResponsiveNav from "@/components/NavBar/ResponsiveNav";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {

  return (
    <>
    <ResponsiveNav/>
    <main className="w-[90%] mx-auto">{children}</main>
    </>
  );
}
