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
  const [isImageLoading, setIsImageLoading] = useState(true); // State for image loading status

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
        {/* Image container with conditional placeholder styles */}
        <div className={cn(
          "relative w-full h-full",
          isImageLoading && "bg-gray-200 dark:bg-gray-700 animate-pulse" // Placeholder style while loading
        )}>
          <Image
            src={displayImageUrl}
            alt={displayName || 'NFT Image'} // Provide a default alt text
            className={cn(
              "object-cover w-full h-full",
              // Apply transition for smooth fade-in
              "transition-opacity duration-300 ease-in-out",
              isImageLoading ? "opacity-0" : "opacity-100" // Hide image while loading, show when loaded
            )}
            width={500}
            height={500}
            unoptimized={displayImageUrl?.startsWith(
              'https://images.placeholders.dev'
            )}
            onLoad={() => setIsImageLoading(false)} // Set loading state to false when image loads
            onError={(e) => {
              setIsImageLoading(false); // Also stop loading state on error
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
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${getRarityBadgeStyles(
                displayRarity
              )}`}
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
