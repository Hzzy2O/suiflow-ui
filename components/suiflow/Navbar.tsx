import Link from "next/link";
import React from "react";
import Logo from "@/app/images/logo.svg";
import Image from "next/image";
import Search from "./Search";
import { Inter } from "next/font/google";
import CommandSearch from "./CommandSearch";

const inter = Inter({ subsets: ["latin"], weight: "500" });

function Navbar() {
  return (
    <div
      className={`navbar-container fixed top-0 left-0 right-0 bg-gradient-to-r from-[#091428] to-black/95 flex justify-between backdrop-blur-lg border-b border-[#2A3746] h-auto sm:py-3 py-4 px-3 text-sm z-50 ${inter.className}`}
    >
      <span className="flex items-center">
        <Link href={"/"} className="flex justify-center items-center">
          <Image src={Logo} alt="SerenityLogo" width={40} height={20} />
          <p className="hidden sm:flex text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#3890E3] ml-1 pr-20">
              SuiFlow UI
            </p>
        </Link>

        <div className="items-center flex space-x-6 text-[#ABAFB4]">
          <Link href="/components" passHref>
            <span className="hover:text-[#6FBCF0] transition-colors duration-200 cursor-pointer hidden sm:flex ml-10 md:ml-0">
              Components
            </span>
          </Link>
        </div>
      </span>
      <div className="flex justify-center items-center gap-1">
        {/* Searchbar */}
        <div className="hidden sm:flex pr-5 sm:pr-2 md:pr-4">
          <Search />
        </div>
        {/* Command Search */}
        <div className="sm:hidden">
          <CommandSearch />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
