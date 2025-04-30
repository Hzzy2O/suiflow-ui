import React from "react";

function Search() {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-[#0A1428]/80 border border-[#2A3746] relative flex items-center shadow-md rounded-full w-52 h-10">
        {/* Search Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-[#6FBCF0]/70 w-4 h-4 absolute left-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m1.72-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Search Input */}
        <input
          name="SearchBar"
          id="Searchbar"
          placeholder="Press / to search"
          disabled
          className="placeholder-[#ABAFB4] w-10 bg-transparent outline-none flex-grow pl-10 pr-10 py-2 rounded-full text-sm"
          aria-label="Search components including Address Display, Balance Display, Connect Button, Connect Modal, NFT Card, Token Input, Transaction Notifier, and Transaction History"
        />

        {/* Modern Backslash Icon */}
        <span className="absolute right-3 bg-[#0A2440] text-[#6FBCF0] p-1 rounded flex items-center justify-center w-5 h-5 text-xs font-semibold">
          /
        </span>
      </div>
    </div>
  );
}

export default Search;
