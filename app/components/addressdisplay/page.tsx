'use client';
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import components to reduce initial bundle size
const SuiFlowSourceCodeBlock = dynamic(() => import('@/components/suiflow/SuiFlowSourceCodeBlock'), {
  loading: () => <div className="animate-pulse bg-zinc-800/50 h-96 rounded-md"></div>,
  ssr: false
});

const SuiFlowExampleBlock = dynamic(() => import('@/components/suiflow/SuiFlowExampleBlock'), {
  loading: () => <div className="animate-pulse bg-zinc-800/50 h-64 rounded-md"></div>,
  ssr: false
});

const PropsTable = dynamic(() => import('@/components/suiflow/Table'), {
  loading: () => <div className="animate-pulse bg-zinc-800/50 h-64 rounded-md"></div>,
  ssr: false
});

// Lazy load the AddressDisplay component for better performance
const AddressDisplay = dynamic(() => import('./').then(mod => mod.AddressDisplay), {
  loading: () => (
    <div className="inline-flex items-center rounded-md gap-2 bg-gray-100 dark:bg-gray-800 px-3 shadow-sm h-8 animate-pulse">
      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  ),
  ssr: false
});

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

// Create a client
const queryClient = new QueryClient();

// Lazy load address sample components
const AddressSample = dynamic(() => 
  Promise.resolve(({
    address, 
    title, 
    props = {}
  }: {
    address: string,
    title: string,
    props?: any
  }) => (
    <div>
      <h3 className="text-sm font-medium mb-2 text-white">{title}</h3>
      <AddressDisplay address={address} {...props} />
    </div>
  )), 
  { ssr: false }
);

