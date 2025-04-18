"use client";
import Link from "next/link";
import React, { useState, useEffect, Suspense, lazy } from "react";
import TechUsed from "@/components/suiflow/TechUsed";
import HomeNav from "@/components/suiflow/HomeNav";
import { Inter } from "next/font/google";
import { Spotlight } from "@/components/ui/spotlight";

// Use Inter font with multiple weights for better typography hierarchy
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`${inter.className} w-full h-full bg-gradient-to-br from-[#0A1428] to-[#091428]`}>
        <HomeNav />
        <div className="flex flex-col p-5 ">
          <div className="hidden lg:flex">
            <Spotlight fill="#2A3746" />
          </div>

          <div className="flex flex-col-reverse lg:flex-row items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-6">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold py-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-[#3890E3] bg-opacity-50 sm:px-20 lg:px-0 xl:px-0 2xl:px-0">
                Beautifully crafted UI components to elevate your web projects
              </span>
              <p
                className={`text-sm sm:text-lg mt-4 text-[#E5E7EB] sm:px-40 lg:px-0 xl:px-0 2xl:px-0`}
              >
                Accelerate your workflow with ready-to-use components. Fully
                customizable and open source.
              </p>
              <div className="flex justify-center lg:justify-start items-center gap-5 mt-8">
                <Link prefetch href={"docs/introduction"}>
                  <button className="text-sm font-medium bg-[#3890E3] text-white py-2.5 px-6 rounded-lg transition-all duration-300 hover:bg-[#4A90E2] hover:shadow-md hover:shadow-[#3890E3]/20">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/1 lg:h-[400px] mt-10 lg:mt-0 flex justify-center">
              <div className="w-44 h-44 md:w-80 md:h-80 items-center justify-center text-white hidden lg:flex bg-gradient-to-br from-[#3890E3] to-[#40BFCF] rounded-2xl shadow-lg">
                  <span className="sui-loader"></span>
                </div>
            </div>
          </div>

          <div className="justify-center lg:justify-start xl:justify-start 2xl:justify-start flex items-start pt-24 pb-5 lg:pl-5 xl:pl-5 lg:pt-10 xl:pb-5">
            <TechUsed />
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(Home);
