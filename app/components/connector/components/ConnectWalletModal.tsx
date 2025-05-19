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

type ModalView = 'wallet-list' | 'what-is-wallet' | 'getting-started' | 'connection-status';

/**
 * ConnectWalletModal - A modal for selecting and connecting to web3 wallets
 */
const ConnectWalletModal = ({
  isOpen,
  onClose,
  onConnect,
  className
}: ConnectWalletModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>('wallet-list');
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'failed' | 'success' | null>(null);

  // Handle client-side mounting
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
        resetModal();
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

  // Reset modal state
  const resetModal = () => {
    setCurrentView('wallet-list');
    setSelectedWallet(null);
    setConnectionStatus(null);
  };

  // Handle wallet selection
  const handleWalletSelect = (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setCurrentView('connection-status');
    setConnectionStatus('connecting');
    
    // Simulate connection attempt
    setTimeout(() => {
      // 90% success rate for simulation
      const success = Math.random() > 0.1;
      if (success) {
        setConnectionStatus('success');
        setTimeout(() => {
          onConnect(wallet.id);
          onClose();
        }, 1000);
      } else {
        setConnectionStatus('failed');
      }
    }, 1500);
  };

  // Handle back button
  const handleBack = () => {
    if (currentView === 'connection-status' && connectionStatus === 'failed') {
      // If connection failed, go back to wallet list
      setCurrentView('wallet-list');
      setConnectionStatus(null);
    } else if (currentView !== 'wallet-list') {
      // Otherwise, go back to wallet list
      setCurrentView('wallet-list');
    }
  };

  // Handle retry connection
  const handleRetryConnection = () => {
    if (selectedWallet) {
      setConnectionStatus('connecting');
      
      // Simulate connection attempt
      setTimeout(() => {
        // Higher success rate on retry for better UX
        const success = Math.random() > 0.05;
        if (success) {
          setConnectionStatus('success');
          setTimeout(() => {
            onConnect(selectedWallet.id);
            onClose();
          }, 1000);
        } else {
          setConnectionStatus('failed');
        }
      }, 1500);
    }
  };

  // Render wallet list view
  const renderWalletList = () => (
    <>
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

      <div className="p-6">
        <p className="mb-4 text-sm text-gray-300">
          Select your preferred wallet to connect to this application.
        </p>
        
        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <div
              key={wallet.id}
              className="flex cursor-pointer items-center rounded-lg border border-[#1E3A8A]/20 p-3 transition-colors hover:bg-[#1E3A8A]/10"
              onClick={() => handleWalletSelect(wallet)}
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

      <div className="border-t border-[#1E3A8A]/20 px-6 py-4">
        <button
          className="text-sm text-[#3890E3] hover:text-[#4A90E2] w-full text-center"
          onClick={() => setCurrentView('what-is-wallet')}
        >
          What is a wallet?
        </button>
      </div>
    </>
  );

  // Render what is wallet view
  const renderWhatIsWallet = () => (
    <>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">What is a wallet?</h3>
        <p className="text-sm text-gray-300 mb-4">
          A blockchain wallet is a digital tool that enables you to interact with blockchain networks. It stores the private keys for your digital assets (such as cryptocurrencies or NFTs) and allows you to send, receive, and manage these assets.
        </p>
        
        <h4 className="text-lg font-medium text-white mb-2">Main functions of a wallet:</h4>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-4">
          <li>Protect your digital assets</li>
          <li>Send and receive cryptocurrencies and other digital assets</li>
          <li>Interact with decentralized applications (DApps)</li>
          <li>View your transaction history</li>
          <li>Manage your digital identity</li>
        </ul>
        
        <p className="text-sm text-gray-300">
          Wallets can take many forms, including browser extensions, mobile apps, or hardware devices. It is important to choose the type of wallet that best suits your needs.
        </p>
      </div>
      
      <div className="border-t border-[#1E3A8A]/20 px-6 py-4">
        <button 
          className="w-full rounded-md bg-[#3890E3] py-2 text-white hover:bg-[#4A90E2] transition-colors"
          onClick={() => setCurrentView('getting-started')}
        >
          How to get started with a wallet
        </button>
      </div>
    </>
  );

  // Render getting started view
  const renderGettingStarted = () => (
    <>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Getting Started with a Wallet</h3>
        
        <div className="space-y-4">
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">1. Choose a wallet</h4>
            <p className="text-sm text-gray-300">
              Choose a compatible wallet for the Sui blockchain, such as Sui Wallet, Ethos, or Suiet.
            </p>
          </div>
          
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">2. Install the wallet</h4>
            <p className="text-sm text-gray-300">
              Download and install your chosen wallet from the official website or app store.
            </p>
          </div>
          
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">3. Create or import a wallet</h4>
            <p className="text-sm text-gray-300">
              Follow the app instructions to create a new wallet or import an existing one using a recovery phrase.
            </p>
          </div>
          
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">4. Connect to the app</h4>
            <p className="text-sm text-gray-300">
              Return to this app and click the &quot;Connect Wallet&quot; button, then select your wallet.
            </p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#1E3A8A]/20 px-6 py-4">
        <button 
          className="w-full rounded-md bg-[#3890E3] py-2 text-white hover:bg-[#4A90E2] transition-colors"
          onClick={() => setCurrentView('wallet-list')}
        >
          Back to wallet list
        </button>
      </div>
    </>
  );

  // Render connection status view
  const renderConnectionStatus = () => {
    if (!selectedWallet) return null;
    
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E3A8A]/20">
          {/* Placeholder for wallet logo */}
          <div className="h-10 w-10 rounded-full bg-[#3890E3]" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">{selectedWallet.name}</h3>
        
        {connectionStatus === 'connecting' && (
          <>
            <div className="my-6 h-8 w-8 animate-spin rounded-full border-2 border-[#3890E3] border-t-transparent"></div>
            <p className="text-sm text-gray-300">
              Connecting to {selectedWallet.name}...
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Please approve the connection request in {selectedWallet.name}
            </p>
          </>
        )}
        
        {connectionStatus === 'success' && (
          <>
            <div className="my-6 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">
              Successfully connected to {selectedWallet.name}!
            </p>
          </>
        )}
        
        {connectionStatus === 'failed' && (
          <>
            <div className="my-6 flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Failed to connect to {selectedWallet.name}
            </p>
            <button 
              className="w-full rounded-md bg-[#3890E3] py-2 text-white hover:bg-[#4A90E2] transition-colors"
              onClick={handleRetryConnection}
            >
              Retry
            </button>
          </>
        )}
      </div>
    );
  };

  // Render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'what-is-wallet':
        return renderWhatIsWallet();
      case 'getting-started':
        return renderGettingStarted();
      case 'connection-status':
        return renderConnectionStatus();
      default:
        return renderWalletList();
    }
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
        {/* Back button for sub-views */}
        {currentView !== 'wallet-list' && (
          <button
            type="button"
            className="absolute top-4 left-4 rounded-full p-1 text-gray-400 hover:bg-[#1E3A8A]/10 hover:text-white z-10"
            onClick={handleBack}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="sr-only">Back</span>
          </button>
        )}
        
        {/* Close button */}
        {currentView === 'wallet-list' && (
          <button
            type="button"
            className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-[#1E3A8A]/10 hover:text-white z-10"
            onClick={onClose}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        )}
        
        {/* Render view content */}
        {renderContent()}
      </div>
    </div>
  );

  // Use createPortal to render the modal at the root level
  return createPortal(modalContent, document.body);
};

export default ConnectWalletModal; 
