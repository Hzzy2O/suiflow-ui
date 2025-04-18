import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, ArrowUpRight, Copy, ExternalLink } from 'lucide-react';
import { formatDistance } from 'date-fns';

export interface TransactionHistoryItemProps {
  // Transaction identifiers
  txHash: string;
  
  // Transaction metadata
  type: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date | number;
  
  // Transaction details
  sender: string;
  recipient?: string;
  amount?: string;
  objectId?: string;
  
  // Display options
  showExplorerLink?: boolean;
  showCopyButton?: boolean;
  explorerUrl?: string;
  
  // Style properties
  className?: string;
  
  // Interaction properties
  onClick?: () => void;
}

export const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
  // Transaction identifiers
  txHash,
  
  // Transaction metadata
  type,
  status,
  timestamp,
  
  // Transaction details
  sender,
  recipient,
  amount,
  objectId,
  
  // Display options
  showExplorerLink = true,
  showCopyButton = true,
  explorerUrl = 'https://suiexplorer.com/txblock/',
  
  // Style properties
  className,
  
  // Interaction properties
  onClick,
}) => {
  const [copied, setCopied] = React.useState(false);
  
  const statusIcons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />
  };
  
  const formatTxHash = (hash: string) => {
    if (!hash) return '';
    const normalizedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
    return `${normalizedHash.slice(0, 6)}...${normalizedHash.slice(-4)}`;
  };
  
  const formatAddress = (address: string) => {
    if (!address) return '';
    const normalizedAddress = address.startsWith('0x') ? address : `0x${address}`;
    return `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`;
  };
  
  const formattedTime = timestamp instanceof Date || typeof timestamp === 'number' 
    ? formatDistance(new Date(timestamp), new Date(), { addSuffix: true })
    : 'Unknown';
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleExplorerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`${explorerUrl}${txHash}`, '_blank');
  };
  
  const scrollableStyle = "overflow-x-auto whitespace-nowrap custom-scrollbar";
  
  return (
    <div 
      className={cn(
        // 基本样式
        "flex items-center justify-between p-3 rounded-lg transition-colors border",
        // 深色模式样式
        "dark:border-[#2A3746] dark:bg-[#0A1428]/80 dark:hover:bg-[#0A1428]",
        // 浅色模式样式
        "border-gray-200 bg-white hover:bg-gray-50",
        // 通用状态
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
          -webkit-overflow-scrolling: touch;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(42, 55, 70, 0.7);
        }
      `}</style>
      
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="flex-shrink-0">
          {statusIcons[status]}
        </div>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center">
            <span className="font-medium text-sm text-gray-800 dark:text-white">{type}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{formattedTime}</span>
          </div>
          
          <div className={cn("flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400", scrollableStyle)}>
            <span className="font-mono">{formatTxHash(txHash)}</span>
            
            {showCopyButton && (
              <button 
                onClick={handleCopy}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2A3746]/50 transition-colors flex-shrink-0"
                aria-label="Copy transaction hash"
              >
                {copied ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
            
            {showExplorerLink && (
              <button 
                onClick={handleExplorerClick}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2A3746]/50 transition-colors flex-shrink-0"
                aria-label="View on explorer"
              >
                <ExternalLink className="w-3 h-3 text-blue-500 dark:text-[#6FBCF0]" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end text-right min-w-0 ml-3">
        {amount && (
          <span className="text-sm font-medium text-gray-800 dark:text-white">{amount}</span>
        )}
        {(recipient || objectId) && (
          <div className={scrollableStyle}>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {recipient ? formatAddress(recipient) : 
               objectId ? (objectId.startsWith('0x') ? formatAddress(objectId) : objectId) : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryItem; 
