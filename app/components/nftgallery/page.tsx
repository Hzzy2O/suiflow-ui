'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { NFTGallery } from '.';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

// Create a client
const queryClient = new QueryClient();

export default function NFTGalleryPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [demoWalletAddress, setDemoWalletAddress] = useState('0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const copyToClipboard = (text: string, step: number) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopiedStep(step);
          setTimeout(() => setCopiedStep(null), 2000);
        },
        () => alert('Failed to copy.')
      );
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand('copy');
        setCopiedStep(step);
        setTimeout(() => setCopiedStep(null), 2000);
      } catch (err) {
        alert('Failed to copy.');
      }

      document.body.removeChild(textarea);
    }
  };

  // Source code
  const sourceCode = `
import React, { useEffect, useState } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { NFTCard } from '../nftcard';

interface NFTGalleryProps {
  walletAddress: string;
  networkType?: 'mainnet' | 'testnet' | 'devnet';
  maxDisplay?: number;
  variant?: 'default' | 'glass' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  onNFTSelect?: (objectId: string) => void;
  emptyStateMessage?: string;
  loadingMessage?: string;
  customEmptyComponent?: React.ReactNode;
  customLoadingComponent?: React.ReactNode;
  customErrorComponent?: React.ReactNode;
}

const NFTGallery: React.FC<NFTGalleryProps> = ({
  walletAddress,
  networkType = 'mainnet',
  maxDisplay = 50,
  variant = 'default',
  size = 'md',
  onNFTSelect,
  emptyStateMessage = 'No NFTs found in this wallet',
  loadingMessage = 'Loading NFTs from wallet...',
  customEmptyComponent,
  customLoadingComponent,
  customErrorComponent,
}) => {
  const [nftObjects, setNftObjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state on wallet address or network change
    setNftObjects([]);
    setLoading(true);
    setError(null);
    
    const fetchWalletNFTs = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }
      
      try {
        // Create Sui client
        const client = new SuiClient({ url: getFullnodeUrl(networkType) });

        // Get all objects owned by the wallet
        const objects = await client.getOwnedObjects({
          owner: walletAddress,
          options: {
            showType: true,
            showDisplay: true,
          },
          // Improve performance by using pagination
          limit: 50,
        });

        if (!objects || !objects.data) {
          throw new Error('Failed to fetch wallet objects');
        }

        // Filter for NFTs and digital assets
        const nftObjectIds = objects.data
          .filter(obj => {
            // Check if the object has a display and data
            const hasDisplay = obj.data?.display?.data;
            // Look for common NFT fields in the display data
            return hasDisplay && (
              hasDisplay.name || 
              hasDisplay.image_url || 
              hasDisplay.description
            );
          })
          .map(obj => obj.data?.objectId)
          .filter(Boolean) as string[];

        // Limit the number of NFTs to display
        setNftObjects(nftObjectIds.slice(0, maxDisplay));
      } catch (err: any) {
        console.error('Error fetching wallet NFTs:', err);
        setError(err.message || 'Failed to load NFTs from wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletNFTs();
  }, [walletAddress, networkType, maxDisplay]);

  if (loading) {
    if (customLoadingComponent) {
      return <>{customLoadingComponent}</>;
    }
    
    return (
      <div className="p-4">
        <div className="h-20 flex items-center justify-center">
          <p className="text-gray-500">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (customErrorComponent) {
      return <>{customErrorComponent}</>;
    }
    
    return (
      <div className="p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (nftObjects.length === 0) {
    if (customEmptyComponent) {
      return <>{customEmptyComponent}</>;
    }
    
    return (
      <div className="p-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyStateMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {nftObjects.map((objectId) => (
        <NFTCard
          key={objectId}
          objectId={objectId}
          size={size}
          buttonText="View Details"
          buttonAction={onNFTSelect ? () => onNFTSelect(objectId) : undefined}
        />
      ))}
    </div>
  );
};

export default NFTGallery;
`;

  // Usage example
  const example = [
    {
      title: 'Example.tsx',
      code: `import { NFTGallery } from '@/components/nftgallery';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Configure networks
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

export default function MyComponent() {
  // Demo wallet address with NFTs
  const walletAddress = "0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e";
  
  const handleNFTSelect = (objectId) => {
    console.log("Selected NFT:", objectId);
    // Do something with the selected NFT
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">My NFT Collection</h1>
          
          <NFTGallery 
            walletAddress={walletAddress}
            networkType="mainnet"
            maxDisplay={8}
            size="md"
            onNFTSelect={handleNFTSelect}
          />
        </div>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}`,
    },
  ];

  const propsTableData = [
    {
      name: 'walletAddress',
      type: 'string',
      description: 'The wallet address to fetch NFTs from',
    },
    {
      name: 'networkType',
      type: "'mainnet' | 'testnet' | 'devnet'",
      description: 'The Sui network to connect to (default: "mainnet")',
    },
    {
      name: 'maxDisplay',
      type: 'number',
      description: 'Maximum number of NFTs to display (default: 50)',
    },
    {
      name: 'variant',
      type: "'default' | 'glass' | 'bordered'",
      description: 'Visual style variant of the gallery (default: "default")',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the NFT cards (default: "md")',
    },
    {
      name: 'onNFTSelect',
      type: '(objectId: string) => void',
      description: 'Callback function when an NFT is selected',
    },
    {
      name: 'emptyStateMessage',
      type: 'string',
      description: 'Message to display when no NFTs are found (default: "No NFTs found in this wallet")',
    },
    {
      name: 'loadingMessage',
      type: 'string',
      description: 'Message to display during loading state (default: "Loading NFTs from wallet...")',
    },
    {
      name: 'customEmptyComponent',
      type: 'React.ReactNode',
      description: 'Custom component to render when no NFTs are found',
    },
    {
      name: 'customLoadingComponent',
      type: 'React.ReactNode',
      description: 'Custom component to render during loading state',
    },
    {
      name: 'customErrorComponent',
      type: 'React.ReactNode',
      description: 'Custom component to render when an error occurs',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">NFT Gallery Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A component for displaying NFT collections from specified wallet addresses, supporting different networks and customizable display options.
        </p>
      </div>

      <div className="flex flex-col items-start mt-10">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center text-white px-3 py-1 rounded-md ${
                activeTab === 'Preview'
                  ? 'bg-gradient-to-r from-[#0A1428] to-[#0A2440] text-[#6FBCF0] border-b-2 border-[#3890E3]'
                  : ''
              }`}
              onClick={() => handleTabChange('Preview')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              Preview
            </button>
            <button
              className={`flex items-center text-white px-3 py-1 rounded-md ${
                activeTab === 'Code'
                  ? 'bg-gradient-to-r from-[#0A1428] to-[#0A2440] text-[#6FBCF0] border-b-2 border-[#3890E3]'
                  : ''
              }`}
              onClick={() => handleTabChange('Code')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
              Code
            </button>
          </div>
          <div className="mr-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center rounded-full p-2 text-white focus:outline-none"
              onClick={toggleDarkMode}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.svg
                    key="dark"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                    initial={hasMounted ? { opacity: 0, rotate: -90 } : false}
                    animate={hasMounted ? { opacity: 1, rotate: 0 } : false}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.1 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="light"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                    initial={hasMounted ? { opacity: 0, rotate: -90 } : false}
                    animate={hasMounted ? { opacity: 1, rotate: 0 } : false}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.1 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <div className="bg-[#0A1428]/80 border rounded-lg border-[#2A3746] w-full h-auto mt-2">
          <div>
            {activeTab === 'Preview' && (
              <div className="p-8 relative bg-[#0A1428] border-[#2A3746] rounded-lg" style={{
                backgroundImage: `linear-gradient(to right, rgba(58, 145, 227, 0.07) 1px, transparent 1px), 
                                  linear-gradient(to bottom, rgba(58, 145, 227, 0.07) 1px, transparent 1px)`,
                backgroundSize: '10px 10px',
              }}>
                <QueryClientProvider client={queryClient}>
                  <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
                    <div className={darkMode ? "dark" : ""}>
                      <div className="flex flex-col space-y-8">
                        <h3 className="text-sm font-medium mb-4 text-white">Wallet NFT Gallery</h3>
                        <div className="mb-4">
                          <label htmlFor="walletInput" className="block text-sm font-medium text-gray-300 mb-1">
                            Test Wallet Address
                          </label>
                          <div className="flex">
                            <input
                              id="walletInput"
                              type="text"
                              value={demoWalletAddress}
                              onChange={(e) => setDemoWalletAddress(e.target.value)}
                              className="flex-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-600 bg-gray-800 text-sm text-gray-100"
                              placeholder="Enter wallet address to view NFTs..."
                            />
                          </div>
                        </div>
                        <NFTGallery
                          walletAddress={demoWalletAddress}
                          networkType="mainnet"
                          maxDisplay={8}
                          size="md"
                          onNFTSelect={(id) => console.log('Selected NFT:', id)}
                        />
                      </div>
                    </div>
                  </SuiClientProvider>
                </QueryClientProvider>
              </div>
            )}
            {activeTab === 'Code' && (
              <div>
                <SuiFlowSourceCodeBlock
                  codeString={sourceCode}
                  language="javascript"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-20 py-3 text-xl font-semibold">
          <div className="flex items-center">
            <div className="mr-2 sm:pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-[#6FBCF0]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            Installation
          </div>
        </div>

        <div>
          <div className="absolute sm:ml-3">
            <pre className="bg-[#0A1428] p-3 rounded-md overflow-auto text-sm sm:text-base w-[350px] sm:w-[600px] border border-[#2A3746]">
              <code className="text-zinc-300">
                npx @suiflow-ui@latest add nftgallery
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow-ui@latest add nftgallery', 1)
              }
              className="absolute right-0 top-2 p-2 w-10 h-auto bg-[#0A1428] rounded border-r border-[#2A3746]"
              aria-label="Copy command"
            >
              {copiedStep === 1 ? (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#4ADE80"
                  className="w-4 h-4"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 1.1, 1], opacity: [1, 1, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </motion.svg>
              ) : (
                <span className="relative -top-1 -left-1">
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 6.75H7.75C6.64543 6.75 5.75 7.64543 5.75 8.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V8.75C18.25 7.64543 17.3546 6.75 16.25 6.75H15"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M14 8.25H10C9.44772 8.25 9 7.80228 9 7.25V5.75C9 5.19772 9.44772 4.75 10 4.75H14C14.5523 4.75 15 5.19772 15 5.75V7.25C15 7.80228 14.5523 8.25 14 8.25Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M9.75 12.25H14.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M9.75 15.25H14.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center mt-28 py-3 sm:pl-4 text-xl font-semibold">
            <div className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-[#6FBCF0]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                />
              </svg>
            </div>
            Usage
          </div>
        </div>

        <SuiFlowExampleBlock files={example} />

        <div className="container mx-auto p-1 sm:p-4 mt-20">
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 text-[#6FBCF0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <h1 className="text-xl font-semibold ml-2">Props</h1>
          </div>
          <PropsTable propsData={propsTableData} />
        </div>
      </div>
    </div>
  );
} 
