import "./globals.css";
import type { Metadata } from "next";
import {Inter} from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "./ui/Navbar";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { TanstackProviders } from "./tanstackProviders";
import GoogleOneTap from "./ui/GoogleOneTap";
const Footer = dynamic(() => import("./ui/Footer"));

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "IdeaSpark - AI Powered Platform",
  description: "A creativity hub to store ideas + quick AI suggestions",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: 'IdeaSpark - AI Powered Platform',
    description: 'A creativity hub to store ideas + quick AI suggestions',
    images: "/homepage.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-signin-use_fedcm" content="true" />
      <body className={`antialiased ${inter.className}`} >
        <SessionProvider>
          <TanstackProviders>
            <Navbar />
              {children}
            <Footer />
            <GoogleOneTap />
          </TanstackProviders>
        </SessionProvider>
        <Toaster position="bottom-center" reverseOrder={false} />
      </body>
    </html>
  );
}
