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
  const usageExample = `
import { NFTGallery } from '@/components/nftgallery';

export default function MyPage() {
  // Demo wallet address with NFTs
  const walletAddress = "0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e";
  
  const handleNFTSelect = (objectId) => {
    console.log("Selected NFT:", objectId);
    // Do something with the selected NFT
  };

  return (
    <div>
      <h1>My NFT Gallery</h1>
      <NFTGallery 
        walletAddress={walletAddress}
        networkType="mainnet"
        maxDisplay={20}
        size="md"
        onNFTSelect={handleNFTSelect}
      />
    </div>
  );
}
`;

  const propsTableData = [
    {
      name: 'walletAddress',
      type: 'string',
      default: '-',
      required: true,
      description: 'The wallet address to fetch NFTs from',
    },
    {
      name: 'networkType',
      type: "'mainnet' | 'testnet' | 'devnet'",
      default: "'mainnet'",
      required: false,
      description: 'The Sui network to connect to',
    },
    {
      name: 'maxDisplay',
      type: 'number',
      default: '50',
      required: false,
      description: 'Maximum number of NFTs to display',
    },
    {
      name: 'variant',
      type: "'default' | 'glass' | 'bordered'",
      default: "'default'",
      required: false,
      description: 'Visual style variant of the gallery',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      required: false,
      description: 'Size of the NFT cards',
    },
    {
      name: 'onNFTSelect',
      type: '(objectId: string) => void',
      default: '-',
      required: false,
      description: 'Callback function when an NFT is selected',
    },
    {
      name: 'emptyStateMessage',
      type: 'string',
      default: "'No NFTs found in this wallet'",
      required: false,
      description: 'Message to display when no NFTs are found',
    },
    {
      name: 'loadingMessage',
      type: 'string',
      default: "'Loading NFTs from wallet...'",
      required: false,
      description: 'Message to display during loading state',
    },
    {
      name: 'customEmptyComponent',
      type: 'React.ReactNode',
      default: '-',
      required: false,
      description: 'Custom component to render when no NFTs are found',
    },
    {
      name: 'customLoadingComponent',
      type: 'React.ReactNode',
      default: '-',
      required: false,
      description: 'Custom component to render during loading state',
    },
    {
      name: 'customErrorComponent',
      type: 'React.ReactNode',
      default: '-',
      required: false,
      description: 'Custom component to render when an error occurs',
    },
  ];

  return (
    <div className={`pt-8 ml-0 md:ml-6 antialiased transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="font-semibold mb-1 text-sm text-blue-600 dark:text-blue-400">组件</div>
      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">NFT Gallery</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
        NFT Gallery 组件用于展示指定钱包地址拥有的 NFT 收藏品，支持不同网络和自定义样式。
      </p>

      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => handleTabChange('Preview')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md 
          ${
            activeTab === 'Preview'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          预览
        </button>
        <button
          onClick={() => handleTabChange('Code')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md
          ${
            activeTab === 'Code'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          代码
        </button>
        <button
          onClick={() => handleTabChange('Props')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md
          ${
            activeTab === 'Props'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          属性
        </button>
        <button
          onClick={() => handleTabChange('Usage')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md
          ${
            activeTab === 'Usage'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          使用方法
        </button>

        <button
          onClick={toggleDarkMode}
          className="ml-auto p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none dark:border dark:border-gray-800 mb-10">
        <AnimatePresence mode="wait">
          {activeTab === 'Preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-5"
            >
              <div className={`${darkMode ? 'dark' : ''} transition-colors duration-300`}>
                <div className="bg-white dark:bg-gray-900 min-h-[300px] rounded-xl">
                  <SuiClientProvider
                    networks={networkConfig}
                    defaultNetwork="mainnet"
                  >
                    <NFTGallery
                      walletAddress={demoWalletAddress}
                      networkType="mainnet"
                      maxDisplay={8}
                      size="md"
                      onNFTSelect={(id) => console.log('Selected NFT:', id)}
                    />
                  </SuiClientProvider>
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="walletInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  测试钱包地址
                </label>
                <div className="flex">
                  <input
                    id="walletInput"
                    type="text"
                    value={demoWalletAddress}
                    onChange={(e) => setDemoWalletAddress(e.target.value)}
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                    placeholder="输入钱包地址查看 NFT..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SuiFlowSourceCodeBlock codeString={sourceCode} language="javascript" />
            </motion.div>
          )}

          {activeTab === 'Props' && (
            <motion.div
              key="props"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-5"
            >
              <PropsTable propsData={propsTableData.map(item => ({
                name: item.name,
                type: item.type,
                description: item.description
              }))} />
            </motion.div>
          )}

          {activeTab === 'Usage' && (
            <motion.div
              key="usage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SuiFlowExampleBlock files={[{ title: 'Example.tsx', code: usageExample }]} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10 mb-20">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">快速指南</h2>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none dark:border dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-8 w-8 rounded-full flex items-center justify-center mr-3">
              <span className="font-medium">1</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">安装依赖</h3>
            
            {copiedStep === 1 && (
              <span className="ml-auto text-sm text-green-600 dark:text-green-400">已复制 ✓</span>
            )}
          </div>
          
          <div className="ml-11">
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
              安装必要的 Sui 依赖
            </p>
            <div 
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 mb-2 cursor-pointer"
              onClick={() => copyToClipboard("npm install @mysten/sui@latest", 1)}
            >
              npm install @mysten/sui@latest
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none dark:border dark:border-gray-800 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-8 w-8 rounded-full flex items-center justify-center mr-3">
              <span className="font-medium">2</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">导入组件</h3>
            
            {copiedStep === 2 && (
              <span className="ml-auto text-sm text-green-600 dark:text-green-400">已复制 ✓</span>
            )}
          </div>
          
          <div className="ml-11">
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
              从组件库中导入 NFTGallery 组件
            </p>
            <div 
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 mb-2 cursor-pointer"
              onClick={() => copyToClipboard("import { NFTGallery } from '@/components/nftgallery';", 2)}
            >
              {'import { NFTGallery } from \'@/components/nftgallery\';'}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none dark:border dark:border-gray-800 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-8 w-8 rounded-full flex items-center justify-center mr-3">
              <span className="font-medium">3</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">使用组件</h3>
            
            {copiedStep === 3 && (
              <span className="ml-auto text-sm text-green-600 dark:text-green-400">已复制 ✓</span>
            )}
          </div>
          
          <div className="ml-11">
            <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
              在你的页面中使用 NFTGallery 组件
            </p>
            <div 
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 cursor-pointer"
              onClick={() => copyToClipboard("<NFTGallery\n  walletAddress=\"0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e\"\n  networkType=\"mainnet\"\n  maxDisplay={20}\n  size=\"md\"\n  onNFTSelect={(id) => console.log('Selected NFT:', id)}\n/>", 3)}
            >
              {'<NFTGallery\n  walletAddress="0x7d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b58e"\n  networkType="mainnet"\n  maxDisplay={20}\n  size="md"\n  onNFTSelect={(id) => console.log(\'Selected NFT:\', id)}\n/>'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
