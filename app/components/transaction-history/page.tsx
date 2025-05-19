'use client';
import React, { useState, useEffect } from 'react';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionHistoryList } from '.';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

// Create a client
const queryClient = new QueryClient();

export default function TransactionHistoryPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState('list');

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

  // Sample transaction data for the previews
  const sampleTransactions = [
    {
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'Transfer',
      status: 'success' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      sender: '0xabcdef1234567890abcdef1234567890abcdef12',
      recipient: '0x7890abcdef1234567890abcdef1234567890abcd',
      amount: '1.5 SUI',
    },
    {
      txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      type: 'Call',
      status: 'pending' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      sender: '0xabcdef1234567890abcdef1234567890abcdef12',
      objectId: '134561091',
    },
    {
      txHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abc',
      type: 'Publish',
      status: 'failed' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      sender: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
  ];

  // Props for the components
  const transactionHistoryItemProps = [
    {
      name: 'txHash',
      type: 'string',
      description: 'The transaction hash',
      required: true,
    },
    {
      name: 'type',
      type: 'string',
      description: 'The type of transaction (e.g., Transfer, Call, Publish)',
      required: true,
    },
    {
      name: 'status',
      type: "'success' | 'failed' | 'pending'",
      description: 'The status of the transaction',
      required: true,
    },
    {
      name: 'timestamp',
      type: 'Date | number',
      description: 'The timestamp when the transaction occurred',
      required: true,
    },
    {
      name: 'sender',
      type: 'string',
      description: 'The address of the sender',
      required: true,
    },
    {
      name: 'recipient',
      type: 'string',
      description: 'The address of the recipient (for transfers)',
      required: false,
    },
    {
      name: 'amount',
      type: 'string',
      description: 'The amount transferred (for transfers)',
      required: false,
    },
    {
      name: 'objectId',
      type: 'string',
      description: 'The ID of the object involved in the transaction or checkpoint',
      required: false,
    },
    {
      name: 'showExplorerLink',
      type: 'boolean',
      description: 'Whether to show a link to the explorer',
      required: false,
      defaultValue: 'true',
    },
    {
      name: 'showCopyButton',
      type: 'boolean',
      description: 'Whether to show a button to copy the transaction hash',
      required: false,
      defaultValue: 'true',
    },
    {
      name: 'explorerUrl',
      type: 'string',
      description: 'The base URL of the explorer',
      required: false,
      defaultValue: "'https://suiexplorer.com/txblock/'",
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
      required: false,
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Callback when the component is clicked',
      required: false,
    },
  ];

  const transactionHistoryListProps = [
    {
      name: 'transactions',
      type: 'Omit<TransactionHistoryItemProps, "onClick">[]',
      description: 'Array of transaction data to display',
      required: true,
    },
    {
      name: 'page',
      type: 'number',
      description: 'Current page number for pagination',
      required: false,
      defaultValue: '1',
    },
    {
      name: 'pageSize',
      type: 'number',
      description: 'Number of transactions per page',
      required: false,
      defaultValue: '10',
    },
    {
      name: 'totalPages',
      type: 'number',
      description: 'Total number of pages',
      required: false,
      defaultValue: '1',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Whether the transactions are loading',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'filterOptions',
      type: '{ types?: string[]; status?: ("success" | "failed" | "pending")[]; }',
      description: 'Options for filtering transactions',
      required: false,
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes',
      required: false,
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: 'Callback when the page changes',
      required: false,
    },
    {
      name: 'onFilterChange',
      type: '(filters: { type?: string; status?: string }) => void',
      description: 'Callback when filters change',
      required: false,
    },
    {
      name: 'onTransactionClick',
      type: '(txHash: string) => void',
      description: 'Callback when a transaction is clicked',
      required: false,
    },
    {
      name: 'onLoadMore',
      type: '() => void',
      description: 'Callback when the "Load More" button is clicked (if provided, pagination is replaced with this button)',
      required: false,
    },
    {
      name: 'explorerUrl',
      type: 'string',
      description: 'The base URL of the explorer',
      required: false,
      defaultValue: "'https://suiexplorer.com/txblock/'",
    },
  ];

  // Prepare props data for PropsTable component
  const itemPropsData = transactionHistoryItemProps.map(prop => ({
    name: prop.name,
    type: prop.type + (prop.required ? ' (required)' : ''),
    description: prop.defaultValue ? `${prop.description} (Default: ${prop.defaultValue})` : prop.description
  }));

  const listPropsData = transactionHistoryListProps.map(prop => ({
    name: prop.name,
    type: prop.type + (prop.required ? ' (required)' : ''),
    description: prop.defaultValue ? `${prop.description} (Default: ${prop.defaultValue})` : prop.description
  }));

  // Examples
  const examples = [
    {
      title: "Basic Usage",
      code: `<TransactionHistoryList 
  transactions={transactions}
/>`
    },
    {
      title: "With Filtering",
      code: `<TransactionHistoryList 
  transactions={transactions}
  filterOptions={{
    types: ['Transfer', 'Call', 'Publish'],
    status: ['success', 'failed', 'pending']
  }}
/>`
    },
    {
      title: "With Pagination",
      code: `<TransactionHistoryList 
  transactions={transactions}
  page={1}
  pageSize={10}
  totalPages={5}
  onPageChange={(page) => console.log('Page changed:', page)}
/>`
    },
    {
      title: "Loading State",
      code: `<TransactionHistoryList 
  transactions={[]}
  isLoading={true}
/>`
    }
  ];

  // Source code for components
  const itemSourceCode = `// TransactionHistoryItem Component Code
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, Copy, ExternalLink } from 'lucide-react';
import { formatDistance } from 'date-fns';

export interface TransactionHistoryItemProps {
  txHash: string;
  type: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date | number;
  sender: string;
  recipient?: string;
  amount?: string;
  objectId?: string;
  showExplorerLink?: boolean;
  showCopyButton?: boolean;
  explorerUrl?: string;
  className?: string;
  onClick?: () => void;
}

const TransactionHistoryItem = ({
  txHash,
  type,
  status,
  timestamp,
  sender,
  recipient,
  amount,
  objectId,
  showExplorerLink = true,
  showCopyButton = true,
  explorerUrl = 'https://suiexplorer.com/txblock/',
  className,
  onClick,
}) => {
  const [copied, setCopied] = React.useState(false);
  
  const statusIcons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />
  };
  
  // Format and display transaction details
  // Handle click events
  // ...

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border border-[#2A3746] bg-[#0A1428]/80",
      onClick && "cursor-pointer",
      className
    )}>
      {/* Transaction details UI */}
    </div>
  );
};

export default TransactionHistoryItem;`;

  const listSourceCode = `// TransactionHistoryList Component Code
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Filter, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import TransactionHistoryItem from './TransactionHistoryItem';

export interface TransactionHistoryListProps {
  transactions: Array<{
    txHash: string;
    type: string;
    status: 'success' | 'failed' | 'pending';
    timestamp: Date | number;
    sender: string;
    recipient?: string;
    amount?: string;
    objectId?: string;
  }>;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  isLoading?: boolean;
  filterOptions?: {
    types?: string[];
    status?: ("success" | "failed" | "pending")[];
  };
  className?: string;
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: { type?: string; status?: string }) => void;
  onTransactionClick?: (txHash: string) => void;
  onLoadMore?: () => void;
  explorerUrl?: string;
}

const TransactionHistoryList = ({
  transactions,
  page = 1,
  pageSize = 10,
  totalPages = 1,
  isLoading = false,
  filterOptions,
  className,
  onPageChange,
  onFilterChange,
  onTransactionClick,
  onLoadMore,
  explorerUrl = 'https://suiexplorer.com/txblock/'
}) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter handling logic
  // Pagination logic
  // ...

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Filter UI */}
      {/* Transactions table */}
      <div className="overflow-x-auto bg-[#0A1428]/80 border border-[#2A3746] rounded-lg">
        <table className="min-w-full divide-y divide-[#2A3746]">
          <thead>
            {/* Table headers */}
          </thead>
          <tbody>
            {/* Transaction rows or loading skeleton */}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
    </div>
  );
};

export default TransactionHistoryList;`;

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md min-w-0 w-full pt-24 p-5 overflow-x-hidden">
      <span className="text-4xl font-semibold pl-1">Transaction History Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A comprehensive component for displaying blockchain transaction history with filtering, pagination, and customizable styling.
          Perfect for wallets, explorers, and transaction interfaces.
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
              <div className="p-4 md:p-8 relative bg-[#0A1428] border-[#2A3746] rounded-lg" style={{
                backgroundImage: `linear-gradient(to right, rgba(58, 145, 227, 0.07) 1px, transparent 1px), 
                                  linear-gradient(to bottom, rgba(58, 145, 227, 0.07) 1px, transparent 1px)`,
                backgroundSize: '10px 10px',
              }}>
                <QueryClientProvider client={queryClient}>
                  <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
                    <div className={darkMode ? "dark" : ""}>
                      <div className="flex flex-col gap-6 overflow-hidden">
                        {/* Transaction History List */}
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Transaction History List</h3>
                          <div className="max-w-full overflow-x-auto">
                            <TransactionHistoryList 
                              transactions={sampleTransactions}
                              filterOptions={{
                                types: ['Transfer', 'Call', 'Publish'],
                                status: ['success', 'failed', 'pending'],
                              }}
                              onTransactionClick={(txHash) => alert(`Clicked transaction: ${txHash}`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SuiClientProvider>
                </QueryClientProvider>
              </div>
            )}
            {activeTab === 'Code' && (
              <div className="flex flex-col">
                <div className="flex border-b border-[#2A3746] overflow-x-auto">
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${activeCodeTab === 'list' ? 'text-[#6FBCF0] border-b-2 border-[#6FBCF0]' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveCodeTab('list')}
                  >
                    TransactionHistoryList
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium ${activeCodeTab === 'item' ? 'text-[#6FBCF0] border-b-2 border-[#6FBCF0]' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveCodeTab('item')}
                  >
                    TransactionHistoryItem
                  </button>
                </div>
                <div className="max-w-full overflow-x-auto">
                  <SuiFlowSourceCodeBlock
                    codeString={activeCodeTab === 'list' ? listSourceCode : itemSourceCode}
                    language="javascript"
                  />
                </div>
              </div>
            )}
          </div>
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
        <div className="sm:ml-3 relative max-w-[600px]">
          <pre className="bg-[#0A1428] p-3 rounded-md overflow-auto text-sm sm:text-base w-full sm:w-[600px] border border-[#2A3746]">
            <code className="text-zinc-300">
              npx @suiflow/ui@latest add transaction-history
            </code>
          </pre>
          <button
            onClick={() =>
              copyToClipboard('npx @suiflow/ui@latest add transaction-history', 1)
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

      <div className="max-w-full overflow-x-auto">
        <SuiFlowExampleBlock files={examples} />
      </div>

      <div className="max-w-full overflow-x-auto p-1 sm:p-4 mt-20">
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
              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
            />
          </svg>
          <h1 className="text-xl font-semibold ml-2">TransactionHistoryItem Props</h1>
        </div>
        <PropsTable propsData={itemPropsData} />

        <div className="flex items-center mt-10 mb-3">
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
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <h1 className="text-xl font-semibold ml-2">TransactionHistoryList Props</h1>
        </div>
        <PropsTable propsData={listPropsData} />
      </div>
    </div>
  );
} 
