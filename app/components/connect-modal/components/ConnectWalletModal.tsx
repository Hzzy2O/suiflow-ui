import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: string) => void;
  className?: string;
}

type WalletOption = {
  id: string;
  name: string;
  logo: string;
  description: string;
};

const ConnectWalletModal = ({
  isOpen,
  onClose,
  onConnect,
  className
}: ConnectWalletModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting for the portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Simulated wallet options - in a real app, this would be dynamic
  const walletOptions: WalletOption[] = [
    {
      id: 'sui-wallet',
      name: 'Sui Wallet',
      logo: '/sui-wallet-logo.svg',
      description: 'Connect to Sui Wallet extension',
    },
    {
      id: 'ethos-wallet',
      name: 'Ethos Wallet',
      logo: '/ethos-wallet-logo.svg',
      description: 'Connect to Ethos Wallet extension',
    },
    {
      id: 'suiet-wallet',
      name: 'Suiet Wallet',
      logo: '/suiet-wallet-logo.svg',
      description: 'Connect to Suiet Wallet extension',
    },
    {
      id: 'martian-wallet',
      name: 'Martian Wallet',
      logo: '/martian-wallet-logo.svg',
      description: 'Connect to Martian Wallet extension',
    },
  ];

  // Handle animation timing when opening/closing the modal
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Delay hiding to allow close animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Restore body scrolling when modal is closed
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent rendering if not visible or not mounted
  if ((!isVisible && !isOpen) || !mounted) {
    return null;
  }

  // Handle wallet selection
  const handleWalletSelect = (walletId: string) => {
    onConnect(walletId);
  };

  // Modal content
  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity',
        isOpen ? 'opacity-100' : 'opacity-0',
        !isOpen && 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div 
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0A1428] border border-[#1E3A8A]/30 shadow-xl transition-all',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className
        )}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-[#1E3A8A]/20 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Connect Wallet</h3>
          <button
            type="button"
            className="rounded-full p-1 text-gray-400 hover:bg-[#1E3A8A]/10 hover:text-white"
            onClick={onClose}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6">
          <p className="mb-4 text-sm text-gray-300">
            Choose your preferred wallet to connect to this application.
          </p>
          
          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <div
                key={wallet.id}
                className="flex cursor-pointer items-center rounded-lg border border-[#1E3A8A]/20 p-3 transition-colors hover:bg-[#1E3A8A]/10"
                onClick={() => handleWalletSelect(wallet.id)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1E3A8A]/20">
                  {/* Placeholder for wallet logo */}
                  <div className="h-6 w-6 rounded-full bg-[#3890E3]" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-white">{wallet.name}</h4>
                  <p className="text-xs text-gray-400">{wallet.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal footer */}
        <div className="border-t border-[#1E3A8A]/20 px-6 py-4">
          <p className="text-xs text-gray-400 text-center">
            By connecting a wallet, you agree to the application&apos;s terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the root level
  return createPortal(modalContent, document.body);
};

export default ConnectWalletModal; 
