import Link from "next/link";
import React from "react";
import Image from "next/image";
import Logo from "@/app/images/logo.svg";
import Search from "./Search";
import CommandSearch from "./CommandSearch";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["500", "600"] });

const HomeNav: React.FC = () => {
  return (
    <>
      {/* Main Navbar */}
      <div className={`${inter.className} navbar-container bg-gradient-to-r from-[#0A1428] to-[#0A1428]/95 border border-[#2A3746]/80 backdrop-blur-lg py-4 px-5 text-sm z-30 flex justify-between items-center sm:m-6 sm:rounded-full`}>
        <div className="flex items-center">
          <Image
            src={Logo}
            alt="SuiFlow Logo"
            width={40}
            height={20}
            className="rounded-full"
          />
          <Link href="/">
            <p className="hidden sm:flex text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#3890E3] ml-1">
              SuiFlow UI
            </p>
          </Link>
          <div className="">
            <div className="items-center flex space-x-6 text-[#E5E7EB]">
              <Link href="/components" passHref>
                <span className="hover:text-[#3890E3] transition-colors duration-200 cursor-pointer hidden sm:flex ml-10">
                  Components
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* SearchBar */}
          <div className="hidden md:flex pr-5 sm:pr-2 md:pr-4">
            <Search />
          </div>
          {/* Command Search */}
          <CommandSearch />
        </div>
      </div>
    </>
  );
};

export default HomeNav;
