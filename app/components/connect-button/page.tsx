"use client";

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@/app/components/connect-button/components/ConnectButton';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectButtonPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  
  // 为每个按钮创建单独的状态
  const [basicConnected, setBasicConnected] = useState(false);
  const [basicWalletAddress, setBasicWalletAddress] = useState('');
  const [basicBalance, setBasicBalance] = useState({ amount: 0, symbol: 'SUI' });
  const [basicAvatarUrl, setBasicAvatarUrl] = useState('');
  
  const [primaryConnected, setPrimaryConnected] = useState(false);
  const [primaryWalletAddress, setPrimaryWalletAddress] = useState('');
  
  const [secondaryConnected, setSecondaryConnected] = useState(false);
  const [secondaryWalletAddress, setSecondaryWalletAddress] = useState('');
  
  const [outlineConnected, setOutlineConnected] = useState(false);
  const [outlineWalletAddress, setOutlineWalletAddress] = useState('');
  
  const [customConnected, setCustomConnected] = useState(false);
  const [customWalletAddress, setCustomWalletAddress] = useState('');
  const [customWalletName, setCustomWalletName] = useState('Sui Wallet');
  
  // 为特性示例添加独立状态
  const [avatarConnected, setAvatarConnected] = useState(false);
  const [avatarWalletAddress, setAvatarWalletAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [balanceConnected, setBalanceConnected] = useState(false);
  const [balanceWalletAddress, setBalanceWalletAddress] = useState('');
  const [balanceValue, setBalanceValue] = useState({ amount: 0, symbol: 'SUI' });
  
  const [profileConnected, setProfileConnected] = useState(false);
  const [profileWalletAddress, setProfileWalletAddress] = useState('');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [profileBalance, setProfileBalance] = useState({ amount: 0, symbol: 'SUI' });
  const [profileWalletName, setProfileWalletName] = useState('My Sui Wallet');

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

  // 生成随机头像的函数
  const getRandomAvatar = () => {
    const id = Math.floor(Math.random() * 1000);
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`;
  };

  // 生成随机余额的函数
  const getRandomBalance = () => {
    return {
      amount: parseFloat((Math.random() * 100).toFixed(4)),
      symbol: 'SUI'
    };
  };

  // 为每个按钮创建独立的连接和断开连接处理函数
  const generateAddress = () => '0x' + Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
  
  const handleBasicConnect = () => {
    setBasicConnected(true);
    setBasicWalletAddress(generateAddress());
    setBasicBalance(getRandomBalance());
  };
  
  const handleBasicDisconnect = () => {
    setBasicConnected(false);
    setBasicWalletAddress('');
    setBasicAvatarUrl('');
    setBasicBalance({ amount: 0, symbol: 'SUI' });
  };
  
  const handlePrimaryConnect = () => {
    setPrimaryConnected(true);
    setPrimaryWalletAddress(generateAddress());
  };
  
  const handlePrimaryDisconnect = () => {
    setPrimaryConnected(false);
    setPrimaryWalletAddress('');
  };
  
  const handleSecondaryConnect = () => {
    setSecondaryConnected(true);
    setSecondaryWalletAddress(generateAddress());
  };
  
  const handleSecondaryDisconnect = () => {
    setSecondaryConnected(false);
    setSecondaryWalletAddress('');
  };
  
  const handleOutlineConnect = () => {
    setOutlineConnected(true);
    setOutlineWalletAddress(generateAddress());
  };
  
  const handleOutlineDisconnect = () => {
    setOutlineConnected(false);
    setOutlineWalletAddress('');
  };
  
  const handleCustomConnect = () => {
    setCustomConnected(true);
    setCustomWalletAddress(generateAddress());
  };
  
  const handleCustomDisconnect = () => {
    setCustomConnected(false);
    setCustomWalletAddress('');
  };
  
  // 为特性示例创建单独的处理函数
  const handleAvatarConnect = () => {
    setAvatarConnected(true);
    setAvatarWalletAddress(generateAddress());
    setAvatarUrl(getRandomAvatar());
  };
  
  const handleAvatarDisconnect = () => {
    setAvatarConnected(false);
    setAvatarWalletAddress('');
    setAvatarUrl('');
  };
  
  const handleBalanceConnect = () => {
    setBalanceConnected(true);
    setBalanceWalletAddress(generateAddress());
    setBalanceValue(getRandomBalance());
  };
  
  const handleBalanceDisconnect = () => {
    setBalanceConnected(false);
    setBalanceWalletAddress('');
    setBalanceValue({ amount: 0, symbol: 'SUI' });
  };
  
  const handleProfileConnect = () => {
    setProfileConnected(true);
    setProfileWalletAddress(generateAddress());
    setProfileAvatarUrl(getRandomAvatar());
    setProfileBalance(getRandomBalance());
  };
  
  const handleProfileDisconnect = () => {
    setProfileConnected(false);
    setProfileWalletAddress('');
    setProfileAvatarUrl('');
    setProfileBalance({ amount: 0, symbol: 'SUI' });
  };

  // Source code
  const sourceCode = `import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ConnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  connectedText?: string;
  isConnected?: boolean;
  walletAddress?: string;
  showAddress?: boolean;
  walletName?: string;
  walletIcon?: React.ReactNode;
  onConnect?: (walletId?: string) => void;
  onDisconnect?: () => void;
  avatarUrl?: string;
  balance?: {
    amount: number;
    symbol: string;
  };
  showBalance?: boolean;
}

/**
 * ConnectButton - A button for connecting to web3 wallets
 */
export const ConnectButton = ({
  className,
  variant = 'primary',
  size = 'md',
  text = 'Connect Wallet',
  connectedText = 'Connected',
  isConnected = false,
  walletAddress = '',
  showAddress = true,
  walletName,
  walletIcon,
  onConnect,
  onDisconnect,
  avatarUrl,
  balance,
  showBalance = false,
  ...props
}: ConnectButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format address for display (shortened format)
  const formatAddress = (address: string) => {
    if (!address) return '';
    return \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
  };

  // Format balance for display
  const formatBalance = (amount: number, symbol: string) => {
    return \`\${amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })} \${symbol}\`;
  };

  const handleButtonClick = () => {
    if (isConnected) {
      // If connected, toggle dropdown
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      // If not connected, directly trigger connect callback
      onConnect?.('default-wallet-id');
    }
  };

  const handleDisconnect = () => {
    setIsDropdownOpen(false);
    onDisconnect?.();
  };

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  // Button inner content
  const buttonContent = isConnected ? (
    <div className="flex items-center">
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt="Wallet Avatar" 
          className="w-5 h-5 rounded-full mr-2 object-cover"
        />
      ) : walletIcon ? (
        <span className="mr-2">{walletIcon}</span>
      ) : (
        <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
      )}
      <div className="flex items-center">
        {showAddress && walletAddress ? formatAddress(walletAddress) : (walletName || connectedText)}
        {showBalance && balance && (
          <span className="ml-2 text-xs opacity-80 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {formatBalance(balance.amount, balance.symbol)}
          </span>
        )}
      </div>
    </div>
  ) : (
    text
  );

  return (
    <div className="relative">
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          // Variant styles - 支持暗色/亮色模式
          variant === 'primary' && 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
          variant === 'secondary' && 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800',
          variant === 'outline' && 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/50',
          // Size styles
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-base',
          size === 'lg' && 'h-12 px-6 text-lg',
          // Custom styles
          className
        )}
        onClick={handleButtonClick}
        {...props}
      >
        {buttonContent}
        {isConnected && (
          <svg
            className={cn("ml-2 h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Connected state dropdown */}
      {isConnected && isDropdownOpen && (
        <div 
          className={cn(
            "absolute right-0 mt-2 w-48 rounded-md border z-50",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
            "bg-white border-gray-200 text-gray-800",
            "shadow-[0_4px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_0px_rgba(0,0,0,0.5)]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile section */}
          <div className="p-4 border-b dark:border-gray-700 border-gray-200">
            <div className="flex items-center">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Wallet Avatar" 
                  className="w-12 h-12 rounded-full mr-3 object-cover border-2 dark:border-gray-600 border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full mr-3 bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white">
                  {walletAddress ? walletAddress.substring(2, 4).toUpperCase() : '??'}
                </div>
              )}
              <div>
                <p className="text-sm dark:text-white text-gray-800 font-medium">
                  {walletName || 'My Wallet'}
                </p>
                <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">
                  {formatAddress(walletAddress)}
                </p>
                {balance && (
                  <div className="flex items-center text-xs dark:text-gray-300 text-gray-600 font-medium mt-1 bg-gray-100 dark:bg-gray-700/70 px-2 py-0.5 rounded-full max-w-fit">
                    {formatBalance(balance.amount, balance.symbol)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions section */}
          <div className="py-1">
            <button
              className="w-full text-left block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(walletAddress);
                }
              }}
            >
              Copy Address
            </button>
            {walletAddress && (
              <a
                href={\`https://explorer.sui.io/address/\${walletAddress}\`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100"
              >
                View in Explorer
              </a>
            )}
            <button
              className="w-full text-left block px-4 py-2 text-sm dark:text-red-400 text-red-500 dark:hover:bg-gray-700 hover:bg-gray-100"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Backdrop when dropdown is open */}
      {isConnected && isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClickOutside}
        />
      )}
    </div>
  );
};`;

  // Example usage code
  const example = [
    {
      title: 'Example.tsx',
      code: `import React, { useState } from 'react';
import { ConnectButton } from '@/app/components/connect-button/components/ConnectButton';

export default function App() {
  // State variables
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Optional: state variables for advanced features
  const [avatarUrl, setAvatarUrl] = useState('');
  const [balance, setBalance] = useState({ amount: 0, symbol: 'SUI' });
  const [walletName, setWalletName] = useState('');

  // Connect wallet handler
  const handleConnect = (walletId?: string) => {
    console.log('Connecting wallet with ID:', walletId);
    setIsConnected(true);
    
    // Simulate getting wallet address
    const address = '0x' + Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
    setWalletAddress(address);
    
    // Optional: set avatar, balance and wallet name
    // In real applications, this data should be retrieved from wallet connection API
    setWalletName('My Sui Wallet');
    
    // Generate random avatar for testing
    const id = Math.floor(Math.random() * 1000);
    setAvatarUrl(\`https://api.dicebear.com/7.x/bottts/svg?seed=\${id}\`);
    
    // Simulate getting token balance
    setBalance({
      amount: parseFloat((Math.random() * 100).toFixed(4)),
      symbol: 'SUI'
    });
  };

  // Disconnect wallet handler
  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setAvatarUrl('');
    setBalance({ amount: 0, symbol: 'SUI' });
    setWalletName('');
  };

  return (
    <div className="space-y-8">
      {/* Basic usage */}
      <div>
        <h2 className="text-xl font-bold">Basic Connect Button</h2>
        <ConnectButton
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
          walletAddress={walletAddress}
        />
      </div>
      
      {/* With dropdown functionality */}
      <div>
        <h2 className="text-xl font-bold">Connect Button with Dropdown</h2>
        <p className="text-sm text-gray-500 mb-2">Click the button when connected to see the dropdown menu</p>
        <ConnectButton
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
          walletAddress={walletAddress}
        />
      </div>
      
      {/* With avatar and balance */}
      <div>
        <h2 className="text-xl font-bold">Connect Button with Profile</h2>
        <ConnectButton
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
          walletAddress={walletAddress}
          
          // Avatar URL (from wallet or generated)
          avatarUrl={avatarUrl}
          
          // Balance information
          balance={balance}      // contains amount and symbol
          showBalance={true}     // controls balance visibility
          
          // Wallet name
          walletName={walletName}
        />
      </div>
      
      {/* Custom styling */}
      <div>
        <h2 className="text-xl font-bold">Custom Styled Button</h2>
        <ConnectButton
          variant="outline"
          size="lg"
          text="Connect Custom Wallet"
          connectedText="Wallet Connected"
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
          walletAddress={walletAddress}
          showAddress={false}
          walletName={walletName}
        />
      </div>
    </div>
  );
}`,
    },
  ];

  // Props data
  const propsData = [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline'",
      description: 'The style variant of the button.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'The size of the button.',
    },
    {
      name: 'text',
      type: 'string',
      description: 'Text displayed when not connected.',
    },
    {
      name: 'connectedText',
      type: 'string',
      description: 'Text displayed when connected (when showAddress is false).',
    },
    {
      name: 'isConnected',
      type: 'boolean',
      description: 'Whether a wallet is connected.',
    },
    {
      name: 'walletAddress',
      type: 'string',
      description: 'The connected wallet address.',
    },
    {
      name: 'showAddress',
      type: 'boolean',
      description: 'Whether to show the wallet address when connected.',
    },
    {
      name: 'walletName',
      type: 'string',
      description: 'The name of the connected wallet.',
    },
    {
      name: 'avatarUrl',
      type: 'string',
      description: 'URL to the wallet avatar image.',
    },
    {
      name: 'balance',
      type: '{ amount: number; symbol: string }',
      description: 'Wallet balance information with amount and currency symbol.',
    },
    {
      name: 'showBalance',
      type: 'boolean',
      description: 'Whether to show the wallet balance when connected.',
    },
    {
      name: 'onConnect',
      type: '() => void',
      description: 'Callback function when wallet is connected.',
    },
    {
      name: 'onDisconnect',
      type: '() => void',
      description: 'Callback function when wallet is disconnected.',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">Connect Wallet Button</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A core Web3 component for SuiFlow UI that handles the wallet connection process and displays different wallet connection states.
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
                <div className={darkMode ? "dark" : ""}>
                  <div className="space-y-8">
                    {/* Basic Connect Button */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-white">Basic Connect Button</h3>
                      <div className="flex justify-start relative w-48">
                        <ConnectButton
                          onConnect={handleBasicConnect}
                          onDisconnect={handleBasicDisconnect}
                          isConnected={basicConnected}
                          walletAddress={basicWalletAddress}
                        />
                      </div>
                    </div>
                    
                    {/* Custom Text */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-white">Custom Text</h3>
                      <div className="flex justify-start">
                        <ConnectButton
                          text="Connect Sui Wallet"
                          connectedText="Connected to Sui"
                          onConnect={handleCustomConnect}
                          onDisconnect={handleCustomDisconnect}
                          isConnected={customConnected}
                          walletAddress={customWalletAddress}
                          walletName={customWalletName}
                          showAddress={false}
                        />
                      </div>
                    </div>

                    {/* Avatar Feature */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-white">With Avatar</h3>
                      <div className="flex flex-col items-start">
                        <ConnectButton
                          variant="primary"
                          text="Connect with Avatar"
                          onConnect={handleAvatarConnect}
                          onDisconnect={handleAvatarDisconnect}
                          isConnected={avatarConnected}
                          walletAddress={avatarWalletAddress}
                          avatarUrl={avatarUrl}
                        />
                        <p className="text-xs text-gray-400 max-w-md mt-2">
                          Displays user avatar when connected, automatically generated or provided by wallet
                        </p>
                      </div>
                    </div>
                         
                    {/* Balance Display */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-white">With Balance</h3>
                      <div className="flex flex-col items-start">
                        <ConnectButton
                          variant="primary"
                          text="Connect with Balance"
                          onConnect={handleBalanceConnect}
                          onDisconnect={handleBalanceDisconnect}
                          isConnected={balanceConnected}
                          walletAddress={balanceWalletAddress}
                          balance={balanceValue}
                          showBalance={true}
                        />
                        <p className="text-xs text-gray-400 max-w-md mt-2">
                          Shows token balance in the button when connected
                        </p>
                      </div>
                    </div>
                         
                    {/* Complete Profile */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-white">Full Profile Display</h3>
                      <div className="flex flex-col items-start">
                        <ConnectButton
                          variant="primary"
                          text="Connect with Full Profile"
                          onConnect={handleProfileConnect}
                          onDisconnect={handleProfileDisconnect}
                          isConnected={profileConnected}
                          walletAddress={profileWalletAddress}
                          avatarUrl={profileAvatarUrl}
                          balance={profileBalance}
                          showBalance={true}
                          walletName={profileWalletName}
                        />
                        <p className="text-xs text-gray-400 max-w-md mt-2">
                          Complete profile with avatar and balance, click to expand detailed dropdown menu
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                npx @suiflow/ui@latest add connect-wallet
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow/ui@latest add connect-wallet', 1)
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
