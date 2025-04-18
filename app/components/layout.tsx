import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideBar from "@/components/suiflow/SideBar";
import Navbar from "@/components/suiflow/Navbar";
import { Spotlight } from "@/components/ui/spotlight";
import { TransactionNotifierProvider } from "./transaction-notifier/components/TransactionNotifier";
import "@/app/styles/suiflow-theme.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "SuiFlow UI - Components",
  description: "Beautifully crafted UI components to elevate your web projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TransactionNotifierProvider>
      <div className={`${inter.className}`}>
        <div className="hidden md:flex">
          <Spotlight fill="#3890E3" />
        </div>
        <Navbar />
        <div className="flex">
          <SideBar />
          <div className="bg-gradient-to-br from-[#091428] to-black/95 w-full">
            {children}
          </div>
        </div>
      </div>
    </TransactionNotifierProvider>
  );
}
