'use client';
import React, { useState, useEffect } from 'react';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenInput } from '.';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoinsIcon } from 'lucide-react';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

// Create a client
const queryClient = new QueryClient();

export default function TokenInputPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  
  // State for token input examples
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue3, setInputValue3] = useState('');
  const [inputValue4, setInputValue4] = useState('');

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
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MaximizeIcon } from 'lucide-react';

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
  inputClassName?: string;
  
  // Interaction properties
  onMaxClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const TokenInput = ({
  // Basic properties
  value,
  onChange,
  
  // Token properties
  tokenSymbol,
  tokenDecimals = 9,
  tokenIcon,
  
  // Balance properties
  balance,
  balanceLabel = 'Balance',
  showBalance = true,
  
  // Display options
  showMaxButton = true,
  placeholder = '0.0',
  disabled = false,
  error,
  
  // Style properties
  size = 'md',
  className,
  inputClassName,
  
  // Interaction properties
  onMaxClick,
  onFocus,
  onBlur,
}: TokenInputProps) => {
  // State for the input
  const [isFocused, setIsFocused] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: 'text-xs h-10',
    md: 'text-sm h-12',
    lg: 'text-base h-14',
  };
  
  // Input size mappings
  const inputSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  
  // Ensure value is valid number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    // Only allow valid number inputs with decimals
    const regex = new RegExp(\`^\\d*(\\.\\d{0,\${tokenDecimals}})?$\`);
    if (regex.test(inputValue)) {
      onChange(inputValue);
    }
  };
  
  // Handle MAX button click
  const handleMaxClick = () => {
    if (disabled) return;
    
    if (onMaxClick) {
      onMaxClick();
      return;
    }
    
    if (balance) {
      onChange(balance);
    }
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  // Format balance for display
  const formatBalance = (bal: string) => {
    if (!bal) return '0';
    
    // Try to parse as number
    const numBal = parseFloat(bal);
    if (isNaN(numBal)) return bal;
    
    // Format with appropriate decimal places
    if (numBal > 1000000) {
      return \`\${(numBal / 1000000).toFixed(2)}M\`;
    } else if (numBal > 1000) {
      return \`\${(numBal / 1000).toFixed(2)}K\`;
    } else {
      // Display full balance with up to tokenDecimals places
      const parts = bal.split('.');
      if (parts.length === 1) return bal;
      
      // Trim trailing zeros
      const decimalPart = parts[1].replace(/0+$/, '');
      if (decimalPart === '') return parts[0];
      
      return \`\${parts[0]}.\${decimalPart}\`;
    }
  };
  
  return (
    <div className={cn('w-full', className)}>
      {/* Top row with balance info */}
      {showBalance && (
        <div className="flex justify-end mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {balanceLabel}: {formatBalance(balance || '0')} {tokenSymbol}
          </span>
        </div>
      )}
      
      {/* Main input container */}
      <div
        className={cn(
          'flex items-center w-full rounded-md border px-3 bg-white dark:bg-gray-800',
          sizeClasses[size],
          isFocused && 'ring-2 ring-offset-1 ring-blue-500',
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
          disabled && 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
          'transition-all duration-200'
        )}
      >
        {/* Token icon if provided */}
        {tokenIcon && (
          <div className="mr-2 flex-shrink-0">
            {tokenIcon}
          </div>
        )}
        
        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full outline-none bg-transparent',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'text-gray-900 dark:text-gray-100',
            'font-medium',
            inputSizeClasses[size],
            inputClassName
          )}
        />
        
        {/* Token symbol */}
        {tokenSymbol && (
          <div className="ml-2 text-gray-500 dark:text-gray-400 font-medium">
            {tokenSymbol}
          </div>
        )}
        
        {/* MAX button */}
        {showMaxButton && balance && (
          <button
            onClick={handleMaxClick}
            disabled={disabled}
            className={cn(
              'ml-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs',
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-600',
              'transition-colors',
              'font-medium',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <MaximizeIcon size={12} />
            <span>MAX</span>
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
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
      title: 'Basic Usage',
      code: `const [value, setValue] = useState('');

<TokenInput 
  value={value}
  onChange={setValue}
  tokenSymbol="SUI"
  balance="1000.5"
/>`,
    },
    {
      title: 'With Custom Max Button Handler',
      code: `const [value, setValue] = useState('');
const balance = "1250.75";

const handleMaxClick = () => {
  // You can apply custom logic here, like subtracting gas fees
  const maxValue = parseFloat(balance) - 0.01;
  setValue(maxValue.toString());
};

<TokenInput 
  value={value}
  onChange={setValue}
  tokenSymbol="SUI"
  balance={balance}
  onMaxClick={handleMaxClick}
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
    { name: 'disabled', type: 'boolean', description: 'Whether the input is disabled' },
    { name: 'error', type: 'string', description: 'Error message to display' },
    { name: 'size', type: '"sm" | "md" | "lg"', description: 'Size of the input component' },
    { name: 'className', type: 'string', description: 'Additional CSS class for the container' },
    { name: 'inputClassName', type: 'string', description: 'Additional CSS class for the input element' },
    { name: 'onMaxClick', type: '() => void', description: 'Custom handler for MAX button click' },
    { name: 'onFocus', type: '() => void', description: 'Handler for input focus event' },
    { name: 'onBlur', type: '() => void', description: 'Handler for input blur event' },
  ];

  const tokenIconExample = <CoinsIcon className="text-yellow-500" size={24} />;

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">Token Input Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A customizable input component for token amounts with support for balance display and MAX button.
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
                  <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                    <div className={darkMode ? "dark" : ""}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Basic Example */}
                        <div>
                          <h3 className="text-sm font-medium mb-4 text-white">Basic Token Input</h3>
                          <div className="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <TokenInput 
                              value={inputValue1} 
                              onChange={setInputValue1}
                              tokenSymbol="SUI"
                              balance="1000.5"
                            />
                          </div>
                        </div>
                        
                        {/* With Token Icon */}
                        <div>
                          <h3 className="text-sm font-medium mb-4 text-white">With Token Icon</h3>
                          <div className="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <TokenInput 
                              value={inputValue2} 
                              onChange={setInputValue2}
                              tokenSymbol="SUI"
                              tokenIcon={tokenIconExample}
                              balance="1000.5"
                            />
                          </div>
                        </div>
                        
                        {/* With Error State */}
                        <div>
                          <h3 className="text-sm font-medium mb-4 text-white">With Error State</h3>
                          <div className="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <TokenInput 
                              value={inputValue3} 
                              onChange={setInputValue3}
                              tokenSymbol="SUI"
                              balance="1000.5"
                              error="Insufficient balance"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Different Sizes */}
                      <div className="mt-8">
                        <h3 className="text-sm font-medium mb-4 text-white">Different Sizes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <TokenInput 
                              value={inputValue4}
                              onChange={setInputValue4}
                              tokenSymbol="SUI"
                              balance="1000.5"
                              size="sm"
                            />
                            <div className="mt-2 text-xs text-center text-white">Small</div>
                          </div>
                          <div className="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <TokenInput 
                              value={inputValue4}
                              onChange={setInputValue4}
                              tokenSymbol="SUI"
                              balance="1000.5"
                              size="md"
                            />
                            <div className="mt-2 text-xs text-center text-white">Medium</div>
                          </div>
                          <div className="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <TokenInput 
                              value={inputValue4}
                              onChange={setInputValue4}
                              tokenSymbol="SUI"
                              balance="1000.5"
                              size="lg"
                            />
                            <div className="mt-2 text-xs text-center text-white">Large</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Disabled State */}
                      <div className="mt-8">
                        <h3 className="text-sm font-medium mb-4 text-white">Disabled State</h3>
                        <div className="max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg">
                          <TokenInput 
                            value="100"
                            onChange={() => {}}
                            tokenSymbol="SUI"
                            balance="1000.5"
                            disabled
                          />
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
          <div className="absolute sm:ml-3">
            <pre className="bg-[#0A1428] p-3 rounded-md overflow-auto text-sm sm:text-base w-[350px] sm:w-[600px] border border-[#2A3746]">
              <code className="text-zinc-300">
                npx @suiflow-ui@latest add tokeninput
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow-ui@latest add tokeninput', 1)
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
