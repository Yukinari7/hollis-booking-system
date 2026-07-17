import "@/app/globals.css";
import Footer from "@/components/Footer/Footer";
import NextTopLoader from "nextjs-toploader";
import ResponsiveNav from "@/components/NavBar/ResponsiveNav";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {

  return (
    <>
    <ResponsiveNav/>
    <NextTopLoader
          color="#2563eb"
          height={3}
          showSpinner={false}
        />
    <main className="w-[90%] mx-auto">{children}</main>
    <Footer/>
    </>
  );
}