export default function AddressDisplayPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

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

  // Sample addresses for demonstration
  const myWalletAddress = '0x4a526543bb0d4d45382d3dc92034d3a270977ce0f7839a8abe9952249e9919ea';
  const contractAddress = '0x5f142b447a7765ec69cadd7c2bdf25d639eb337ef4fdb4addd8900e4dc487a85';

  // Source code and examples
  const sourceCode = `
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckIcon, Copy } from 'lucide-react';
import { useSuiClient } from '@mysten/dapp-kit';

export const generateColorFromAddress = (address: string) => {
  const stringToHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  };

  const hash1 = stringToHash(\`color1-\${address}\`);
  const hash2 = stringToHash(\`color2-\${address}\`);

  const color1 = \`#\${((hash1 >>> 0) & 0xFFFFFF).toString(16).padStart(6, '0')}\`;
  const color2 = \`#\${((hash2 >>> 0) & 0xFFFFFF).toString(16).padStart(6, '0')}\`;

  return \`linear-gradient(45deg, \${color1}, \${color2})\`;
};

export interface AddressDisplayProps {
  // Basic properties
  address: string;
  
  // Display options
  textDisplayMode?: 'short' | 'medium' | 'full';
  variant?: 'default' | 'compact';
  showCopyButton?: boolean;
  showExplorerLink?: boolean;
  showAvatar?: boolean;
  avatarShape?: 'circle' | 'rounded-square';
  
  // Style properties
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // Explorer options
  explorerUrl?: string;
  
  // Interaction properties
  onClick?: () => void;
}

// Helper function to format address based on variant
const formatAddress = (
  address: string,
  displayMode: 'short' | 'medium' | 'full'
): string => {
  if (!address) return '';
  
  // Make sure address is a string and remove any leading/trailing whitespace
  const cleanAddress = address.toString().trim();
  
  // Ensure address has the 0x prefix
  const normalizedAddress = cleanAddress.startsWith('0x') 
    ? cleanAddress 
    : \`0x\${cleanAddress}\`;
  
  if (displayMode === 'full') return normalizedAddress;
  
  if (displayMode === 'medium') {
    if (normalizedAddress.length <= 20) return normalizedAddress;
    return \`\${normalizedAddress.slice(0, 10)}...\${normalizedAddress.slice(-10)}\`;
  }
  
  // Default: short variant
  if (normalizedAddress.length <= 12) return normalizedAddress;
  return \`\${normalizedAddress.slice(0, 6)}...\${normalizedAddress.slice(-4)}\`;
};

const AddressDisplay = ({
  // Basic properties
  address,

  // Display options
  textDisplayMode = 'short',
  variant = 'default',
  showCopyButton = true,
  showExplorerLink = true,
  showAvatar = true,
  avatarShape = 'circle',

  // Style properties
  size = 'md',
  className,

  // Explorer options
  explorerUrl,

  // Interaction properties
  onClick,
}: AddressDisplayProps) => {
  // State for copy button
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const { network } = useSuiClient();

  // Size mappings
  const sizeClasses = {
    sm: 'text-xs h-7',
    md: 'text-sm h-8',
    lg: 'text-base h-9',
  };
  
  // Avatar size mappings
  const avatarSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  // Ensure we have a valid address
  if (!address) {
    return (
      <div
        className={cn(
          'inline-flex items-center text-gray-400 rounded-md bg-gray-100 dark:bg-gray-800 px-3',
          sizeClasses[size],
          className
        )}
      >
        Invalid address
      </div>
    );
  }

  // Format the address
  const formattedAddress = formatAddress(address, textDisplayMode);

  // Handle copy
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from propagating

    navigator.clipboard.writeText(address.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle explorer link click
  const handleExplorerClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    
    if (!showExplorerLink) return;
    
    // Get the clean address without 0x prefix
    const addressWithoutPrefix = address.toString().replace(/^0x/, '');
    const networkType = network === 'mainnet' ? 'mainnet' : 'testnet';

    // Format the URL using SuiScan format
    const suiscanUrl =
      explorerUrl ||
      \`https://suiscan.xyz/\${networkType}/account/\${addressWithoutPrefix}\`;

    window.open(suiscanUrl, '_blank');
  };

  // Get button size based on overall size
  const getButtonSize = (): number => {
    switch (size) {
      case 'sm':
        return 14;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  const buttonSize = getButtonSize();
  
  // Display address - either formatted or full on hover
  const displayAddress = showFullAddress ? address.toString() : formattedAddress;

  // Generate avatar gradient
  const avatarBackground = generateColorFromAddress(address);
  
  // Avatar shape class
  const avatarShapeClass = avatarShape === 'circle' ? 'rounded-full' : 'rounded-md';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md gap-2 bg-gray-100 dark:bg-gray-800 px-3 shadow-sm',
        showExplorerLink ? 'cursor-pointer' : '',
        sizeClasses[size],
        variant === 'compact' && 'p-1 pl-2',
        className
      )}
      onClick={handleExplorerClick}
    >
      {showAvatar && (
        <div 
          className={cn(
            avatarShapeClass,
            avatarSizeClasses[size]
          )}
          style={{ background: avatarBackground }}
          aria-hidden="true"
        />
      )}
      
      <span
        className={cn(
          "font-mono text-gray-800 dark:text-gray-200",
          showExplorerLink && "hover:underline"
        )}
        title={address.toString()}
      >
        {displayAddress}
      </span>

      {showCopyButton && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md"
            aria-label="Copy address"
            title="Copy address"
          >
            {copied ? (
              <CheckIcon size={buttonSize} className="text-green-500" />
            ) : (
              <Copy size={buttonSize} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;
  `;

  // Example usage code
  const example = [
    {
      title: 'Example.tsx',
      code: `import { AddressDisplay } from "@/components/addressdisplay";
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
  // Sample Sui addresses
  const myWalletAddress = '0x4a526543bb0d4d45382d3dc92034d3a270977ce0f7839a8abe9952249e9919ea';
  const contractAddress = '0x5f142b447a7765ec69cadd7c2bdf25d639eb337ef4fdb4addd8900e4dc487a85';
  
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <div className="flex flex-col gap-6 p-4">
          {/* Basic usage with default settings */}
          <div>
            <h3 className="text-sm font-medium mb-2">Default Layout (Short Display)</h3>
            <AddressDisplay address={myWalletAddress} />
          </div>
          
          {/* Medium text display */}
          <div>
            <h3 className="text-sm font-medium mb-2">Medium Text Display</h3>
            <AddressDisplay 
              address={myWalletAddress} 
              textDisplayMode="medium" 
            />
          </div>
          
          {/* Full text display */}
          <div>
            <h3 className="text-sm font-medium mb-2">Full Text Display</h3>
            <AddressDisplay 
              address={myWalletAddress} 
              textDisplayMode="full" 
              className="max-w-full overflow-x-auto"
            />
          </div>
          
          {/* Compact layout variant */}
          <div>
            <h3 className="text-sm font-medium mb-2">Compact Layout</h3>
            <AddressDisplay 
              address={contractAddress} 
              variant="compact" 
            />
          </div>
          
          {/* Without avatar */}
          <div>
            <h3 className="text-sm font-medium mb-2">Without Avatar</h3>
            <AddressDisplay 
              address={contractAddress} 
              showAvatar={false}
            />
          </div>
          
          {/* Rounded square avatar */}
          <div>
            <h3 className="text-sm font-medium mb-2">Rounded Square Avatar</h3>
            <AddressDisplay 
              address={contractAddress}
              avatarShape="rounded-square" 
            />
          </div>
          
          {/* Custom click handler */}
          <div>
            <h3 className="text-sm font-medium mb-2">Clickable (with handler)</h3>
            <AddressDisplay 
              address={contractAddress}
              onClick={() => alert('Address clicked: ' + contractAddress)} 
            />
          </div>
        </div>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}`,
    },
  ];

  // Props data
  const propsData = [
    // Basic properties
    {
      name: 'address',
      type: 'string',
      description: 'The blockchain address to display (required)',
    },
    // Display options
    {
      name: 'textDisplayMode',
      type: "'short' | 'medium' | 'full'",
      description: "Display format for the address text. 'short' (default): shows first 6 and last 4 characters, 'medium': shows first 10 and last 10 characters, 'full': shows the entire address",
    },
    {
      name: 'variant',
      type: "'default' | 'compact'",
      description: "Layout variant for the component. 'default': standard layout, 'compact': smaller with reduced padding",
    },
    {
      name: 'showAvatar',
      type: 'boolean',
      description: "Whether to show the color avatar generated from the address (default: true)",
    },
    {
      name: 'avatarShape',
      type: "'circle' | 'rounded-square'",
      description: "Shape of the address avatar (default: 'circle')",
    },
    {
      name: 'showCopyButton',
      type: 'boolean',
      description: 'Whether to show the copy button (default: true)',
    },
    {
      name: 'showExplorerLink',
      type: 'boolean',
      description: 'Whether to show the Sui Explorer link button (default: true)',
    },
    // Style properties
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: "Size variant of the component. 'md' is default",
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to apply to the component',
    },
    // Explorer options
    {
      name: 'explorerUrl',
      type: 'string',
      description: 'Custom explorer URL (overrides the default SuiScan URL)',
    },
    // Interaction properties
    {
      name: 'onClick',
      type: 'function',
      description: 'Callback function to execute when the address component is clicked',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">Address Display Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A versatile component for displaying sui blockchain addresses with different formatting options,
          copy functionality, and Sui Explorer links. Perfect for wallets, NFT details, and transaction interfaces.
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
                      <Suspense fallback={
                        <div className="flex flex-col gap-6 animate-pulse">
                          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="flex flex-col gap-2">
                              <div className="h-5 w-48 bg-gray-700/30 rounded"></div>
                              <div className="h-8 w-64 bg-gray-700/50 rounded-md"></div>
                            </div>
                          ))}
                        </div>
                      }>
                        <div className="flex flex-col gap-6">
                          <AddressSample 
                            title="Default Layout (Short Display)"
                            address={myWalletAddress}
                          />
                          
                          <AddressSample 
                            title="Medium Text Display"
                            address={myWalletAddress}
                            props={{ textDisplayMode: "medium" }}
                          />
                          
                          <AddressSample 
                            title="Full Text Display"
                            address={myWalletAddress}
                            props={{ 
                              textDisplayMode: "full",
                              className: "max-w-full overflow-x-auto" 
                            }}
                          />
                          
                          <AddressSample 
                            title="Compact Layout"
                            address={contractAddress}
                            props={{ variant: "compact" }}
                          />
                          
                          <AddressSample 
                            title="Without Avatar"
                            address={contractAddress}
                            props={{ showAvatar: false }}
                          />
                          
                          <AddressSample 
                            title="Rounded Square Avatar"
                            address={contractAddress}
                            props={{ avatarShape: "rounded-square" }}
                          />
                          
                          <AddressSample 
                            title="Clickable (with handler)"
                            address={contractAddress}
                            props={{ 
                              onClick: () => alert('Address clicked: ' + contractAddress)
                            }}
                          />
                        </div>
                      </Suspense>
                    </div>
                  </SuiClientProvider>
                </QueryClientProvider>
              </div>
            )}
            {activeTab === 'Code' && (
              <Suspense fallback={<div className="h-96 w-full bg-gray-800/40 animate-pulse rounded-md"></div>}>
                <SuiFlowSourceCodeBlock
                  codeString={sourceCode}
                  language="javascript"
                />
              </Suspense>
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
                npx @suiflow/ui@latest add addressdisplay
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow/ui@latest add addressdisplay', 1)
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

        <Suspense fallback={<div className="h-64 w-full bg-gray-800/40 animate-pulse rounded-md mt-4"></div>}>
          <SuiFlowExampleBlock files={example} />
        </Suspense>

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
          <Suspense fallback={<div className="h-96 w-full bg-gray-800/40 animate-pulse rounded-md"></div>}>
            <PropsTable propsData={propsData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 
