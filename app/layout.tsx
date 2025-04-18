import type { Metadata } from "next";
import "./globals.css";
import SuiFlowSearch from "@/components/suiflow/SuiFlowSearch";
import { CgComponents } from "react-icons/cg";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export const metadata: Metadata = {
  title:
    "SuiFlow UI - Beautifully crafted UI components to elevate your web projects.",
  description:
    "Collection of customizable and open source components made with Next.js, Tailwind, Typescript, and Framer motion.",
  authors: [{ name: "Hzzy2O" }],
  openGraph: {
    title: "SuiFlow UI",
    description:
      "Collection of customizable and open source components made with Next.js, Tailwind, Typescript, and Framer motion.",
    url: "https://www.suiflow-ui.com/",
    siteName: "SuiFlow UI",
    locale: "en_US",
    type: "website",
  },
};

const IntroductionIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
};
const InstallationIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
      />
    </svg>
  );
};

// For SuiFlow Search
const pages = [
  {
    title: "Introduction",
    url: "/docs/introduction",
    icon: <IntroductionIcon />,
  },
  {
    title: "Installation",
    url: "/docs/installation",
    icon: <InstallationIcon />,
  },
  {
    title: "Newsletter Card",
    url: "/components/newsletter",
    icon: <CgComponents />,
  },
  { 
    title: "Image Gallery", 
    url: "/components/imagegallery", 
    icon: <CgComponents /> 
  },
  { 
    title: "3D Flip Card", 
    url: "/components/flipcard", 
    icon: <CgComponents /> 
  },
  { 
    title: "Authentication Form", 
    url: "/components/authentication", 
    icon: <CgComponents /> 
  },
  { 
    title: "Pricing Plans", 
    url: "/components/pricing", 
    icon: <CgComponents /> 
  },
  { 
    title: "3D Book Effect", 
    url: "/components/3dbook", 
    icon: <CgComponents /> 
  },
  { 
    title: "Transaction Notifier", 
    url: "/components/transaction-notifier", 
    icon: <CgComponents /> 
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VZQ745LCF2"
        ></Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VZQ745LCF2');
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="hidden sm:flex">
          <SuiFlowSearch pages={pages} mode="dark" />
        </div>
        <main className="flex-grow bg-gradient-to-br from-[#0A1428] to-[#091428]">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
