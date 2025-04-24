import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ConnectWalletModal from './ConnectWalletModal';

export interface ConnectWalletButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  connectedText?: string;
  isConnected?: boolean;
  walletAddress?: string;
  showAddress?: boolean;
  walletName?: string;
  walletIcon?: React.ReactNode;
  onConnect?: (walletId: string) => void;
  onDisconnect?: () => void;
}

/**
 * ConnectWalletButton - A button for connecting to web3 wallets
 */
export const ConnectWalletButton = ({
  className,
  variant = 'primary',
  size = 'md',
  text = 'Connect Wallet',
  connectedText = 'Connected',
  isConnected = false,
  walletAddress = '',
  showAddress = true,
  walletName,
  walletIcon,
  onConnect,
  onDisconnect,
  ...props
}: ConnectWalletButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format address for display (shortened format)
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleButtonClick = () => {
    if (isConnected) {
      // If connected, toggle dropdown
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      // If not connected, open the modal
      setIsModalOpen(true);
    }
  };

  const handleConnect = (walletId: string) => {
    // Close the modal
    setIsModalOpen(false);
    // Trigger the connect callback with wallet type
    onConnect?.(walletId);
  };

  const handleDisconnect = () => {
    setIsDropdownOpen(false);
    onDisconnect?.();
  };

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  // Button inner content
  const buttonContent = isConnected ? (
    <div className="flex items-center">
      {walletIcon ? (
        <span className="mr-2">{walletIcon}</span>
      ) : (
        <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
      )}
      {showAddress && walletAddress ? formatAddress(walletAddress) : (walletName || connectedText)}
    </div>
  ) : (
    text
  );

  return (
    <div className="relative">
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          // Variant styles
          variant === 'primary' && 'bg-[#3890E3] text-white hover:bg-[#4A90E2]',
          variant === 'secondary' && 'bg-[#1E3A8A]/10 text-[#3890E3] hover:bg-[#1E3A8A]/20',
          variant === 'outline' && 'border border-[#3890E3] text-[#3890E3] bg-transparent hover:bg-[#3890E3]/10',
          // Size styles
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-base',
          size === 'lg' && 'h-12 px-6 text-lg',
          // Custom styles
          className
        )}
        onClick={handleButtonClick}
        {...props}
      >
        {buttonContent}
        {isConnected && (
          <svg
            className={cn("ml-2 h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Connected state dropdown */}
      {isConnected && isDropdownOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-md border border-[#1E3A8A]/20 bg-[#0A1428] shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1 border-b border-[#1E3A8A]/20">
            <div className="px-4 py-2">
              <p className="text-xs text-gray-400">当前钱包</p>
              <p className="text-sm text-white font-medium truncate">{formatAddress(walletAddress)}</p>
            </div>
          </div>
          <div className="py-1">
            <button
              className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-[#1E3A8A]/10"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(walletAddress);
                }
              }}
            >
              复制地址
            </button>
            {walletAddress && (
              <a
                href={`https://explorer.sui.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-[#1E3A8A]/10"
              >
                在浏览器中查看
              </a>
            )}
            <button
              className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-[#1E3A8A]/10"
              onClick={handleDisconnect}
            >
              断开连接
            </button>
          </div>
        </div>
      )}

      {/* Backdrop when dropdown is open */}
      {isConnected && isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={handleClickOutside}
        />
      )}

      {/* Connect Modal */}
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default ConnectWalletButton; 
