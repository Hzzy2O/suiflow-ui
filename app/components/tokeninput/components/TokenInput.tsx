import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MaximizeIcon } from 'lucide-react';
import { useSuiClient } from '@mysten/dapp-kit';

export interface TokenInputProps {
  // Basic properties
  value: string;
  onChange: (value: string) => void;
  
  // Token properties
  tokenSymbol?: string;
  tokenDecimals?: number;
  tokenIcon?: React.ReactNode;
  
  // Balance properties
  balance?: string;
  balanceLabel?: string;
  showBalance?: boolean;
  
  // Display options
  showMaxButton?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  
  // Style properties
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  inputClassName?: string;
  
  // Interaction properties
  onMaxClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const TokenInput = ({
  // Basic properties
  value,
  onChange,
  
  // Token properties
  tokenSymbol,
  tokenDecimals = 9,
  tokenIcon,
  
  // Balance properties
  balance,
  balanceLabel = 'Balance',
  showBalance = true,
  
  // Display options
  showMaxButton = true,
  placeholder = '0.0',
  disabled = false,
  error,
  
  // Style properties
  size = 'md',
  className,
  inputClassName,
  
  // Interaction properties
  onMaxClick,
  onFocus,
  onBlur,
}: TokenInputProps) => {
  // State for the input
  const [isFocused, setIsFocused] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: 'text-xs h-10',
    md: 'text-sm h-12',
    lg: 'text-base h-14',
  };
  
  // Input size mappings
  const inputSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  
  // Ensure value is valid number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    // Only allow valid number inputs with decimals
    const regex = new RegExp(`^\\d*(\\.\\d{0,${tokenDecimals}})?$`);
    if (regex.test(inputValue)) {
      onChange(inputValue);
    }
  };
  
  // Handle MAX button click
  const handleMaxClick = () => {
    if (disabled) return;
    
    if (onMaxClick) {
      onMaxClick();
      return;
    }
    
    if (balance) {
      onChange(balance);
    }
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  // Format balance for display
  const formatBalance = (bal: string) => {
    if (!bal) return '0';
    
    // Try to parse as number
    const numBal = parseFloat(bal);
    if (isNaN(numBal)) return bal;
    
    // Format with appropriate decimal places
    if (numBal > 1000000) {
      return `${(numBal / 1000000).toFixed(2)}M`;
    } else if (numBal > 1000) {
      return `${(numBal / 1000).toFixed(2)}K`;
    } else {
      // Display full balance with up to tokenDecimals places
      const parts = bal.split('.');
      if (parts.length === 1) return bal;
      
      // Trim trailing zeros
      const decimalPart = parts[1].replace(/0+$/, '');
      if (decimalPart === '') return parts[0];
      
      return `${parts[0]}.${decimalPart}`;
    }
  };
  
  return (
    <div className={cn('w-full', className)}>
      {/* Top row with balance info */}
      {showBalance && (
        <div className="flex justify-end mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {balanceLabel}: {formatBalance(balance || '0')} {tokenSymbol}
          </span>
        </div>
      )}
      
      {/* Main input container */}
      <div
        className={cn(
          'flex items-center w-full rounded-md border px-3 bg-white dark:bg-gray-800',
          sizeClasses[size],
          isFocused && 'ring-2 ring-offset-1 ring-blue-500',
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
          disabled && 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
          'transition-all duration-200'
        )}
      >
        {/* Token icon if provided */}
        {tokenIcon && (
          <div className="mr-2 flex-shrink-0">
            {tokenIcon}
          </div>
        )}
        
        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full outline-none bg-transparent',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'text-gray-900 dark:text-gray-100',
            'font-medium',
            inputSizeClasses[size],
            inputClassName
          )}
        />
        
        {/* Token symbol */}
        {tokenSymbol && (
          <div className="ml-2 text-gray-500 dark:text-gray-400 font-medium">
            {tokenSymbol}
          </div>
        )}
        
        {/* MAX button */}
        {showMaxButton && balance && (
          <button
            onClick={handleMaxClick}
            disabled={disabled}
            className={cn(
              'ml-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs',
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-600',
              'transition-colors',
              'font-medium',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <MaximizeIcon size={12} />
            <span>MAX</span>
          </button>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default TokenInput; 
