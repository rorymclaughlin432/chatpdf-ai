import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.css";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat PDF AI",
  description: "Chat PDF AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Providers>
          <Navbar />
          <main className="container m-auto min-w-[300px] px-4 py-8">{children}</main>
          <Toaster/>
          </Providers>
        </ClerkProvider>
        
      </body>
    </html>
  );
}
