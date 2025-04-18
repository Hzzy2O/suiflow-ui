import React, { useEffect, useState, useCallback, memo } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { NFTCard } from '../../nftcard';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

// 使用动态导入懒加载NFTCard组件
const LazyNFTCard = dynamic(() => import('../../nftcard/components/NFTCard'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg animate-pulse w-full h-64">
      <div className="aspect-square flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    </div>
  ),
});

// 将卡片组件记忆化，避免不必要的重新渲染
const MemoizedNFTCard = memo(({ 
  objectId, 
  size, 
  buttonText, 
  buttonAction 
}: { 
  objectId: string; 
  size: 'sm' | 'md' | 'lg'; 
  buttonText: string;
  buttonAction?: () => void;
}) => {
  // 使用Intersection Observer实现惰性加载
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px', // 提前200px加载
  });

  return (
    <div ref={ref} className="h-full">
      {inView ? (
        <NFTCard
          objectId={objectId}
          size={size}
          buttonText={buttonText}
          buttonAction={buttonAction}
        />
      ) : (
        <div className="h-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
      )}
    </div>
  );
});

MemoizedNFTCard.displayName = 'MemoizedNFTCard';

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

  // 使用useCallback缓存函数
  const fetchWalletNFTs = useCallback(async () => {
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
  }, [walletAddress, networkType, maxDisplay]);

  // 使用缓存的fetchWalletNFTs函数
  useEffect(() => {
    // Reset state on wallet address or network change
    setNftObjects([]);
    setLoading(true);
    setError(null);
    
    fetchWalletNFTs();
  }, [fetchWalletNFTs]);

  // 缓存卡片点击处理函数
  const handleCardSelect = useCallback((objectId: string) => {
    if (onNFTSelect) {
      onNFTSelect(objectId);
    }
  }, [onNFTSelect]);

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
        <MemoizedNFTCard
          key={objectId}
          objectId={objectId}
          size={size}
          buttonText="View Details"
          buttonAction={onNFTSelect ? () => handleCardSelect(objectId) : undefined}
        />
      ))}
    </div>
  );
};

export default NFTGallery; 
