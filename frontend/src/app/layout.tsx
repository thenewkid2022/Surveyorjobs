import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BootstrapClient from "./components/BootstrapClient";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "BauJobs - Jobs & Stellenanzeigen in der Baubranche",
  description: "Finden Sie Ihren nächsten Job in der Baubranche oder veröffentlichen Sie Ihr Stellengesuch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} antialiased d-flex flex-column min-vh-100`}>
        <Navbar />
        <main className="flex-grow-1">
          {children}
        </main>
        <BootstrapClient />
        <Footer />
      </body>
    </html>
  );
}
