"use client";
import React, { useState } from "react";
import { CgComponents } from "react-icons/cg";
import { MdKeyboardCommandKey } from "react-icons/md";
import SerenityMobileSearch from "./SuiFlowMobileSearch";

function CommandSearch() {
  const [showModal, setShowModal] = useState(false);

  const handleShortcutClick = () => {
    setShowModal((prev) => !prev);
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

  // For mobile
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
      title: "NFT Card",
      url: "/components/nftcard",
      icon: <CgComponents />,
    },
    { 
      title: "NFT Gallery", 
      url: "/components/nftgallery", 
      icon: <CgComponents /> 
    },
    { 
      title: "Address Display", 
      url: "/components/addressdisplay", 
      icon: <CgComponents /> 
    },
    { title: "Transaction Notifier", url: "/components/transaction-notifier", icon: <CgComponents /> },
  ];

  return (
    <div>
      {/* Command Icon   */}
      <div className="md:hidden sm:mr-5">
        <MdKeyboardCommandKey
          onClick={handleShortcutClick}
          className="bg-[#0A2440] hover:bg-[#0A1428] text-[#6FBCF0] rounded p-1 transition-colors duration-200"
          size={20}
        />
      </div>
      {/* Search Modal */}
      {showModal && (
        <SerenityMobileSearch
          showmodal={showModal}
          setshowmodal={setShowModal}
          pages={pages}
        />
      )}
    </div>
  );
}

export default CommandSearch;
