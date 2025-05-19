'use client';

import React, { useState, useEffect } from 'react';
// Import the new Connector component
import { Connector } from '@/app/components/connector/components/Connector';
// Import shared UI components
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
// Import dapp-kit providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  SuiClientProvider,
  WalletProvider,
  // Hooks are now primarily used within the Connector component
} from '@mysten/dapp-kit';
// Import animation library
import { motion, AnimatePresence } from 'framer-motion';

// Setup for providers remains the same
const queryClient = new QueryClient();
const networks = {
  mainnet: { url: 'https://fullnode.mainnet.sui.io:443' },
  testnet: { url: 'https://fullnode.testnet.sui.io:443' },
  devnet: { url: 'https://fullnode.devnet.sui.io:443' },
};

// Page Content - simplified as logic moves to Connector
const ConnectorPageContent = () => {
  // Standard state variables for component pages
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  // Add state for active code sub-tab
  const [activeCodeTab, setActiveCodeTab] = useState('connector');

  // --- Component Documentation and Data ---
  const title = 'Connector Component';
  const description =
    'A component that combines the ConnectButton and ConnectWalletModal, handling wallet connection state and modal flow using @mysten/dapp-kit.';

  // Source code for the Connector component itself
  const connectorSourceCode = `"use client";

import React, { useState, useCallback } from 'react';
import { ConnectButton } from './ConnectButton';
import { ConnectWalletModal } from './ConnectWalletModal';
import {
  useCurrentWallet,
  useDisconnectWallet,
} from '@mysten/dapp-kit';

export const Connector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: disconnect } = useDisconnectWallet();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const isConnected = connectionStatus === 'connected';
  const currentAccount = currentWallet?.accounts[0];

  const handleConnectClick = useCallback(() => {
    if (!isConnected) {
      setIsModalOpen(true);
    }
  }, [isConnected]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsModalOpen(false);
  }, [disconnect]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <ConnectButton
        isConnected={isConnected}
        walletAddress={currentAccount?.address}
        walletName={currentWallet?.name}
        avatarUrl={currentWallet?.icon}
        onConnect={handleConnectClick}
        onDisconnect={handleDisconnect}
      />
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        // If modal needs onConnect:
        // onConnect={(walletIdentifier) => { /* handle connection */ setIsModalOpen(false); }}
      />
    </>
  );
};
`;

  // Fetch source codes for the base components
  const [buttonSourceCode, setButtonSourceCode] = useState(
    '// Loading ConnectButton source...'
  );
  const [modalSourceCode, setModalSourceCode] = useState(
    '// Loading ConnectWalletModal source...'
  );

  useEffect(() => {
    // In a real scenario, you'd fetch these. For this example, we paste them.
    // Replace these placeholders with the actual source code fetched via API or read from files if possible.
    setButtonSourceCode(`import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ConnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  connectedText?: string;
  isConnected?: boolean;
  walletAddress?: string;
  showAddress?: boolean;
  walletName?: string;
  walletIcon?: React.ReactNode;
  onConnect?: (walletId?: string) => void;
  onDisconnect?: () => void;
  avatarUrl?: string;
  balance?: {
    amount: number;
    symbol: string;
  };
  showBalance?: boolean;
}

export const ConnectButton = ({
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
  avatarUrl,
  balance,
  showBalance = false,
  ...props
}: ConnectButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
  };

  const formatBalance = (amount: number, symbol: string) => {
    return \`\${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} \${symbol}\`;
  };

  const handleButtonClick = () => {
    if (isConnected) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      onConnect?.('default-wallet-id');
    }
  };

  const handleDisconnect = () => {
    setIsDropdownOpen(false);
    onDisconnect?.();
  };

  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  const buttonContent = isConnected ? (
    <div className="flex items-center">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Wallet Avatar" className="w-5 h-5 rounded-full mr-2 object-cover" />
      ) : walletIcon ? (
        <span className="mr-2">{walletIcon}</span>
      ) : (
        <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
      )}
      <div className="flex items-center">
        {showAddress && walletAddress ? formatAddress(walletAddress) : (walletName || connectedText)}
        {showBalance && balance && (
          <span className="ml-2 text-xs opacity-80 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {formatBalance(balance.amount, balance.symbol)}
          </span>
        )}
      </div>
    </div>
  ) : (
    text
  );

  return (
    <div className="relative">
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          variant === 'primary' && 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
          variant === 'secondary' && 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800',
          variant === 'outline' && 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/50',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-base',
          size === 'lg' && 'h-12 px-6 text-lg',
          className
        )}
        onClick={handleButtonClick}
        {...props}
      >
        {buttonContent}
        {isConnected && (
          <svg className={cn("ml-2 h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isConnected && isDropdownOpen && (
        <div className={cn("absolute right-0 mt-2 w-48 rounded-md border z-50", "dark:bg-gray-800 dark:border-gray-700 dark:text-white", "bg-white border-gray-200 text-gray-800", "shadow-[0_4px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_0px_rgba(0,0,0,0.5)]")} onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b dark:border-gray-700 border-gray-200">
            <div className="flex items-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Wallet Avatar" className="w-12 h-12 rounded-full mr-3 object-cover border-2 dark:border-gray-600 border-gray-300" />
              ) : (
                <div className="w-12 h-12 rounded-full mr-3 bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white">
                  {walletAddress ? walletAddress.substring(2, 4).toUpperCase() : '??'}
                </div>
              )}
              <div>
                <p className="text-sm dark:text-white text-gray-800 font-medium">{walletName || 'My Wallet'}</p>
                <p className="text-xs dark:text-gray-400 text-gray-500 mb-1">{formatAddress(walletAddress)}</p>
                {balance && (
                  <div className="flex items-center text-xs dark:text-gray-300 text-gray-600 font-medium mt-1 bg-gray-100 dark:bg-gray-700/70 px-2 py-0.5 rounded-full max-w-fit">
                    {formatBalance(balance.amount, balance.symbol)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="py-1">
            <button className="w-full text-left block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100" onClick={() => { if (navigator.clipboard) { navigator.clipboard.writeText(walletAddress); } }}>Copy Address</button>
            {walletAddress && (
              <a href={\`https://explorer.sui.io/address/\${walletAddress}\`} target="_blank" rel="noopener noreferrer" className="w-full text-left block px-4 py-2 text-sm dark:text-gray-300 text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100">View in Explorer</a>
            )}
            <button className="w-full text-left block px-4 py-2 text-sm dark:text-red-400 text-red-500 dark:hover:bg-gray-700 hover:bg-gray-100" onClick={handleDisconnect}>Disconnect</button>
          </div>
        </div>
      )}

      {isConnected && isDropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={handleClickOutside} />
      )}
    </div>
  );
};

export default ConnectButton;`);

    setModalSourceCode(`import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { useWallets, useConnectWallet } from '@mysten/dapp-kit';

export interface WalletOption {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletOptions?: WalletOption[];
  themeMode?: 'light' | 'dark';
}

type ModalView = 'wallet-list' | 'what-is-wallet' | 'getting-started' | 'connection-status';

const convertWalletToOption = (wallet: any): WalletOption => {
  return {
    id: wallet.name,
    name: wallet.name,
    logo: wallet.icon || '',
    description: \`Connect to \${wallet.name}\`,
  };
};

export const ConnectWalletModal = ({
  isOpen,
  onClose,
  walletOptions,
  themeMode = 'light',
}: ConnectWalletModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>('wallet-list');
  const [connectingWallet, setConnectingWallet] = useState<WalletOption | null>(null);
  const installedWallets = useWallets();
  const { mutate: connect, isPending: isConnecting, error: connectionError } = useConnectWallet();

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
        const timer = setTimeout(() => {
          setMounted(false);
          if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = '';
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
    return () => {
      setMounted(false);
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  const resetModal = useCallback(() => {
    setCurrentView('wallet-list');
    setConnectingWallet(null);
  }, []);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  useEffect(() => {
    if (connectingWallet && !isConnecting && !connectionError) {
      const timer = setTimeout(() => {
        handleClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnecting, connectionError, connectingWallet, handleClose]);

  if (!mounted) {
    return null;
  }

  const availableWallets = walletOptions || (installedWallets.length > 0 ? installedWallets.map(convertWalletToOption) : []);

  const handleWalletSelect = async (walletOption: WalletOption) => {
    setConnectingWallet(walletOption);
    setCurrentView('connection-status');
    const walletToConnect = installedWallets.find(w => w.name === walletOption.name);
    if (!walletToConnect) {
      console.error(\`Could not find installed wallet adapter for \${walletOption.name}\`);
      setCurrentView('wallet-list');
      setConnectingWallet(null);
      return;
    }
    connect({ wallet: walletToConnect }, {
      onSuccess: () => console.log(\`useConnectWallet onSuccess callback for \${walletToConnect.name}\`),
      onError: (err) => console.error(\`useConnectWallet onError callback for \${walletToConnect.name}:\`, err),
    });
  };

  const handleBack = useCallback(() => {
    setConnectingWallet(null);
    setCurrentView('wallet-list');
  }, []);

  const handleRetry = useCallback(() => {
    if (connectingWallet) {
      const walletToConnect = installedWallets.find(w => w.name === connectingWallet.name);
      if (!walletToConnect) {
         console.error(\`Could not find installed wallet adapter for retry: \${connectingWallet.name}\`);
         handleBack();
         return;
      }
      connect({ wallet: walletToConnect }, {
        onSuccess: () => console.log(\`Retry onSuccess for \${connectingWallet.name}\`),
        onError: (err) => console.error(\`Retry onError for \${connectingWallet.name}:\`, err),
      });
    }
  }, [connectingWallet, installedWallets, connect, handleBack]);

  const renderWalletItem = (wallet: WalletOption) => (
    <div key={wallet.id} className={cn("flex cursor-pointer items-center rounded-lg p-2.5 transition-colors", "hover:bg-gray-100 dark:hover:bg-gray-800/50")} onClick={() => handleWalletSelect(wallet)}>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", "bg-gray-100 dark:bg-gray-800")}>
        {wallet.logo ? <img src={wallet.logo} alt={wallet.name} className="h-6 w-6" /> : <div className="h-6 w-6 rounded-full bg-[#3890E3]" />}
      </div>
      <div className="ml-3">
        <h4 className={cn("font-medium", "text-gray-900 dark:text-white")}>{wallet.name}</h4>
        <p className={cn("text-xs", "text-gray-500 dark:text-gray-400")}>{wallet.description}</p>
      </div>
    </div>
  );

  const renderWhatIsWallet = () => (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What is a Wallet?</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        A wallet is a secure digital tool for managing your blockchain assets (like SUI or NFTs) and interacting with decentralized applications (dApps).
      </p>
    </div>
  );

  const renderGettingStarted = () => (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h3>
      <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
        <li><b>Choose & Install:</b> Select a compatible Sui wallet and install it.</li>
        <li><b>Create/Import:</b> Create a new account or import an existing one. Keep your recovery phrase safe!</li>
        <li><b>Connect:</b> Return here, select your wallet, and approve the connection.</li>
      </ol>
    </div>
  );

  const renderConnectionStatus = (wallet: WalletOption) => (
    <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
      <div className={cn("mb-6 flex h-16 w-16 items-center justify-center rounded-full", "bg-[#E1F3FF] dark:bg-[#1E3A8A]/20")}>
        {wallet.logo ? <img src={wallet.logo} alt={wallet.name} className="h-10 w-10" /> : <div className="h-10 w-10 rounded-full bg-[#3890E3]" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{wallet.name}</h3>
      {isConnecting && (
        <>
          <div className="my-6 h-8 w-8 animate-spin rounded-full border-2 border-[#3890E3] border-t-transparent"></div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Connecting to {wallet.name}...</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Please approve the connection request in {wallet.name}.</p>
        </>
      )}
      {!isConnecting && !connectionError && connectingWallet?.name === wallet.name && (
         <>
          <div className="my-6 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Successfully connected to {wallet.name}! Closing...</p>
        </>
      )}
      {connectionError && connectingWallet?.name === wallet.name && (
        <>
          <div className="my-6 flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Failed to connect to {wallet.name}.</p>
           <p className="text-xs text-red-400 mb-4 max-w-xs text-center break-words">{connectionError?.message || 'An unknown error occurred.'}</p>
          <button className={cn("rounded-md px-4 py-2 text-white transition-colors", "bg-[#3890E3] hover:bg-[#4A90E2]", "dark:bg-[#3890E3] dark:hover:bg-[#4A90E2]")} onClick={handleRetry}>Retry</button>
        </>
      )}
    </div>
  );

  const renderInfoColumn = () => (
    <div className="p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What is a Wallet?</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">A wallet is a secure digital tool for managing your blockchain assets and interacting with decentralized applications.</p>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'what-is-wallet': return renderWhatIsWallet();
      case 'getting-started': return renderGettingStarted();
      case 'connection-status': return connectingWallet && renderConnectionStatus(connectingWallet);
      case 'wallet-list':
      default:
        return (
          <>
            <div className={cn("flex items-center justify-between border-b px-6 py-4", "border-gray-100 dark:border-gray-700/50")}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Connect Wallet</h3>
              <button type="button" className={cn("rounded-full p-1", "text-gray-500 hover:bg-gray-100 hover:text-gray-700", "dark:text-gray-400 dark:hover:bg-[#1E3A8A]/10 dark:hover:text-white")} onClick={handleClose}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="flex min-h-[400px]">
              <div className={cn("w-3/5 border-r flex flex-col", "border-gray-100 dark:border-gray-700/50")}>
                <div className="p-6 flex-grow overflow-y-auto">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Choose your preferred wallet to connect.</p>
                  <div className="space-y-3">
                    {availableWallets.map(renderWalletItem)}
                  </div>
                </div>
                <div className={cn("border-t px-6 py-3 mt-auto", "border-gray-100 dark:border-gray-700/50")}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">By connecting, you agree to the Terms & Privacy Policy.</p>
                </div>
              </div>
              <div className={cn("w-2/5", "bg-gray-50 dark:bg-[#0A1428]/50")}>
                {renderInfoColumn()}
              </div>
            </div>
          </>
        );
    }
  };

  const modalContent = (
    <div className={cn('fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity', isOpen ? 'opacity-100' : 'opacity-0', !isOpen && 'pointer-events-none', themeMode === 'dark' ? 'dark' : '')}>
      <div className={cn('absolute inset-0 backdrop-blur-sm transition-opacity', 'bg-black/30 dark:bg-black/50', isOpen ? 'opacity-100' : 'opacity-0')} onClick={handleClose} />
      <div className={cn('relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl transition-all', 'bg-white dark:bg-[#0A1428]', 'border border-gray-200 dark:border-[#1E3A8A]/30', isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0')}>
        {currentView !== 'wallet-list' && !isConnecting && (
          <button type="button" className={cn("absolute top-4 left-4 rounded-full p-1 z-10", "text-gray-500 hover:bg-gray-100 hover:text-gray-700", "dark:text-gray-400 dark:hover:bg-[#1E3A8A]/10 dark:hover:text-white")} onClick={handleBack}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="sr-only">Back</span>
          </button>
        )}
        {renderContent()}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConnectWalletModal;`);
  }, []); // Run only once on mount

  // --- Usage Example ---
  const usageExample = [
    {
      title: 'Usage Example',
      code: `import React from 'react';
import { Connector } from '@/app/components/connector/components/Connector';
// Import Dapp-kit Providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';

// Setup required providers
const queryClient = new QueryClient();
const networks = { mainnet: { url: '...' }, /* other networks */ };

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="mainnet">
        <WalletProvider>
          {/* Your application structure */}
          <header>
            {/* Place the Connector component where needed */}
            <Connector />
          </header>
          <main>
            {/* Rest of your app */}
          </main>
          {/* Your application structure */}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}`,
    },
  ];

  // Props data for the Connector component (it currently takes none, but you could add pass-through props)
  const propsData = [
    {
      name: '(No Props)',
      type: '-',
      description:
        'The Connector component currently manages its state internally using dapp-kit hooks and takes no external props. You can modify it to accept props for customization (e.g., button text, modal options).',
    },
    // Example if you add pass-through props:
    // {
    //   name: 'buttonProps',
    //   type: 'Partial<ConnectButtonProps>',
    //   description: 'Props to pass directly to the underlying ConnectButton.'
    // },
    // {
    //   name: 'modalProps',
    //   type: 'Partial<ConnectWalletModalProps>',
    //   description: 'Props to pass directly to the underlying ConnectWalletModal.'
    // },
  ];

  // Installation command (assuming the user needs the base button/modal components if not already present)
  const installCommand = 'npx @suiflow/ui@latest add connector';

  // Mount effect
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handlers for page elements (tabs, dark mode, copy)
  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const copyToClipboard = (text: string, step: number) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopiedStep(step);
          setTimeout(() => setCopiedStep(null), 2000);
        },
        () => alert('Failed to copy.')
      );
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedStep(step);
        setTimeout(() => setCopiedStep(null), 2000);
      } catch (err) {
        alert('Failed to copy.');
      }
      document.body.removeChild(textarea);
    }
  };

  // --- JSX Structure ---
  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">{title}</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">{description}</p>
      </div>

      <div className="flex flex-col items-start mt-10">
        {/* Tabs and Dark Mode Toggle */}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            {/* Preview Tab Button */}
            <button
              className={`flex items-center text-white px-3 py-1 rounded-md ${
                activeTab === 'Preview'
                  ? 'bg-gradient-to-r from-[#0A1428] to-[#0A2440] text-[#6FBCF0] border-b-2 border-[#3890E3]'
                  : ''
              }`}
              onClick={() => handleTabChange('Preview')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />{' '}
              </svg>
              Preview
            </button>
            {/* Code Tab Button */}
            <button
              className={`flex items-center text-white px-3 py-1 rounded-md ${
                activeTab === 'Code'
                  ? 'bg-gradient-to-r from-[#0A1428] to-[#0A2440] text-[#6FBCF0] border-b-2 border-[#3890E3]'
                  : ''
              }`}
              onClick={() => handleTabChange('Code')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />{' '}
              </svg>
              Code
            </button>
          </div>
          {/* Dark Mode Toggle Button */}
          <div className="mr-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center rounded-full p-2 text-white focus:outline-none"
              onClick={toggleDarkMode}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.svg
                    key="dark"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                    initial={hasMounted ? { opacity: 0, rotate: -90 } : false}
                    animate={hasMounted ? { opacity: 1, rotate: 0 } : false}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.1 }}
                  >
                    {' '}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                    />{' '}
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="light"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                    initial={hasMounted ? { opacity: 0, rotate: -90 } : false}
                    animate={hasMounted ? { opacity: 1, rotate: 0 } : false}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.1 }}
                  >
                    {' '}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />{' '}
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[#0A1428]/80 border rounded-lg border-[#2A3746] w-full h-auto mt-2">
          <div>
            {/* Preview Tab Content */}
            {activeTab === 'Preview' && (
              <div
                className="p-8 relative bg-[#0A1428] border-[#2A3746] rounded-lg"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(58, 145, 227, 0.07) 1px, transparent 1px),
                                  linear-gradient(to bottom, rgba(58, 145, 227, 0.07) 1px, transparent 1px)`,
                  backgroundSize: '10px 10px',
                }}
              >
                <div className={darkMode ? 'dark' : ''}>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Live Connector Component
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      This uses the integrated Connector component below.
                    </p>
                    {/* Render the new Connector component */}
                    <Connector />
                  </div>
                </div>
              </div>
            )}
            {/* Code Tab Content */}
            {activeTab === 'Code' && (
              <div className="flex flex-col">
                {' '}
                {/* Main container for Code tab */}
                {/* Sub-tab buttons row */}
                <div className="flex border-b border-[#2A3746] overflow-x-auto">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeCodeTab === 'connector'
                        ? 'text-[#6FBCF0] border-b-2 border-[#6FBCF0]'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveCodeTab('connector')}
                  >
                    Connector
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeCodeTab === 'button'
                        ? 'text-[#6FBCF0] border-b-2 border-[#6FBCF0]'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveCodeTab('button')}
                  >
                    ConnectButton
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeCodeTab === 'modal'
                        ? 'text-[#6FBCF0] border-b-2 border-[#6FBCF0]'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveCodeTab('modal')}
                  >
                    ConnectWalletModal
                  </button>
                </div>
                {/* Conditionally rendered code blocks */}
                <div className="max-w-full overflow-x-auto p-4">
                  {' '}
                  {/* Added padding */}
                  {activeCodeTab === 'connector' && (
                    <SuiFlowSourceCodeBlock
                      codeString={connectorSourceCode}
                      language="javascript"
                    />
                  )}
                  {activeCodeTab === 'button' && (
                    <SuiFlowSourceCodeBlock
                      codeString={buttonSourceCode}
                      language="javascript"
                    />
                  )}
                  {activeCodeTab === 'modal' && (
                    <SuiFlowSourceCodeBlock
                      codeString={modalSourceCode}
                      language="javascript"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Installation Section */}
        <div className="pt-20 py-3 text-xl font-semibold">
          <div className="flex items-center">
            <div className="mr-2 sm:pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-[#6FBCF0]"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />{' '}
              </svg>
            </div>
            Installation
          </div>
        </div>
        <div>
          <div className="relative sm:ml-3">
            {' '}
            {/* Use relative for positioning copy button */}
            <pre className="bg-[#0A1428] p-3 rounded-md overflow-auto text-sm sm:text-base w-full sm:w-auto max-w-full border border-[#2A3746]">
              {/* Installation command might just refer to adding the base components if Connector isn't directly addable */}
              <code className="text-zinc-300 pr-10">{installCommand}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(installCommand, 1)}
              className="absolute right-2 top-2 p-2 w-10 h-auto bg-[#1E3A8A]/30 rounded hover:bg-[#1E3A8A]/50 border border-[#2A3746]"
              aria-label="Copy command"
            >
              {copiedStep === 1 ? (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#4ADE80"
                  className="w-4 h-4"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 1.1, 1], opacity: [1, 1, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  {' '}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />{' '}
                </motion.svg>
              ) : (
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400"
                >
                  {' '}
                  <path
                    d="M9 6.75H7.75C6.64543 6.75 5.75 7.64543 5.75 8.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V8.75C18.25 7.64543 17.3546 6.75 16.25 6.75H15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  ></path>{' '}
                  <path
                    d="M14 8.25H10C9.44772 8.25 9 7.80228 9 7.25V5.75C9 5.19772 9.44772 4.75 10 4.75H14C14.5523 4.75 15 5.19772 15 5.75V7.25C15 7.80228 14.5523 8.25 14 8.25Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  ></path>{' '}
                  <path
                    d="M9.75 12.25H14.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  ></path>{' '}
                  <path
                    d="M9.75 15.25H14.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  ></path>{' '}
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Usage Section */}
        <div className="pt-20 py-3 text-xl font-semibold">
          <div className="flex items-center">
            <div className="mr-2 sm:pl-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-[#6FBCF0]"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                />{' '}
              </svg>
            </div>
            Usage
          </div>
        </div>
        <SuiFlowExampleBlock files={usageExample} />
      </div>
      {/* Modal rendering is now handled within the Connector component */}
    </div>
  );
};

// Main component export remains the same, providing the context
const ConnectorPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="mainnet">
        <WalletProvider /* Consider adapters={[]} if customizing wallets */>
          <ConnectorPageContent />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default ConnectorPage;
