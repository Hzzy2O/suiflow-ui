import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MaximizeIcon, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { SUI_TYPE_ARG } from '@mysten/sui/utils';
import { SuiClient } from '@mysten/sui/client';
import { CoinBalance, CoinMetadata } from '@mysten/sui/client';

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  iconUrl?: string;
  balance?: string;
}

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

  // Token selection properties
  tokenAddresses?: string[];
  tokens?: TokenInfo[]; // Predefined token data
  selectedTokenAddress?: string;
  onTokenSelect?: (tokenAddress: string, tokenInfo: TokenInfo) => void;
  userAddress?: string;
  showTokenSelector?: boolean;
  
  // New features
  percentageOptions?: number[]; // Array of percentage values (e.g., [25, 50, 75, 100])
  fixedAmountOptions?: string[]; // Array of fixed amount values (e.g., ["10", "100", "1000"])
  showRefreshButton?: boolean;
  onRefreshBalance?: () => Promise<void> | void; // Callback for refreshing balance
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

  // Token selection properties
  tokenAddresses = [],
  tokens: predefinedTokens,
  selectedTokenAddress,
  onTokenSelect,
  userAddress,
  showTokenSelector = false,
  
  // New features
  percentageOptions,
  fixedAmountOptions,
  showRefreshButton = false,
  onRefreshBalance,
}: TokenInputProps) => {
  // State for the input
  const [isFocused, setIsFocused] = useState(false);
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [tokensList, setTokensList] = useState<TokenInfo[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [userTokenBalances, setUserTokenBalances] = useState<Record<string, string>>({});
  const [hasSuiContext, setHasSuiContext] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Always call hooks at the top level, even if we handle errors later
  let suiClient: SuiClient | undefined;
  let currentAccount: { address: string } | null = null;
  
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    suiClient = useSuiClient();
  } catch (error) {
    if (!hasSuiContext) {
      setHasSuiContext(false);
    }
  }
  
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    currentAccount = useCurrentAccount();
  } catch (error) {
    if (hasSuiContext) {
      setHasSuiContext(false);
    }
  }
  
  const accountAddress = userAddress || currentAccount?.address;

  // Size mappings
  const sizeClasses = {
    sm: 'text-xs h-9',
    md: 'text-sm h-11',
    lg: 'text-base h-13',
  };
  
  // Input size mappings
  const inputSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  // Use predefined tokens if provided, otherwise fetch from blockchain
  useEffect(() => {
    if (predefinedTokens && predefinedTokens.length > 0) {
      setTokensList(predefinedTokens);
      
      // Set default selected token
      if (!selectedToken) {
        const defaultToken = predefinedTokens.find(t => t.address === selectedTokenAddress) || predefinedTokens[0];
        setSelectedToken(defaultToken);
      }
      
      // Set balances from predefined tokens
      const balancesMap: Record<string, string> = {};
      predefinedTokens.forEach(token => {
        if (token.balance) {
          balancesMap[token.address] = token.balance;
        }
      });
      
      if (Object.keys(balancesMap).length > 0) {
        setUserTokenBalances(balancesMap);
      }
      
      return;
    }
    
    const fetchTokensMetadata = async () => {
      if (!hasSuiContext || !tokenAddresses || tokenAddresses.length === 0) {
        // Handle case where there's no Sui context but static tokens are provided
        if (!hasSuiContext && tokenAddresses.length > 0) {
          const staticTokens: TokenInfo[] = tokenAddresses.map(address => {
            // Special case for SUI
            
            
            // For other tokens, create a placeholder with the address
            return {
              address,
              symbol: address.split('::').pop() || 'Unknown',
              name: `Token (${address.substring(0, 8)}...)`,
              decimals: 9,
            };
          });
          
          setTokensList(staticTokens);
          
          // Set default selected token
          if (staticTokens.length > 0 && !selectedToken) {
            const defaultToken = staticTokens.find(t => t.address === selectedTokenAddress) || staticTokens[0];
            setSelectedToken(defaultToken);
          }
        }
        return;
      }

      if (!suiClient) return;

      try {
        const tokenInfoPromises = tokenAddresses.map(async (address) => {
          // Handle SUI token specially
          if (address === SUI_TYPE_ARG || address === '0x2::sui::SUI') {
            return {
              address: SUI_TYPE_ARG,
              symbol: 'SUI',
              name: 'Sui',
              decimals: 9,
              iconUrl: 'https://strapi-dev.scand.app/uploads/sui_c07df05f00.png',
            } as TokenInfo;
          }

          // Fetch metadata for other tokens
          try {
            const metadata = await suiClient.getCoinMetadata({ coinType: address });
            if (!metadata) return null;

            return {
              address,
              symbol: metadata.symbol || 'Unknown',
              name: metadata.name || 'Unknown Token',
              decimals: metadata.decimals || 9,
              iconUrl: metadata.iconUrl || undefined,
            } as TokenInfo;
          } catch (error) {
            console.warn(`Error fetching metadata for token ${address}:`, error);
            // Provide a fallback token with basic info derived from the address
            return {
              address,
              symbol: address.split('::').pop() || 'Unknown',
              name: `Token (${address.substring(0, 8)}...)`,
              decimals: 9,
            } as TokenInfo;
          }
        });

        const tokensDataWithNull = await Promise.all(tokenInfoPromises);
        const tokensData = tokensDataWithNull.filter((token): token is TokenInfo => token !== null);
        setTokensList(tokensData);

        // Set default selected token if not already set
        if (tokensData.length > 0 && !selectedToken) {
          const defaultToken = tokensData.find(t => t.address === selectedTokenAddress) || tokensData[0];
          if (defaultToken) {
            setSelectedToken(defaultToken);
          }
        }
      } catch (error) {
        console.error('Error fetching token metadata:', error);
      }
    };

    fetchTokensMetadata();
  }, [suiClient, selectedTokenAddress, hasSuiContext, predefinedTokens]);

  // Fetch user's balances for tokens
  useEffect(() => {
    // If using predefined tokens with balances, skip blockchain query
    if (predefinedTokens && predefinedTokens.length > 0) {
      return;
    }
    
    const fetchUserBalances = async () => {
      if (!hasSuiContext || !accountAddress || tokensList.length === 0 || !suiClient) {
        // If balance prop is provided directly, use it for the selected token
        if (balance && selectedToken) {
          const balanceMap: Record<string, string> = {};
          balanceMap[selectedToken.address] = balance;
          setUserTokenBalances(balanceMap);
        }
        return;
      }

      try {
        const balancesPromises = tokensList.map(async (token) => {
          try {
            const balance = await suiClient.getBalance({
              owner: accountAddress,
              coinType: token.address,
            });

            return {
              address: token.address,
              balance: balance.totalBalance,
              decimals: token.decimals,
            };
          } catch (error) {
            console.warn(`Error fetching balance for token ${token.address}:`, error);
            return {
              address: token.address,
              balance: '0',
              decimals: token.decimals,
            };
          }
        });

        const balances = await Promise.all(balancesPromises);
        const balancesMap: Record<string, string> = {};

        balances.forEach((item) => {
          // Convert balance from smallest unit to standard unit (e.g., MIST to SUI)
          const formattedBalance = (parseInt(item.balance) / Math.pow(10, item.decimals)).toString();
          balancesMap[item.address] = formattedBalance;
        });

        setUserTokenBalances(balancesMap);
      } catch (error) {
        console.error('Error fetching user balances:', error);
      }
    };

    fetchUserBalances();
  }, [accountAddress, tokensList, suiClient, balance, selectedToken, hasSuiContext, predefinedTokens]);

  // Handle token selection
  const handleTokenSelect = (token: TokenInfo) => {
    setSelectedToken(token);
    setIsTokenDropdownOpen(false);
    
    // Update balance based on selected token
    if (userTokenBalances[token.address]) {
      token.balance = userTokenBalances[token.address];
    }

    if (onTokenSelect) {
      onTokenSelect(token.address, token);
    }
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
    const decimals = selectedToken?.decimals || tokenDecimals;
    const regex = new RegExp(`^\\d*(\\.\\d{0,${decimals}})?$`);
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
    
    // Use selected token balance if available
    const currentBalance = selectedToken && userTokenBalances[selectedToken.address] 
      ? userTokenBalances[selectedToken.address] 
      : balance;
    
    if (currentBalance) {
      onChange(currentBalance);
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

  // Get current balance to display
  const getCurrentBalance = () => {
    if (selectedToken && userTokenBalances[selectedToken.address]) {
      return userTokenBalances[selectedToken.address];
    }
    return balance || '0';
  };

  // Get current token symbol
  const getCurrentSymbol = () => {
    if (selectedToken) {
      return selectedToken.symbol;
    }
    return tokenSymbol || '';
  };

  // Create token icon from URL or use provided icon
  const getTokenIcon = () => {
    if (selectedToken?.iconUrl) {
      return (
        <img 
          src={selectedToken.iconUrl} 
          alt={selectedToken.symbol} 
          className="w-6 h-6 rounded-full"
        />
      );
    }
    return tokenIcon;
  };
  
  // Handle percentage button click
  const handlePercentageClick = (percentage: number) => {
    if (disabled) return;
    
    const currentBalance = selectedToken && userTokenBalances[selectedToken.address] 
      ? userTokenBalances[selectedToken.address] 
      : balance;
    
    if (currentBalance) {
      const numericBalance = parseFloat(currentBalance);
      const percentageValue = (numericBalance * percentage / 100).toString();
      onChange(percentageValue);
    }
  };
  
  // Handle fixed amount button click
  const handleFixedAmountClick = (amount: string) => {
    if (disabled) return;
    onChange(amount);
  };
  
  // Handle refresh balance
  const handleRefreshBalance = async () => {
    if (disabled || isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      if (onRefreshBalance) {
        await onRefreshBalance();
      } else if (hasSuiContext && suiClient && accountAddress && selectedToken) {
        // If no custom refresh handler, refresh from blockchain
        try {
          const balance = await suiClient.getBalance({
            owner: accountAddress,
            coinType: selectedToken.address,
          });
          
          const formattedBalance = (parseInt(balance.totalBalance) / Math.pow(10, selectedToken.decimals)).toString();
          const balancesMap = { ...userTokenBalances };
          balancesMap[selectedToken.address] = formattedBalance;
          setUserTokenBalances(balancesMap);
        } catch (error) {
          console.warn(`Error refreshing balance for token ${selectedToken.address}:`, error);
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className={cn('w-full', className)}>
      {/* Top row with balance info and options */}
      {showBalance && (
        <div className="flex justify-between items-center mb-1.5 flex-wrap gap-y-1">
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150">
              {balanceLabel}: {formatBalance(getCurrentBalance())} {getCurrentSymbol()}
            </span>
            
            {/* Refresh balance button */}
            {showRefreshButton && (
              <button
                onClick={handleRefreshBalance}
                disabled={disabled || isRefreshing}
                className={cn(
                  "ml-1.5 p-0.5 rounded-full",
                  "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
                  "transition-colors duration-150",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin-gentle" : ""} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {/* Percentage options */}
            {percentageOptions && percentageOptions.length > 0 && getCurrentBalance() !== '0' && (
              <div className="flex flex-wrap gap-1 justify-end">
                {percentageOptions.map((percentage) => (
                  <button
                    key={`percent-${percentage}`}
                    onClick={() => handlePercentageClick(percentage)}
                    disabled={disabled}
                    className={cn(
                      'px-1.5 py-0.5 text-xs rounded',
                      'bg-gray-100 dark:bg-gray-800',
                      'text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-200 dark:hover:bg-gray-700',
                      'transition-colors duration-150',
                      'border border-gray-200 dark:border-gray-700',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            )}
            
            {/* Fixed amount options */}
            {fixedAmountOptions && fixedAmountOptions.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {fixedAmountOptions.map((amount) => (
                  <button
                    key={`amount-${amount}`}
                    onClick={() => handleFixedAmountClick(amount)}
                    disabled={disabled}
                    className={cn(
                      'px-1.5 py-0.5 text-xs rounded',
                      'bg-gray-100 dark:bg-gray-800',
                      'text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-200 dark:hover:bg-gray-700',
                      'transition-colors duration-150',
                      'border border-gray-200 dark:border-gray-700',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main input container */}
      <div
        className={cn(
          'flex items-center w-full rounded-xl px-4 bg-gray-50 dark:bg-gray-800/60',
          sizeClasses[size],
          isFocused 
            ? error 
              ? 'bg-red-50/50 dark:bg-red-900/10 shadow-[0_0_0_1px] shadow-red-500/30 dark:shadow-red-500/20' 
              : 'bg-blue-50/30 dark:bg-blue-900/10 shadow-[0_0_0_1px] shadow-blue-500/30 dark:shadow-blue-500/20'
            : error
              ? 'shadow-[0_0_0_1px] shadow-red-500/40 dark:shadow-red-500/30'
              : 'shadow-[0_0_0_1px] shadow-gray-200 dark:shadow-gray-700/50',
          disabled && 'opacity-60 cursor-not-allowed bg-gray-100/80 dark:bg-gray-900/50',
          'transition-all duration-200'
        )}
      >
        {/* Token selector */}
        {showTokenSelector && (
          <div className="relative">
            <button
              type="button"
              onClick={() => !disabled && setIsTokenDropdownOpen(!isTokenDropdownOpen)}
              disabled={disabled}
              className={cn(
                'flex items-center gap-2 pr-3 mr-3 border-r border-gray-200 dark:border-gray-700',
                'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-300',
                'transition-colors duration-150 py-1.5',
                disabled && 'cursor-not-allowed opacity-70'
              )}
            >
              {getTokenIcon()}
              <span className="font-medium">{getCurrentSymbol()}</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isTokenDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Token dropdown - Simplified to only show symbol and icon */}
            {isTokenDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 z-10 w-44 max-h-64 overflow-y-auto py-1 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700">
                {tokensList.length > 0 ? (
                  <div className="flex flex-col">
                    {tokensList.map((token) => (
                      <button
                        key={token.address}
                        type="button"
                        onClick={() => handleTokenSelect(token)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full',
                          selectedToken?.address === token.address && 'bg-blue-50 dark:bg-blue-900/30',
                          'relative'
                        )}
                      >
                        {token.iconUrl ? (
                          <img src={token.iconUrl} alt={token.symbol} className="w-6 h-6 rounded-full flex-shrink-0" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {token.symbol.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{token.symbol}</span>
                        
                        {selectedToken?.address === token.address && (
                          <div className="ml-auto">
                            <Check size={14} className="text-blue-500" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">No tokens available</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Token icon if provided and not using selector */}
        {!showTokenSelector && getTokenIcon() && (
          <div className="mr-3 flex-shrink-0">
            {getTokenIcon()}
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
            'font-medium tracking-tight',
            inputSizeClasses[size],
            inputClassName
          )}
        />
        
        {/* Token symbol */}
        {!showTokenSelector && getCurrentSymbol() && (
          <div className="ml-2 text-gray-600 dark:text-gray-300 font-semibold">
            {getCurrentSymbol()}
          </div>
        )}
        
        {/* MAX button */}
        {showMaxButton && getCurrentBalance() !== '0' && (
          <button
            onClick={handleMaxClick}
            disabled={disabled}
            className={cn(
              'ml-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs',
              'bg-white/80 dark:bg-gray-700/50 text-blue-600 dark:text-blue-300',
              'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-200',
              'transition-colors duration-150',
              'font-medium shadow-sm',
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
        <div className="mt-1.5 text-xs font-medium text-red-500 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default TokenInput; 
