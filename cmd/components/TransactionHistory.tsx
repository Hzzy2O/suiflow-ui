import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Filter, X, Copy, ExternalLink, Clock, CheckCircle, XCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface TransactionHistoryItemProps {
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

export interface TransactionHistoryListProps {
  // Transaction data
  transactions: Omit<TransactionHistoryItemProps, "onClick">[];
  
  // Pagination
  page?: number;
  pageSize?: number;
  totalPages?: number;
  
  // Loading state
  isLoading?: boolean;
  
  // Filter options
  filterOptions?: {
    types?: string[];
    status?: ("success" | "failed" | "pending")[];
  };
  
  // Style properties
  className?: string;
  
  // Callbacks
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: { type?: string; status?: string }) => void;
  onTransactionClick?: (txHash: string) => void;
  onLoadMore?: () => void;
  explorerUrl?: string;
}

export const TransactionHistoryList: React.FC<TransactionHistoryListProps> = ({
  // Transaction data
  transactions,
  
  // Pagination
  page = 1,
  pageSize = 10,
  totalPages = 1,
  
  // Loading state
  isLoading = false,
  
  // Filter options
  filterOptions,
  
  // Style properties
  className,
  
  // Callbacks
  onPageChange,
  onFilterChange,
  onTransactionClick,
  onLoadMore,
  explorerUrl = 'https://suiexplorer.com/txblock/'
}) => {
  const [activeFilters, setActiveFilters] = useState<{
    type?: string;
    status?: string;
  }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [copiedTxHash, setCopiedTxHash] = useState<string | null>(null);
  
  // Apply filters to transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilters.type && tx.type !== activeFilters.type) {
      return false;
    }
    if (activeFilters.status && tx.status !== activeFilters.status) {
      return false;
    }
    return true;
  });
  
  // Handle filter selection
  const handleFilterSelect = (filterType: 'type' | 'status', value: string) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: activeFilters[filterType] === value ? undefined : value,
    };
    
    setActiveFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Handle filter clear
  const clearFilters = () => {
    setActiveFilters({});
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };
  
  // Handle transaction click
  const handleTransactionClick = (txHash: string) => {
    if (onTransactionClick) {
      onTransactionClick(txHash);
    }
  };

  // Format transaction hash
  const formatTxHash = (hash: string) => {
    if (!hash) return '';
    const normalizedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
    return `${normalizedHash.slice(0, 6)}...${normalizedHash.slice(-4)}`;
  };

  // Format address - 修改为显示前四位和后四位
  const formatAddress = (address: string) => {
    if (!address) return '';
    const normalizedAddress = address.startsWith('0x') ? address : `0x${address}`;
    return `${normalizedAddress.slice(0, 6)}...${normalizedAddress.slice(-4)}`;
  };

  // Copy to clipboard
  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedTxHash(text);
    setTimeout(() => setCopiedTxHash(null), 2000);
  };

  // Open explorer
  const handleExplorerClick = (txHash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`${explorerUrl}${txHash}`, '_blank');
  };
  
  // Status icons
  const statusIcons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
    pending: <Clock className="w-4 h-4 text-yellow-500" />
  };

  // 自定义滚动条样式
  const scrollableStyle = "overflow-x-auto whitespace-nowrap custom-scrollbar";

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* 自定义滚动条样式 */}
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

      {/* Filter UI */}
      {filterOptions && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm border
                bg-white text-gray-700 hover:bg-gray-50
                dark:border-[#2A3746] dark:bg-[#0A1428]/80 dark:hover:bg-[#0A1428] dark:text-white"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            {Object.entries(activeFilters).filter(([_, value]) => value).length > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm border
                  bg-white text-gray-700 hover:bg-gray-50
                  dark:border-[#2A3746] dark:bg-[#0A1428]/80 dark:hover:bg-[#0A1428] dark:text-white"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Filter dropdown */}
      {isFilterOpen && filterOptions && (
        <div className="rounded-lg p-4 mb-4
          border bg-white
          dark:border-[#2A3746] dark:bg-[#0A1428]/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type filters */}
            {filterOptions.types && filterOptions.types.length > 0 && (
              <div>
                <h3 className="text-gray-800 dark:text-white text-sm font-medium mb-2">Transaction Type</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.types.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterSelect('type', type)}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium",
                        activeFilters.type === type
                          ? "bg-blue-500 dark:bg-[#6FBCF0] text-white dark:text-[#0A1428]"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#2A3746]/50 dark:text-white dark:hover:bg-[#2A3746]"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Status filters */}
            {filterOptions.status && filterOptions.status.length > 0 && (
              <div>
                <h3 className="text-gray-800 dark:text-white text-sm font-medium mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.status.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleFilterSelect('status', status)}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium",
                        activeFilters.status === status
                          ? "bg-blue-500 dark:bg-[#6FBCF0] text-white dark:text-[#0A1428]"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#2A3746]/50 dark:text-white dark:hover:bg-[#2A3746]"
                      )}
                    >
                      {status === 'success' ? 'Success' : status === 'pending' ? 'Pending' : 'Failed'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Transactions table */}
      <div className="overflow-x-auto rounded-lg
        border bg-white
        dark:border-[#2A3746] dark:bg-[#0A1428]/80">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-[#2A3746] table-fixed">
          <thead>
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 font-medium w-[150px]">Transaction Hash</th>
              <th className="px-4 py-3 font-medium w-[100px]">Method</th>
              <th className="px-4 py-3 font-medium w-[80px]">Status</th>
              <th className="px-4 py-3 font-medium w-[120px]">Date Time</th>
              <th className="px-4 py-3 font-medium w-[150px]">Sender</th>
              <th className="px-4 py-3 font-medium w-[150px]">Recipient</th>
              <th className="px-4 py-3 font-medium text-right w-[100px]">Amount</th>
              <th className="px-4 py-3 font-medium text-right w-[100px]">Gas Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#2A3746]">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4 mx-auto"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-auto"></div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              // Transaction rows
              filteredTransactions.map((tx) => (
                <tr 
                  key={tx.txHash} 
                  className="hover:bg-gray-50 dark:hover:bg-[#2A3746]/30 cursor-pointer"
                  onClick={() => handleTransactionClick(tx.txHash)}
                >
                  <td className="px-4 py-3 w-[150px] relative">
                    <div className={cn("flex items-center space-x-1", scrollableStyle)}>
                      <span className="font-mono text-gray-800 dark:text-gray-200">{formatTxHash(tx.txHash)}</span>
                      <button 
                        onClick={(e) => handleCopy(tx.txHash, e)} 
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2A3746] transition-colors flex-shrink-0"
                      >
                        {copiedTxHash === tx.txHash ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                      <button 
                        onClick={(e) => handleExplorerClick(tx.txHash, e)} 
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2A3746] transition-colors flex-shrink-0"
                      >
                        <ExternalLink className="w-3 h-3 text-blue-500 dark:text-[#6FBCF0]" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-800 dark:text-white">{tx.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {statusIcons[tx.status]}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatDistance(new Date(tx.timestamp), new Date(), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-[150px] relative">
                    <div className={cn("flex items-center space-x-1", scrollableStyle)}>
                      <span className="font-mono text-gray-600 dark:text-gray-300">{formatAddress(tx.sender)}</span>
                      <button 
                        onClick={(e) => handleCopy(tx.sender, e)} 
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2A3746] transition-colors flex-shrink-0"
                      >
                        {copiedTxHash === tx.sender ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 w-[150px] relative">
                    {tx.recipient && (
                      <div className={cn("flex items-center space-x-1", scrollableStyle)}>
                        <span className="font-mono text-gray-600 dark:text-gray-300">{formatAddress(tx.recipient)}</span>
                        <button 
                          onClick={(e) => handleCopy(tx.recipient || '', e)} 
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2A3746] transition-colors flex-shrink-0"
                        >
                          {copiedTxHash === tx.recipient ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {tx.amount && (
                      <span className="text-gray-800 dark:text-white block">{tx.amount}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-600 dark:text-gray-300 block">0.00001 SUI</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!onLoadMore && filteredTransactions.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={cn(
                "p-1.5 rounded-md",
                page === 1 
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A3746]"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={cn(
                "p-1.5 rounded-md",
                page === totalPages 
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A3746]"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Load More Button */}
      {onLoadMore && filteredTransactions.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={onLoadMore}
            className="px-4 py-2 rounded-md text-sm font-medium border
              bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100
              dark:border-[#2A3746] dark:bg-[#2A3746] dark:text-[#6FBCF0] dark:hover:bg-[#2A3746]/80"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryList; 
