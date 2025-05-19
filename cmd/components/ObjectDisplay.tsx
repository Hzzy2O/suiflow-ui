import React, { useState } from 'react';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ExternalLink, Copy } from 'lucide-react';

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

export interface ObjectDisplayProps {
  // Sui object properties
  objectId: string;
  
  // Display options
  variant?: 'default' | 'compact' | 'detailed';
  showExplorerLink?: boolean;
  showCopyButton?: boolean;
  showObjectType?: boolean;
  showPackage?: boolean;
  showModuleName?: boolean;
  showProperties?: boolean;
  maxProperties?: number;
  explorerUrl?: string;
  network?: 'mainnet' | 'testnet' | 'devnet';
  
  // State and error handling
  loadingPlaceholder?: React.ReactNode;
  errorPlaceholder?: React.ReactNode;
  
  // Interaction properties
  onClick?: () => void;
  className?: string;
  
  // Style properties
  size?: 'sm' | 'md' | 'lg';
}

// Helper to format address
const formatAddress = (address: string, length: number = 6): string => {
  if (!address) return '';
  const prefix = address.startsWith('0x') ? '0x' : '';
  address = address.startsWith('0x') ? address.slice(2) : address;
  const start = address.slice(0, length);
  const end = address.slice(-length);
  return `${prefix}${start}...${end}`;
};

// Helper to format object property values
const formatPropertyValue = (value: any): string => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[Array: ${value.length} items]`;
  if (typeof value === 'object') return '{Object}';
  return String(value);
};

// Helper to get network-specific explorer URL
const getExplorerUrl = (network: string, objectId: string): string => {
  const addressWithoutPrefix = objectId.toString().replace(/^0x/, '');
  const networkType = network === 'mainnet' ? 'mainnet' : 'testnet';
  return `https://suiscan.xyz/${networkType}/object/${addressWithoutPrefix}`;
};

