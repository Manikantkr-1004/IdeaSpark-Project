import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./ui/Navbar";
import dynamic from "next/dynamic";
import { UserProvider } from "./context/UserContext";
import { ProtectRoutes } from "./authenticate/protectRoutes";
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
      <body className={`antialiased ${inter.className}`} >
        <UserProvider>
          <ProtectRoutes>
            <Navbar />
              {children}
            <Footer />
          </ProtectRoutes>
        </UserProvider>
        <Toaster position="bottom-center" reverseOrder={false} />
      </body>
    </html>
  );
}
