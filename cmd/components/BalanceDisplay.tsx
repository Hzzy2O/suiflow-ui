import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import { RotateCcw } from 'lucide-react';

export interface BalanceDisplayProps {
  // Basic properties
  balance?: string | number;
  symbol?: string;
  
  // Blockchain properties - if these are provided, balance will be fetched from blockchain
  walletAddress?: string;
  tokenType?: string; // Token type like "0x2::sui::SUI" or custom coin type
  coinDecimals?: number; // Number of decimals for the coin (9 for SUI)
  
  // Display options
  variant?: 'default' | 'compact';
  showSymbol?: boolean;
  showDecimalPlaces?: number;
  icon?: React.ReactNode;
  showIcon?: boolean;
  
  // Style properties
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // Formatting options
  thousandSeparator?: string;
  decimalSeparator?: string;
  
  // Interaction properties
  onClick?: () => void;
  refreshInterval?: number; // Milliseconds for auto-refresh, if 0 or undefined, no auto-refresh
}

// Helper function to format balance
export const formatBalance = (
  balance: string | number,
  options: {
    showDecimalPlaces?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
    coinDecimals?: number;
  } = {}
): string => {
  if (balance === undefined || balance === null) return '0';
  
  // Convert balance to number
  let numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  // Default options
  const {
    showDecimalPlaces = 2,
    thousandSeparator = ',',
    decimalSeparator = '.',
    coinDecimals = 0,
  } = options;
  
  // Handle invalid number
  if (isNaN(numBalance)) return '0';
  
  // If coinDecimals is provided, adjust the balance
  if (coinDecimals > 0) {
    numBalance = numBalance / Math.pow(10, coinDecimals);
  }
  
  // Round to specified decimal places
  const factor = Math.pow(10, showDecimalPlaces);
  const roundedBalance = Math.round(numBalance * factor) / factor;
  
  // Convert to string and split by decimal point
  const [integerPart, decimalPart = ''] = roundedBalance.toString().split('.');
  
  // Format integer part with thousand separators
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  // Format decimal part with specified decimal places
  const formattedDecimalPart = showDecimalPlaces > 0
    ? decimalSeparator + decimalPart.padEnd(showDecimalPlaces, '0').slice(0, showDecimalPlaces)
    : '';
  
  return formattedIntegerPart + formattedDecimalPart;
};

const BalanceDisplay = ({
  // Basic properties
  balance,
  symbol = '',
  
  // Blockchain properties
  walletAddress,
  tokenType = '0x2::sui::SUI',
  coinDecimals = 9, // SUI has 9 decimal places
  
  // Display options
  variant = 'default',
  showSymbol = true,
  showDecimalPlaces = 2,
  icon,
  showIcon = true,
  
  // Style properties
  size = 'md',
  className,
  
  // Formatting options
  thousandSeparator = ',',
  decimalSeparator = '.',
  
  // Interaction properties
  onClick,
  refreshInterval,
}: BalanceDisplayProps) => {
  const suiClient = useSuiClient();
  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);
  const [balanceData, setBalanceData] = useState<{
    balance: string | number | undefined;
    isLoading: boolean;
    error: Error | null;
  }>({
    balance: balance,
    isLoading: false,
    error: null
  });
  
  // Fetch balance if walletAddress and tokenType are provided
  const shouldFetchBalance = walletAddress && tokenType && !balance;
  
  const { data: coinData, isLoading, error, refetch } = useSuiClientQuery(
    'getBalance',
    { 
      owner: walletAddress || '',
      coinType: tokenType
    },
    { 
      enabled: !!shouldFetchBalance,
      refetchInterval: refreshInterval && refreshInterval > 0 ? refreshInterval : undefined
    }
  );
  
  // Update balance data from query result
  useEffect(() => {
    if (shouldFetchBalance) {
      setBalanceData({
        balance: coinData?.totalBalance || '0',
        isLoading,
        error: error as Error | null
      });
    } else {
      setBalanceData({
        balance,
        isLoading: false,
        error: null
      });
    }
  }, [coinData, isLoading, error, balance, shouldFetchBalance]);
  
  // Handle manual refresh
  const handleRefresh = async (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    
    if (shouldFetchBalance) {
      e.stopPropagation();
      setIsManuallyRefreshing(true);
      await refetch();
      setTimeout(() => setIsManuallyRefreshing(false), 500);
    }
  };

  // Size mappings
  const sizeClasses = {
    sm: 'text-xs h-7',
    md: 'text-sm h-8',
    lg: 'text-base h-9',
  };

  // Icon size mappings
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  // Format the balance
  const formattedBalance = formatBalance(balanceData.balance || '0', {
    showDecimalPlaces,
    thousandSeparator,
    decimalSeparator,
    coinDecimals: shouldFetchBalance ? coinDecimals : 0,
  });
  
  // Loading state
  if (balanceData.isLoading) {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-md gap-1 bg-gray-100 dark:bg-gray-800 px-3 shadow-sm',
          sizeClasses[size],
          variant === 'compact' && 'p-1 px-2',
          className
        )}
      >
        <div className="animate-pulse flex items-center">
          <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
          {showSymbol && symbol && <div className="ml-1 h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>}
        </div>
      </div>
    );
  }
  
  // Error state
  if (balanceData.error) {
    return (
      <div
        className={cn(
          'inline-flex items-center text-red-500 rounded-md bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-3',
          sizeClasses[size],
          variant === 'compact' && 'p-1 px-2',
          className
        )}
        title={balanceData.error.message}
      >
        Error loading balance
      </div>
    );
  }
  
  // Empty or invalid balance state
  if (balanceData.balance === undefined || balanceData.balance === null) {
    return (
      <div
        className={cn(
          'inline-flex items-center text-gray-400 rounded-md bg-gray-100 dark:bg-gray-800 px-3',
          sizeClasses[size],
          className
        )}
      >
        Invalid balance
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md gap-1 bg-gray-100 dark:bg-gray-800 px-3 shadow-sm',
        (shouldFetchBalance || onClick) ? 'cursor-pointer' : '',
        sizeClasses[size],
        variant === 'compact' && 'p-1 px-2',
        className
      )}
      onClick={handleRefresh}
    >
      {showIcon && icon && (
        <div className={cn('flex-shrink-0', iconSizeClasses[size])}>
          {icon}
        </div>
      )}
      <span className="font-medium text-gray-800 dark:text-gray-200">{formattedBalance}</span>
      {showSymbol && symbol && <span className="text-gray-600 dark:text-gray-400">{symbol}</span>}
      
      {shouldFetchBalance && (
        <div className={cn('ml-1 flex items-center', iconSizeClasses[size])}>
          <RotateCcw 
            className={cn(
              'text-gray-400 dark:text-gray-500', 
              isManuallyRefreshing ? 'animate-spin' : 'hover:text-gray-600 dark:hover:text-gray-300'
            )}
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
          />
        </div>
      )}
    </div>
  );
};

export default BalanceDisplay; 
