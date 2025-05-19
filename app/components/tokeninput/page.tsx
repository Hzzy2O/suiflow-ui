'use client';
import React, { useState, useEffect } from 'react';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenInput } from '.';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoinsIcon } from 'lucide-react';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';

// Create a client
const queryClient = new QueryClient();

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

export default function TokenInputPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  
  // State for token input examples
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue4, setInputValue4] = useState('');
  
  // Example token addresses on Sui
  const tokenAddresses = [
    SUI_TYPE_ARG, // Native SUI token
    '0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL',
    '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
  ];

  // Example pre-defined token data (instead of fetching from blockchain)
  const predefinedTokens = [
    {
      address: '0x2::sui::SUI',
      symbol: 'SUI',
      name: 'Sui',
      decimals: 9,
      iconUrl: 'https://strapi-dev.scand.app/uploads/sui_c07df05f00.png',
      balance: '2500.75'
    },
    {
      address: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 8,
      iconUrl: 'https://strapi-dev.scand.app/uploads/usdc_019d7ef24b.png',
      balance: '0.05'
    },
    {
      address: '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      iconUrl: 'https://strapi-dev.scand.app/uploads/usdt_15663b1a77.png',
      balance: '1000.00'
    }
  ];

  const [selectedPredefinedToken, setSelectedPredefinedToken] = useState(predefinedTokens[0]);

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

  const handleTokenSelect = (tokenAddress: string, tokenInfo: any) => {
    console.log('Selected token:', tokenInfo.symbol);
  };

  const handlePredefinedTokenSelect = (tokenAddress: string, tokenInfo: any) => {
    console.log('Selected predefined token:', tokenInfo.symbol);
    setSelectedPredefinedToken(tokenInfo);
  };

  // Source code section showing balance and options in the same row
  const sourceCode = `import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MaximizeIcon, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { SuiClient } from '@mysten/sui/client';

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  iconUrl?: string;
  balance?: string;
}

export interface TokenInputProps {
  // Basic properties
  value: string;
  onChange: (value: string) => void;
  
  // Token properties
  tokenSymbol?: string;
  tokenDecimals?: number;
  tokenIcon?: React.ReactNode;
  
  // Balance properties
  balance?: string;
  balanceLabel?: string;
  showBalance?: boolean;
  
  // Display options
  showMaxButton?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  
  // Style properties
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // Token selection properties
  tokenAddresses?: string[];
  tokens?: TokenInfo[];  // Predefined token data
  selectedTokenAddress?: string;
  onTokenSelect?: (tokenAddress: string, tokenInfo: TokenInfo) => void;
  showTokenSelector?: boolean;
  
  // Helper features
  percentageOptions?: number[]; // Array of percentage values (e.g., [25, 50, 75, 100])
  fixedAmountOptions?: string[]; // Array of fixed amount values (e.g., ["10", "100", "1000"])
  showRefreshButton?: boolean;
  onRefreshBalance?: () => Promise<void> | void;
}

const TokenInput = (props: TokenInputProps) => {
  const {
    value,
    onChange,
    tokenSymbol,
    balance,
    balanceLabel = 'Balance',
    showBalance = true,
    showMaxButton = true,
    showTokenSelector = false,
    percentageOptions,
    fixedAmountOptions,
    showRefreshButton = false,
    onRefreshBalance
  } = props;
  
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simplified sample functions
  const handlePercentageClick = (percentage: number) => {
    if (balance) {
      const numericBalance = parseFloat(balance);
      const percentageValue = (numericBalance * percentage / 100).toString();
      onChange(percentageValue);
    }
  };
  
  const handleFixedAmountClick = (amount: string) => {
    onChange(amount);
  };
  
  const handleRefreshBalance = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (onRefreshBalance) {
        await onRefreshBalance();
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // For display purposes
  const getCurrentSymbol = () => {
    if (selectedToken) {
      return selectedToken.symbol;
    }
    return tokenSymbol || '';
  };
  
  const getTokenIcon = () => {
    if (selectedToken?.iconUrl) {
      return <img src={selectedToken.iconUrl} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />;
    }
    return null;
  };
  
  return (
    <div className="w-full">
      {/* Top row with balance info and options */}
      {showBalance && (
        <div className="flex justify-between items-center mb-1.5 flex-wrap gap-y-1">
          {/* Balance on the left */}
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {balanceLabel}: {balance || selectedToken?.balance || '0'} {getCurrentSymbol()}
            </span>
            
            {/* Refresh balance button */}
            {showRefreshButton && (
              <button
                onClick={handleRefreshBalance}
                className="ml-1.5 p-0.5 rounded-full text-gray-400 hover:text-gray-600"
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              </button>
            )}
          </div>
          
          {/* Options stacked on the right */}
          <div className="flex flex-col items-end gap-1">
            {/* Percentage options on one row */}
            {percentageOptions && percentageOptions.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {percentageOptions.map((percentage) => (
                  <button
                    key={\`percent-\${percentage}\`}
                    onClick={() => handlePercentageClick(percentage)}
                    className="px-1.5 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            )}
            
            {/* Fixed amount options on another row */}
            {fixedAmountOptions && fixedAmountOptions.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {fixedAmountOptions.map((amount) => (
                  <button
                    key={\`amount-\${amount}\`}
                    onClick={() => handleFixedAmountClick(amount)}
                    className="px-1.5 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main input field and token selector */}
      <div className="flex items-center w-full rounded-xl px-4 bg-gray-50 dark:bg-gray-800/60 shadow-[0_0_0_1px] shadow-gray-200 dark:shadow-gray-700/50">
        {/* Token selector */}
        {showTokenSelector && (
          <button
            type="button"
            onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
            className="flex items-center gap-2 pr-3 mr-3 border-r"
          >
            {getTokenIcon()}
            <span className="font-medium">{getCurrentSymbol()}</span>
            <ChevronDown size={16} />
          </button>
        )}
        
        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.0"
          className="w-full outline-none bg-transparent text-xl font-medium"
        />
        
        {/* MAX button */}
        {showMaxButton && balance && (
          <button
            onClick={() => onChange(balance)}
            className="ml-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white/80 dark:bg-gray-700/50"
          >
            <MaximizeIcon size={12} />
            <span>MAX</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TokenInput;`;

  // Create example files for SuiFlowExampleBlock
  const exampleFiles = [
    {
      title: 'Installation',
      code: 'npm install @mysten/sui',
    },
    {
      title: 'Import',
      code: "import { TokenInput } from '@/components/tokeninput';",
    },
    {
      title: 'With Token Selector (Blockchain Query)',
      code: `const [value, setValue] = useState('');

// Example token addresses
const tokenAddresses = [
  '0x2::sui::SUI',  // SUI token
  '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::CETUS'
];

const handleTokenSelect = (tokenAddress, tokenInfo) => {
  // Handle token selection if needed
  console.log('Selected token:', tokenInfo.symbol);
};

<TokenInput 
  value={value}
  onChange={setValue}
  showTokenSelector={true}
  tokenAddresses={tokenAddresses}
  onTokenSelect={handleTokenSelect}
  showRefreshButton={true}
/>`,
    },
    {
      title: 'With Percentage Options',
      code: `const [value, setValue] = useState('');

<TokenInput 
  value={value}
  onChange={setValue}
  tokenSymbol="SUI"
  balance="1000.5"
  // Add percentage options (25%, 50%, 75%, 100%)
  percentageOptions={[25, 50, 75, 100]}
  showRefreshButton={true}
/>`,
    },
    {
      title: 'With Fixed Amount Options',
      code: `const [value, setValue] = useState('');

// Example predefined tokens with data already provided
const predefinedTokens = [
  {
    address: '0x2::sui::SUI',
    symbol: 'SUI',
    name: 'Sui',
    decimals: 9,
    iconUrl: 'https://example.com/sui-icon.png',
    balance: '2500.75'
  },
  {
    address: '0xDEMO::token::BTC',
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    iconUrl: 'https://example.com/btc-icon.png',
    balance: '0.05'
  }
];

// Refresh balance function
const refreshBalance = async () => {
  console.log('Refreshing balance...');
  // Simulate or implement actual balance refresh
  return new Promise(resolve => setTimeout(resolve, 1000));
};

<TokenInput 
  value={value}
  onChange={setValue}
  showTokenSelector={true}
  tokens={predefinedTokens}
  selectedTokenAddress={predefinedTokens[0].address}
  // Add fixed amount options
  fixedAmountOptions={["0.1", "1", "10", "100"]}
  showRefreshButton={true}
  onRefreshBalance={refreshBalance}
/>`,
    },
  ];

  const propsData = [
    { name: 'value', type: 'string', description: 'Current value of the input' },
    { name: 'onChange', type: '(value: string) => void', description: 'Function called when input value changes' },
    { name: 'tokenSymbol', type: 'string', description: 'Symbol of the token (e.g., "SUI")' },
    { name: 'tokenDecimals', type: 'number', description: 'Number of decimal places for the token' },
    { name: 'tokenIcon', type: 'React.ReactNode', description: 'Icon component for the token' },
    { name: 'balance', type: 'string', description: 'Available balance of the token' },
    { name: 'balanceLabel', type: 'string', description: 'Label for the balance display' },
    { name: 'showBalance', type: 'boolean', description: 'Whether to show the balance display' },
    { name: 'showMaxButton', type: 'boolean', description: 'Whether to show the MAX button' },
    { name: 'placeholder', type: 'string', description: 'Placeholder text when input is empty' },
    { name: 'error', type: 'string', description: 'Error message to display' },
    { name: 'size', type: '"sm" | "md" | "lg"', description: 'Size of the input component' },
    { name: 'showTokenSelector', type: 'boolean', description: 'Whether to show the token selector dropdown' },
    { name: 'tokenAddresses', type: 'string[]', description: 'Array of token addresses to fetch from blockchain' },
    { name: 'tokens', type: 'TokenInfo[]', description: 'Array of predefined token data objects to use instead of fetching from blockchain' },
    { name: 'onTokenSelect', type: '(address: string, tokenInfo: TokenInfo) => void', description: 'Callback when a token is selected' },
    { name: 'showRefreshButton', type: 'boolean', description: 'Whether to show the refresh balance button' },
    { name: 'percentageOptions', type: 'number[]', description: 'Array of percentage options (e.g., [25, 50, 75, 100]) to display as shortcut buttons' },
    { name: 'fixedAmountOptions', type: 'string[]', description: 'Array of fixed amount options (e.g., ["0.1", "1", "10"]) to display as shortcut buttons' },
    { name: 'onRefreshBalance', type: '() => Promise<void> | void', description: 'Callback when refresh balance button is clicked' },
  ];

  const tokenIconExample = <CoinsIcon className="text-yellow-500" size={24} />;

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">Token Input Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A customizable input component for token amounts with token selection dropdown, balance display and MAX button.
          Designed to match the Sui design language.
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
                    <WalletProvider
                      slushWallet={{
                        name: 'suiflow-ui',
                      }}
                    >
                      <div className={darkMode ? "dark" : ""}>
                        <div className="grid grid-cols-1 gap-8">
                          {/* With Blockchain-Queried Token Selector */}
                          <div>
                            <h3 className="text-sm font-medium mb-4 text-white">With Blockchain-Queried Token Selector</h3>
                            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                              <TokenInput 
                                value={inputValue2} 
                                onChange={setInputValue2}
                                tokenAddresses={tokenAddresses}
                                showTokenSelector={true}
                                onTokenSelect={handleTokenSelect}
                                showRefreshButton={true}
                              />
                            </div>
                          </div>

                          {/* With Percentage Options */}
                          <div>
                            <h3 className="text-sm font-medium mb-4 text-white">With Percentage Options</h3>
                            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                              <TokenInput 
                                value={inputValue4} 
                                onChange={setInputValue4}
                                tokens={predefinedTokens}
                                selectedTokenAddress={predefinedTokens[0].address}
                                showTokenSelector={true}
                                percentageOptions={[25, 50, 75, 100]}
                                showRefreshButton={true}
                              />
                            </div>
                          </div>

                          {/* With Fixed Amount Options */}
                          <div>
                            <h3 className="text-sm font-medium mb-4 text-white">With Fixed Amount Options</h3>
                            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                              <TokenInput 
                                value={inputValue4} 
                                onChange={setInputValue4}
                                tokens={predefinedTokens}
                                selectedTokenAddress={predefinedTokens[0].address}
                                showTokenSelector={true}
                                fixedAmountOptions={["0.1", "1", "10", "100"]}
                                showRefreshButton={true}
                                onRefreshBalance={() => {
                                  console.log("Refreshing balance...");
                                  // Simulate balance refresh
                                  return new Promise((resolve) => {
                                    setTimeout(() => {
                                      console.log("Balance refreshed");
                                      resolve();
                                    }, 1000);
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </WalletProvider>
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
                npx @suiflow/ui@latest add tokeninput
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow/ui@latest add tokeninput', 1)
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

        <SuiFlowExampleBlock files={exampleFiles} />

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
