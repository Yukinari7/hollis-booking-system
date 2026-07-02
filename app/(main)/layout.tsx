import "@/app/globals.css";
import Nav from "@/components/NavBar/Nav";


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
