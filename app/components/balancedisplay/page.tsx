'use client';
import React, { useState, useEffect } from 'react';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { BalanceDisplay } from '.';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  SuiColorful,
  USDTColorful
} from "@ant-design/web3-icons";

// Config options for the networks
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

// Create a client
const queryClient = new QueryClient();

export default function BalanceDisplayPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState("0x8b5556444c7c56b4128c3d9a96293c18ef643395df01905d90cbf9bc5604b49d");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
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
import React from 'react';
import { cn } from '@/lib/utils';

export interface BalanceDisplayProps {
  balance: string | number;
  symbol?: string;
  variant?: 'default' | 'compact';
  showSymbol?: boolean;
  showDecimalPlaces?: number;
  icon?: React.ReactNode;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  onClick?: () => void;
}

export const formatBalance = (
  balance: string | number,
  options: {
    showDecimalPlaces?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
  } = {}
): string => {
  if (balance === undefined || balance === null) return '0';
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  const {
    showDecimalPlaces = 2,
    thousandSeparator = ',',
    decimalSeparator = '.',
  } = options;
  if (isNaN(numBalance)) return '0';
  const factor = Math.pow(10, showDecimalPlaces);
  const roundedBalance = Math.round(numBalance * factor) / factor;
  const [integerPart, decimalPart = ''] = roundedBalance.toString().split('.');
  const formattedIntegerPart = integerPart.replace(/\\B(?=(\\d{3})+(?!\\d))/g, thousandSeparator);
  const formattedDecimalPart = showDecimalPlaces > 0
    ? decimalSeparator + decimalPart.padEnd(showDecimalPlaces, '0').slice(0, showDecimalPlaces)
    : '';
  return formattedIntegerPart + formattedDecimalPart;
};

const BalanceDisplay = ({
  balance,
  symbol = 'SUI',
  variant = 'default',
  showSymbol = true,
  showDecimalPlaces = 2,
  icon,
  showIcon = true,
  size = 'md',
  className,
  thousandSeparator = ',',
  decimalSeparator = '.',
  onClick,
}: BalanceDisplayProps) => {
  const sizeClasses = {
    sm: 'text-xs h-7',
    md: 'text-sm h-8',
    lg: 'text-base h-9',
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const formattedBalance = formatBalance(balance, {
    showDecimalPlaces,
    thousandSeparator,
    decimalSeparator,
  });
  
  if (balance === undefined || balance === null) {
    return (
      <div className={cn(
        'inline-flex items-center text-gray-400 rounded-md bg-gray-100 dark:bg-gray-800 px-3',
        sizeClasses[size],
        className
      )}>
        Invalid balance
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md gap-1 bg-gray-100 dark:bg-gray-800 px-3 shadow-sm',
        onClick ? 'cursor-pointer' : '',
        sizeClasses[size],
        variant === 'compact' && 'p-1 px-2',
        className
      )}
      onClick={onClick}
    >
      {showIcon && icon && (
        <div className={cn('flex-shrink-0 mr-1', iconSizeClasses[size])}>
          {icon}
        </div>
      )}
      <span className="font-medium text-gray-800 dark:text-gray-200">{formattedBalance}</span>
      {showSymbol && <span className="text-gray-600 dark:text-gray-400">{symbol}</span>}
    </div>
  );
};

export default BalanceDisplay;
  `;

  // Example usage code
  const example = [
    {
      title: 'Example.tsx',
      code: `import { BalanceDisplay } from "@/components/balancedisplay";
import { SuiColorful, USDTColorful } from "@ant-design/web3-icons";
import { useState } from "react";

