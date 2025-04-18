import React, { useEffect, useState } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { NFTCard } from '../../nftcard';

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
        // This is a simple filter - you might need to adjust based on your definition of NFT
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
