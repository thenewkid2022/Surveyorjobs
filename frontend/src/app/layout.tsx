import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BootstrapClient from "./components/BootstrapClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieProvider } from "@/contexts/CookieContext";
import CookieBanner from "./components/CookieBanner";
import GoogleAnalytics from "./components/GoogleAnalytics";

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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="de">
      <body className={`${inter.className} antialiased d-flex flex-column min-vh-100`}>
        <CookieProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow-1">
              {children}
            </main>
            <BootstrapClient />
            <Footer />
            <CookieBanner />
            {gaId && <GoogleAnalytics gaId={gaId} />}
          </AuthProvider>
        </CookieProvider>
      </body>
    </html>
  );
}
