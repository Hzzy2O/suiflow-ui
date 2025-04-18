'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { NFTCard } from '.';
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

export default function NFTCardPage() {
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

  // Source code
  const sourceCode = `
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { useSuiClientQuery } from '@mysten/dapp-kit';

// IPFS gateway list
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/',
];

// Sui Icon component
const SuiIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="currentColor"
      d="M16.129 10.508a5.44 5.44 0 0 1 1.148 3.356a5.47 5.47 0 0 1-1.18 3.399l-.064.079l-.015-.106a5 5 0 0 0-.053-.26c-.37-1.656-1.567-3.08-3.547-4.234c-1.334-.773-2.102-1.705-2.303-2.763a4.1 4.1 0 0 1 .159-1.97c.15-.494.385-.96.694-1.376l.773-.963a.333.333 0 0 1 .518 0zm1.217-.963L12.19 3.092a.243.243 0 0 0-.38 0L6.652 9.55l-.016.016a7.1 7.1 0 0 0-1.519 4.404C5.118 17.85 8.2 21 12 21s6.881-3.15 6.881-7.03a7.1 7.1 0 0 0-1.519-4.404zm-9.46.942l.461-.577l.016.106l.037.254c.302 1.604 1.366 2.938 3.15 3.97c1.55.905 2.45 1.943 2.71 3.081c.106.476.127.942.08 1.35v.026l-.022.01c-.72.36-1.513.547-2.318.546c-2.912 0-5.278-2.414-5.278-5.389c0-1.275.434-2.45 1.165-3.377"
    />
  </svg>
);

// Convert IPFS URL to HTTP URL
const convertIpfsUrl = (url: string): string => {
  if (!url || url.startsWith('http')) return url;
  
  if (url.startsWith('ipfs://')) {
    const gateway = IPFS_GATEWAYS[0]; // Use the first gateway
    return url.replace('ipfs://', gateway);
  }
  
  return url;
};

// Helper to get rarity badge color based on rarity value
const getRarityBadgeStyles = (rarity: string | number): string => {
  const rarityStr = typeof rarity === 'number' ? rarity.toString() : rarity?.toLowerCase();
  
  // Define style mapping
  const rarityStyles = {
    mythic: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white border border-white/30 shadow-[0_0_15px_rgba(236,72,153,0.5)]',
    legendary: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white border border-amber-300/30 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    epic: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border border-purple-300/30 shadow-[0_0_8px_rgba(147,51,234,0.5)]',
    rare: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border border-blue-300/30 shadow-[0_0_6px_rgba(37,99,235,0.5)]',
    uncommon: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border border-green-300/30',
    common: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white/90 border border-gray-400/20',
    unique: 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 text-white border border-rose-300/30 shadow-[0_0_10px_rgba(244,63,94,0.5)]',
  };
  
  // Default gradient
  const defaultStyle = 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
  
  // Find matching rarity style
  for (const [key, style] of Object.entries(rarityStyles)) {
    if (rarityStr?.includes(key)) {
      return style;
    }
  }
  
  return defaultStyle;
};

export interface NFTCardProps {
  // Basic properties
  name?: string;
  imageUrl?: string;
  price?: string;
  priceIcon?: string;
  collectionName?: string;
  attributes?: { key: string; value: string }[];
  
  // Add tags property
  tags?: string[];
  
  // Rarity property
  rarity?: string | number;
  
  // Sui NFT support properties
  objectId?: string;
  
  // State and error handling
  loadingPlaceholder?: React.ReactNode;
  errorPlaceholder?: React.ReactNode;
  
  // Interaction properties
  onClick?: () => void;
  className?: string;
  buttonText?: string;
  buttonAction?: () => void;
  
  // Style properties
  size?: 'sm' | 'md' | 'lg';
}

type NFTData = {
  name: string;
  imageUrl: string;
  collectionName?: string;
  attributes?: { key: string; value: string }[];
  tags?: string[];
  rarity?: string | number;
};

// AttributesPopup component
const AttributesPopup = ({
  attributes,
  onClose,
}: {
  attributes: { key: string; value: string }[];
  onClose: (e: React.MouseEvent) => void;
}) => (
  <div
    className="absolute inset-0 p-4 flex flex-col z-20 transition-all duration-300 bg-white dark:bg-gray-800"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-bold text-gray-800 dark:text-white">Traits</h3>
      <button
        onClick={onClose}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div className="grid grid-cols-2 gap-2 overflow-y-auto content-start pr-1">
      {attributes.map((attr, idx) => (
        <div
          key={idx}
          className="rounded px-2 py-1.5 bg-gray-100 dark:bg-gray-700"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {attr.key}
          </p>
          <p className="text-xs font-medium truncate text-gray-800 dark:text-white">
            {attr.value}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const NFTCard = ({
  // Basic properties
  name,
  imageUrl,
  price,
  priceIcon,
  collectionName,
  attributes,

  // Add tags property
  tags,

  // Rarity property
  rarity,

  // Sui NFT support properties
  objectId,

  // State and error handling
  loadingPlaceholder,
  errorPlaceholder,

  // Interaction properties
  onClick,
  className,
  buttonText = 'Buy Now',
  buttonAction,

  // Style properties
  size = 'md',
}: NFTCardProps) => {
  // State management
  const [showAttributes, setShowAttributes] = useState(false);

  // Map sizes to specific dimensions
  const sizeClasses = {
    sm: 'w-48 h-auto',
    md: 'w-64 h-auto',
    lg: 'w-80 h-auto',
  };

  // Toggle attributes visibility
  const toggleAttributes = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowAttributes(!showAttributes);
  };

  // Use the useSuiClientQuery hook to fetch NFT data
  const {
    data: objectData,
    isLoading,
    error: queryError,
  } = useSuiClientQuery(
    'getObject',
    {
      id: objectId || '',
      options: {
        showContent: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!objectId, // Only run the query if objectId exists
    }
  );

  // Extract NFT data from the query result
  const nftData: NFTData | null = React.useMemo(() => {
    if (!objectData || !objectData.data) return null;

    try {
      // Get display data (for standard fields)
      const display = objectData.data?.display?.data;
      if (!display) return null;

      // Get content data (for structured fields like attributes)
      const contentFields =
        objectData.data?.content?.dataType === 'moveObject'
          ? objectData.data.content.fields
          : null;

      // Extract standard NFT metadata from display
      const nftName = display.name || 'Unnamed NFT';
      const rawImageUrl = display.image_url || '';
      const nftImageUrl = convertIpfsUrl(rawImageUrl); // Convert IPFS URL
      const nftCollectionName = display.collection_name || collectionName;

      // Extract rarity from display data
      const nftRarity = display.rarity;

      // Extract attributes primarily from structured content
      let nftAttributes: { key: string; value: string }[] = [];

      // Try getting attributes from structured content
      if (contentFields && typeof contentFields === 'object' && 'attributes' in contentFields) {
        const attributesField = contentFields.attributes as any;
        const mapField = attributesField?.fields?.map || attributesField?.map || attributesField?.fields;
        const structuredAttributesContents = mapField?.fields?.contents || mapField?.contents;
        
        if (structuredAttributesContents && Array.isArray(structuredAttributesContents)) {
          nftAttributes = structuredAttributesContents
            .filter(item => {
              const key = item?.fields?.key || item?.key;
              const value = item?.fields?.value || item?.value;
              return key !== undefined && value !== undefined;
            })
            .map(item => ({
              key: String(item?.fields?.key || item?.key),
              value: String(item?.fields?.value || item?.value)
            }));
        }
      }

      // Extract tags directly from display.tags
      let nftTags: string[] = [];
      if (display.tags && typeof display.tags === 'string') {
        try {
          // Try parsing as JSON first (for ["tag1", "tag2"] format)
          const parsedTags = JSON.parse(display.tags);
          if (Array.isArray(parsedTags)) {
            nftTags = parsedTags.map(String);
          } else {
            // If JSON parsing results in non-array, treat as comma-separated
            nftTags = display.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter(Boolean);
          }
          // Remove duplicates
          nftTags = Array.from(new Set(nftTags));
        } catch (e) {
          // If JSON parsing fails, try splitting by comma
          nftTags = display.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter(Boolean);
        }
      }

      return {
        name: nftName,
        imageUrl: nftImageUrl,
        collectionName: nftCollectionName,
        tags: nftTags.length > 0 ? nftTags : undefined,
        attributes: nftAttributes.length > 0 ? nftAttributes : undefined,
        rarity: nftRarity || undefined,
      };
    } catch (err) {
      return null;
    }
  }, [objectData, collectionName]);

  // Loading state
  if (isLoading) {
    if (loadingPlaceholder) {
      return <>{loadingPlaceholder}</>;
    }

    return (
      <div
        className={cn(
          'rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg animate-pulse',
          sizeClasses[size]
        )}
      >
        <div className="aspect-square flex items-center justify-center">
          <span className="text-gray-400">Loading NFT...</span>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (queryError || (objectId && !nftData)) {
    const errorMessage = queryError
      ? (queryError as Error).message
      : 'NFT data not available';

    if (errorPlaceholder) {
      return <>{errorPlaceholder}</>;
    }

    return (
      <div
        className={cn(
          'rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg',
          sizeClasses[size]
        )}
      >
        <div className="aspect-square flex flex-col items-center justify-center p-4 text-center">
          <span className="text-red-500 mb-2">Error loading NFT</span>
          <span className="text-gray-500 text-sm">{errorMessage}</span>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        </div>
      </div>
    );
  }

  // Determine final display data
  const displayName = objectId ? nftData?.name : name;
  const displayImageUrl = objectId ? nftData?.imageUrl : imageUrl;
  const displayCollectionName = objectId ? nftData?.collectionName : collectionName;
  const displayAttributes = objectId ? nftData?.attributes : attributes;
  const displayTags = tags || (objectId ? nftData?.tags : []) || [];
  const displayRarity = rarity || (objectId ? nftData?.rarity : undefined);
  
  const hasAttributes = displayAttributes && displayAttributes.length > 0;
  const hasTags = displayTags.length > 0;
  const hasRarity = !!displayRarity;

  // Check required fields
  if (!displayName || !displayImageUrl) {
    return (
      <div
        className={cn(
          'rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg',
          sizeClasses[size]
        )}
      >
        <div className="aspect-square flex flex-col items-center justify-center p-4 text-center">
          <span className="text-red-500 mb-2">Missing data</span>
          <span className="text-gray-500 text-sm">
            NFT name or image URL is missing
          </span>
        </div>
        <div className="p-3 bg-white dark:bg-gray-800">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Unified layout for all cards
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] select-none relative',
        sizeClasses[size],
        'bg-white dark:bg-gray-800 shadow-lg',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={displayImageUrl}
            alt={displayName}
            className="object-cover"
            width={500}
            height={500}
            unoptimized={displayImageUrl?.startsWith(
              'https://images.placeholders.dev'
            )}
            onError={(e) => {
              // Show placeholder when image fails to load
              const target = e.target as HTMLImageElement;
              target.src =
                'https://via.placeholder.com/500x500?text=Image+Not+Found';
              target.onerror = null; // Prevent error loop
            }}
          />
        </div>

        {/* Collection name badge */}
        {displayCollectionName && (
          <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
            <span className="text-xs text-white font-medium">
              {displayCollectionName}
            </span>
          </div>
        )}

        {/* Rarity badge - positioned top right */}
        {hasRarity && (
          <div className="absolute top-2 right-2">
            <span
              className={\`inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm \${getRarityBadgeStyles(
                displayRarity
              )}\`}
            >
              {typeof displayRarity === 'string'
                ? displayRarity.toUpperCase()
                : displayRarity}
            </span>
          </div>
        )}

        {/* Tags section - positioned over image */}
        {hasTags && (
          <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] overflow-x-auto scrollbar-hide">
            <div className="flex flex-nowrap gap-1.5">
              {displayTags.map((tag: string, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white flex-shrink-0"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card info section */}
      <div className="p-3 bg-white dark:bg-gray-800">
        {/* Name section */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold truncate w-full text-gray-800 dark:text-white">
            <label title={displayName}>{displayName}</label>
          </h3>
          {hasAttributes && (
            <button
              onClick={toggleAttributes}
              className="transition-colors text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
              aria-label="View traits"
            >
              <Sparkles size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {price && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                Price:
              </span>
              <span className="font-bold text-gray-800 dark:text-white mr-1">
                {price}
              </span>
              {priceIcon ? (
                <span className="mr-1">{priceIcon}</span>
              ) : (
                <SuiIcon className="mr-1 text-sui-blue" />
              )}
            </div>
          )}

          {buttonAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                buttonAction();
              }}
              className="px-3 py-1 text-white rounded-md text-sm font-medium transition-colors bg-sui-blue hover:bg-sui-blue-dark"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>

      {/* Attributes popup */}
      {hasAttributes && showAttributes && (
        <AttributesPopup 
          attributes={displayAttributes} 
          onClose={toggleAttributes} 
        />
      )}
    </div>
  );
};

export default NFTCard;
  `;

  // Example usage code
  const example = [
    {
      title: 'Example.tsx',
      code: `import { NFTCard } from "@/components/nftcard";
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
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example 1: Basic NFT Card */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic NFT Card</h3>
            <NFTCard 
              imageUrl="/image/nft-samurai.png" 
              name="Cyber Samurai"
              collectionName="The Ronin"
              rarity="rare"
              price="0.85"
              buttonText="View Details"
              buttonAction={() => alert('View Details clicked')}
              tags={["Samurai", "Cyber", "Gaming"]}
              attributes={[
                { key: "Background", value: "Blue" },
                { key: "Weapon", value: "Katana" },
                { key: "Class", value: "Warrior" }
              ]}
            />
          </div>
          
          {/* Example 2: On-chain NFT */}
          <div>
            <h3 className="text-lg font-semibold mb-3">On-chain NFT</h3>
            <NFTCard
              objectId="0xf82df943375cb58d4098b2e1b52a16851ece818ab4b048f7a73423efb5fe9b35"
              price="2"
              rarity="MYTHIC"
              buttonText="Buy Now"
              buttonAction={() => alert('Buy Now clicked')}
            />
          </div>
          
          {/* Example 3: Unique Rarity */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Unique Rarity</h3>
            <NFTCard
              objectId="0x8f802a6f6fb8b02aa053e08563b0725675c6979135b7615ad5e5d57e7d16b13e"
              rarity="unique"
              price="2"
              buttonText="Buy Now"
              buttonAction={() => alert('Buy Now clicked')}
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
    // Basic NFT information properties
    {
      name: 'name',
      type: 'string',
      description: 'Name of the NFT (optional when using objectId)',
    },
    {
      name: 'imageUrl',
      type: 'string',
      description:
        'URL of the NFT image (optional when using objectId)',
    },
    {
      name: 'price',
      type: 'string',
      description: 'Price of the NFT (optional)',
    },
    {
      name: 'priceIcon',
      type: 'string',
      description: 'Icon displayed next to the price (default: ⬡)',
    },
    {
      name: 'collectionName',
      type: 'string',
      description: 'Collection name (optional)',
    },
    {
      name: 'attributes',
      type: 'array',
      description: 'Array of key and value key-value pairs (optional)',
    },
    {
      name: 'rarity',
      type: 'string | number',
      description: 'Rarity level of the NFT (e.g., "COMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC")',
    },
    // Sui blockchain data properties
    {
      name: 'objectId',
      type: 'string',
      description:
        'NFT object ID on the Sui blockchain, providing this will automatically fetch NFT data from the chain',
    },
    // State and error handling
    {
      name: 'loadingPlaceholder',
      type: 'React.ReactNode',
      description: 'Custom component for loading state (optional)',
    },
    {
      name: 'errorPlaceholder',
      type: 'React.ReactNode',
      description: 'Custom component for error state (optional)',
    },
    // Interaction properties
    {
      name: 'onClick',
      type: 'function',
      description: 'Function called when the card is clicked',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS class for the card',
    },
    {
      name: 'buttonText',
      type: 'string',
      description: 'Text for the action button (default: "Buy Now")',
    },
    {
      name: 'buttonAction',
      type: 'function',
      description: 'Function called when the button is clicked',
    },
    // Style properties
    {
      name: 'size',
      type: 'string',
      description: 'Card size: "sm", "md" (default), "lg"',
    },
    {
      name: 'tags',
      type: 'array',
      description: 'Array of tags associated with the NFT',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">NFT Card Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          A standardized card for displaying NFTs with support for images,
          videos, collection info, and key attributes. Designed to match the Sui
          design language.
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Example 1: Basic NFT Card */}
                        <div>
                          <h3 className="text-sm font-medium mb-4 text-white">Basic NFT Card</h3>
                          <NFTCard 
                            imageUrl="/image/nft-samurai.png" 
                            name="Cyber Samurai"
                            collectionName="The Ronin"
                            rarity="rare"
                            price="0.85"
                            buttonText="View Details"
                            buttonAction={() => alert('View Details clicked')}
                            tags={["Samurai", "Cyber", "Gaming"]}
                            attributes={[
                              { key: "Background", value: "Blue" },
                              { key: "Weapon", value: "Katana" },
                              { key: "Class", value: "Warrior" }
                            ]}
                          />
                        </div>
                        
                        {/* Example 2: On-chain NFT */}
                        <div>
                          <h3 className="text-sm font-medium mb-4 text-white">On-chain NFT</h3>
                          <NFTCard
                            objectId="0xf82df943375cb58d4098b2e1b52a16851ece818ab4b048f7a73423efb5fe9b35"
                            price="2"
                            rarity="MYTHIC"
                            buttonText="Buy Now"
                            buttonAction={() => alert('Buy Now clicked')}
                          />
                        </div>
                        
                        {/* Example 3: Unique Rarity */}
                        <div>
                          <h3 className="text-sm font-medium mb-4 text-white">Unique Rarity</h3>
                          <NFTCard
                            objectId="0x8f802a6f6fb8b02aa053e08563b0725675c6979135b7615ad5e5d57e7d16b13e"
                            rarity="unique"
                            price="2"
                            buttonText="Buy Now"
                            buttonAction={() => alert('Buy Now clicked')}
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
                npx @suiflow-ui@latest add nftcard
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow-ui@latest add nftcard', 1)
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