const ObjectDisplay: React.FC<ObjectDisplayProps> = ({
  // Sui object properties
  objectId,
  
  // Display options
  variant = 'default',
  showExplorerLink = true,
  showCopyButton = true,
  showObjectType = true,
  showPackage = variant === 'detailed',
  showModuleName = variant === 'detailed',
  showProperties = variant === 'detailed',
  maxProperties = 5,
  explorerUrl,
  network = 'mainnet',
  
  // State and error handling
  loadingPlaceholder,
  errorPlaceholder,
  
  // Interaction properties
  onClick,
  className,
  
  // Style properties
  size = 'md',
}) => {
  const [expandedProperties, setExpandedProperties] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Size classes mapping
  const sizeClasses = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
    lg: 'text-base p-4',
  };
  
  // Variant classes mapping
  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm',
    compact: 'border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded',
    detailed: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-md',
  };
  
  // Use the useSuiClientQuery hook to fetch object data
  const {
    data: objectData,
    isLoading,
    error: queryError,
    refetch,
  } = useSuiClientQuery(
    'getObject',
    {
      id: objectId,
      options: {
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showType: true,
        showPreviousTransaction: true,
      },
    },
    {
      enabled: !!objectId,
    }
  );
  
  // Copy to clipboard handler
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(objectId).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => console.error('Failed to copy object ID')
    );
  };
  
  // Explorer link handler
  const handleExplorerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = explorerUrl || getExplorerUrl(network, objectId);
    window.open(url, '_blank');
  };
  
  // Toggle expanded properties
  const toggleExpandProperties = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedProperties(!expandedProperties);
  };
  
  // Loading state
  if (isLoading) {
    if (loadingPlaceholder) {
      return <>{loadingPlaceholder}</>;
    }
    
    return (
      <div
        className={cn(
          'animate-pulse',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }
  
  // Error state
  if (queryError || !objectData) {
    const errorMessage = queryError
      ? (queryError as Error).message
      : 'Object data not available';
      
    if (errorPlaceholder) {
      return <>{errorPlaceholder}</>;
    }
    
    return (
      <div
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          'text-red-500',
          className
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Error loading object</span>
          <button 
            onClick={(e) => { e.stopPropagation(); refetch(); }} 
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Retry
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{errorMessage}</p>
      </div>
    );
  }
  
  // Extract data from response
  const objectType = objectData.data?.type || 'Unknown Type';
  const version = objectData.data?.version;
  const digest = objectData.data?.digest;
  const owner = objectData.data?.owner;
  const previousTx = objectData.data?.previousTransaction;
  
  // Extract display data
  const displayData = objectData.data?.display?.data || {};
  const displayName = displayData.name || formatAddress(objectId);
  
  // Extract content
  const content = objectData.data?.content;
  
  // Determine if it's a Move object
  const isMoveObject = content?.dataType === 'moveObject';
  
  // Extract properties from content
  let properties: Record<string, any> = {};
  if (isMoveObject && content?.fields) {
    properties = content.fields;
  }
  
  // Extract package, module, and struct
  let packageId = '';
  let moduleName = '';
  let structName = '';
  
  if (objectType && typeof objectType === 'string') {
    const parts = objectType.split('::');
    if (parts.length >= 3) {
      packageId = parts[0];
      moduleName = parts[1];
      structName = parts[2];
    }
  }
  
  // Process properties for display
  const propertyEntries = Object.entries(properties);
  const visibleProperties = expandedProperties 
    ? propertyEntries 
    : propertyEntries.slice(0, maxProperties);
  
  // Type formatting for display
  const typeFormatted = () => {
    if (!showObjectType) return null;
    
    if (variant === 'compact') {
      return structName;
    }
    
    return showModuleName ? `${moduleName}::${structName}` : structName;
  };
  
  return (
    <div
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      {/* Header with name and actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-gray-800 dark:text-white truncate mr-2">
          {displayName}
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded"
              title="Copy object ID"
            >
              <Copy size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
              {copied && (
                <span className="absolute bg-black text-white text-xs px-2 py-1 rounded -mt-8 -ml-6">
                  Copied!
                </span>
              )}
            </button>
          )}
          {showExplorerLink && (
            <button
              onClick={handleExplorerClick}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded"
              title="View in explorer"
            >
              <ExternalLink size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
            </button>
          )}
        </div>
      </div>
      
      {/* Object ID */}
      <div className="flex items-center mb-2 text-gray-500 dark:text-gray-400 break-all">
        <SuiIcon className="mr-1 inline-block" />
        <span>{formatAddress(objectId, size === 'sm' ? 4 : size === 'lg' ? 8 : 6)}</span>
      </div>
      
      {/* Type info */}
      {showObjectType && typeFormatted() && (
        <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Type:</span>
          <span className="font-medium">{typeFormatted()}</span>
        </div>
      )}
      
      {/* Package info */}
      {showPackage && packageId && (
        <div className="mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Package:</span>
          <span className="font-mono text-xs text-gray-600 dark:text-gray-300 break-all">
            {formatAddress(packageId, 10)}
          </span>
        </div>
      )}
      
      {/* Version */}
      {variant === 'detailed' && version !== undefined && (
        <div className="mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Version:</span>{' '}
          <span className="text-gray-600 dark:text-gray-300">{version}</span>
        </div>
      )}
      
      {/* Owner */}
      {variant === 'detailed' && owner && (
        <div className="mb-2 break-all">
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Owner:</span>
          <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
            {typeof owner === 'object' && 'AddressOwner' in owner && formatAddress(owner.AddressOwner as string, 10)}
            {typeof owner === 'object' && 'ObjectOwner' in owner && formatAddress(owner.ObjectOwner as string, 10)}
            {typeof owner === 'object' && 'Shared' in owner && 'Shared'}
            {typeof owner === 'object' && 'Immutable' in owner && 'Immutable'}
          </span>
        </div>
      )}
      
      {/* Properties */}
      {showProperties && propertyEntries.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Properties</span>
            {propertyEntries.length > maxProperties && (
              <button
                onClick={toggleExpandProperties}
                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
              >
                {expandedProperties ? (
                  <>
                    <ChevronUp size={14} className="mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1" />
                    Show all ({propertyEntries.length})
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
            {visibleProperties.map(([key, value]) => (
              <div key={key} className="rounded px-2 py-1.5 bg-gray-50 dark:bg-gray-700/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">{key}</p>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 break-all">
                  {formatPropertyValue(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectDisplay; 