export default function MyComponent() {
  const [walletAddress, setWalletAddress] = useState("0x8b5556444c7c56b4128c3d9a96293c18ef643395df01905d90cbf9bc5604b49d");

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Basic usage */}
      <div>
        <h3 className="text-sm font-medium mb-2">Basic Usage</h3>
        <BalanceDisplay balance="1234.5678" symbol='SUI' />
      </div>
      
      {/* With icons */}
      <div>
        <h3 className="text-sm font-medium mb-2">With Icons</h3>
        <div className="flex flex-wrap gap-3">
          <BalanceDisplay 
            balance="1234.56" 
            showSymbol={false}
            icon={<SuiColorful className="w-full h-full" />} 
          />
          <BalanceDisplay 
            balance="0.5" 
            showSymbol={false}
            icon={<USDTColorful className="w-full h-full" />} 
          />
        </div>
      </div>
      
      {/* Display options */}
      <div>
        <h3 className="text-sm font-medium mb-2">Display Options</h3>
        <div className="flex flex-wrap gap-3">
          <BalanceDisplay balance="0.00123" symbol="ETH" showDecimalPlaces={5} />
          <BalanceDisplay 
            balance="9999.99" 
            variant="compact" 
            symbol="SUI"
          />
        </div>
      </div>
      
      {/* Sizes */}
      <div>
        <h3 className="text-sm font-medium mb-2">Sizes</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <BalanceDisplay balance="100" size="sm" symbol="SUI" />
          <BalanceDisplay balance="100" size="md" symbol="SUI" />
          <BalanceDisplay balance="100" size="lg" symbol="SUI" />
        </div>
      </div>
      
      {/* Custom formatting */}
      <div>
        <h3 className="text-sm font-medium mb-2">Custom Formatting</h3>
        <BalanceDisplay 
          balance="1234567.89" 
          thousandSeparator=" "
          decimalSeparator="," 
          symbol="EUR"
        />
      </div>

      {/* Fetch wallet balance */}
      <div>
        <h3 className="text-sm font-medium mb-2">Fetch Wallet Balance</h3>
        <div className="mb-3">
          <label htmlFor="walletAddress" className="block text-sm font-medium mb-1">
            Wallet Address:
          </label>
          <input
            id="walletAddress"
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Sui wallet address (0x...)"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {/* SUI balance */}
          <BalanceDisplay 
            walletAddress={walletAddress}
            icon={<SuiColorful className="w-full h-full" />}
            symbol="SUI" 
            refreshInterval={30000} // Refresh every 30 seconds
          />
          
          {/* Custom token balance (example) */}
          <BalanceDisplay 
            walletAddress={walletAddress}
            tokenType="0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN"
            symbol="TEST"
            icon={<USDTColorful className="w-full h-full" />} 
            coinDecimals={6}
          />
        </div>
      </div>
    </div>
  );
}`,
    },
  ];

  // Props data
  const propsData = [
    // Basic properties
    {
      name: 'balance',
      type: 'string | number',
      description: 'The balance value to display (required if not using walletAddress)',
    },
    {
      name: 'symbol',
      type: 'string',
      description: 'Token symbol, defaults to "SUI"',
    },
    // Blockchain properties
    {
      name: 'walletAddress',
      type: 'string',
      description: 'Wallet address to fetch balance from (optional)',
    },
    {
      name: 'tokenType',
      type: 'string',
      description: 'Token type, defaults to "0x2::sui::SUI"',
    },
    {
      name: 'coinDecimals',
      type: 'number',
      description: 'Number of decimal places in coin data (defaults to 9 for SUI)',
    },
    // Display options
    {
      name: 'variant',
      type: "'default' | 'compact'",
      description: "Layout variant of the component. 'default': standard layout, 'compact': more compact layout",
    },
    {
      name: 'showSymbol',
      type: 'boolean',
      description: "Whether to show the token symbol (default: true)",
    },
    {
      name: 'showDecimalPlaces',
      type: 'number',
      description: "Number of decimal places to display (default: 2)",
    },
    {
      name: 'icon',
      type: 'React.ReactNode',
      description: "Token icon to display, can use icons from @ant-design/web3-icons",
    },
    {
      name: 'showIcon',
      type: 'boolean',
      description: "Whether to show the token icon (default: true)",
    },
    // Style properties
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: "Size variant of the component. Default is 'md'",
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the component',
    },
    // Formatting options
    {
      name: 'thousandSeparator',
      type: 'string',
      description: 'Thousand separator character (default: ",")',
    },
    {
      name: 'decimalSeparator',
      type: 'string',
      description: 'Decimal separator character (default: ".")',
    },
    // Interaction properties
    {
      name: 'onClick',
      type: 'function',
      description: 'Callback function to execute when the balance component is clicked',
    },
    {
      name: 'refreshInterval',
      type: 'number',
      description: 'Auto-refresh interval in milliseconds for wallet balance (if using walletAddress)',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">Balance Display Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A versatile component for displaying SUI or other token balances with various formatting options,
          different size variants, and customizable thousand separators and decimal separators.
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
                      <div className="flex flex-col gap-6">
                        {/* Basic usage */}
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Basic Usage</h3>
                          <BalanceDisplay balance="1234.5678" symbol='SUI' />
                        </div>
                        
                        {/* With icons */}
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">With Icons</h3>
                          <div className="flex flex-wrap gap-3">
                            <BalanceDisplay 
                              balance="1234.56" 
                              showSymbol={false}
                              icon={<SuiColorful className="w-full h-full" />} 
                            />
                            <BalanceDisplay 
                              balance="0.5" 
                              showSymbol={false}
                              icon={<USDTColorful className="w-full h-full" />} 
                            />
                          </div>
                        </div>
                        
                        {/* Display options */}
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Display Options</h3>
                          <div className="flex flex-wrap gap-3">
                            <BalanceDisplay balance="0.00123" symbol="ETH" showDecimalPlaces={5} />
                            <BalanceDisplay 
                              balance="9999.99" 
                              variant="compact" 
                              symbol="SUI"
                            />
                          </div>
                        </div>
                        
                        {/* Sizes */}
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Sizes</h3>
                          <div className="flex flex-wrap gap-3 items-center">
                            <BalanceDisplay balance="100" size="sm" symbol="SUI" />
                            <BalanceDisplay balance="100" size="md" symbol="SUI" />
                            <BalanceDisplay balance="100" size="lg" symbol="SUI" />
                          </div>
                        </div>
                        
                        {/* Custom formatting */}
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Custom Formatting</h3>
                          <BalanceDisplay 
                            balance="1234567.89" 
                            thousandSeparator=" "
                            decimalSeparator="," 
                            symbol="EUR"
                          />
                        </div>

                        {/* Blockchain balance fetching */}
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Fetch Wallet Balance</h3>
                          <div className="mb-3">
                            <label htmlFor="walletAddress" className="block text-xs font-medium text-gray-400 mb-1">
                              Wallet Address:
                            </label>
                            <input
                              id="walletAddress"
                              type="text"
                              value={walletAddress}
                              onChange={handleWalletAddressChange}
                              className="w-auto p-2 text-sm bg-gray-800 border border-gray-700 rounded outline-none text-white"
                              placeholder="Enter Sui wallet address (0x...)"
                            />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <BalanceDisplay 
                              walletAddress={walletAddress} 
                              icon={<SuiColorful className="w-full h-full" />} 
                              refreshInterval={30000} // Refresh every 30 seconds
                            />
           
                            {/* Custom token balance (example) */}
                            <BalanceDisplay 
                              walletAddress={walletAddress}
                              tokenType="0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN"
                              icon={<USDTColorful className="w-full h-full" />} 
                              coinDecimals={6}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Click to refresh balance manually</p>
                        </div>
                        
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
          <div className="relative sm:ml-3">
            <pre className="bg-[#0A1428] p-3 rounded-md overflow-auto text-sm sm:text-base w-[350px] sm:w-[600px] border border-[#2A3746]">
              <code className="text-zinc-300">
                npx @suiflow-ui@latest add balancedisplay
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow-ui@latest add balancedisplay', 1)
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
          <PropsTable propsData={propsData} />
        </div>
      </div>
    </div>
  );
} 
