import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ConnectWalletButton } from '..';

export interface WalletContextState {
  isConnected: boolean;
  walletAddress: string;
  walletName: string;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: Error | null;
}

const defaultState: WalletContextState = {
  isConnected: false,
  walletAddress: '',
  walletName: '',
  connect: async () => {
    console.warn('No wallet connector provided');
  },
  disconnect: () => {
    console.warn('No wallet connector provided');
  },
  isConnecting: false,
  error: null
};

const WalletContext = createContext<WalletContextState>(defaultState);

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletName, setWalletName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if there's a connected wallet in local storage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setIsConnected(true);
        setWalletAddress(walletData.address);
        setWalletName(walletData.name);
      } catch (e) {
        console.error('Failed to restore wallet connection', e);
        localStorage.removeItem('connectedWallet');
      }
    }
  }, []);

  const connect = async (walletId: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // In a real implementation, this would interact with actual wallet SDKs
      // This is a mock implementation for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet data based on selected wallet
      let mockAddress = '0x1234567890abcdef1234567890abcdef';
      let displayName = '';
      
      switch (walletId) {
        case 'sui-wallet':
          displayName = 'Sui Wallet';
          mockAddress = '0x7d7e247d5bc852979cf975fea12b3c6349cfeb67284a32add5e6edd62c5d7765';
          break;
        case 'ethos-wallet':
          displayName = 'Ethos Wallet';
          mockAddress = '0x4a5f910696fd33add5b92c4e5382811c5308298223d87837b9bea3df1860ba56';
          break;
        case 'suiet-wallet':
          displayName = 'Suiet Wallet';
          mockAddress = '0x23a9b9e931c8c5551bdac02dc86196e3b9818be7dbac68ba73ab8c4bd1dda75e';
          break;
        case 'martian-wallet':
          displayName = 'Martian Wallet';
          mockAddress = '0x8af85ac86e41d556ca5878af56beae5e6991a6dc3e64cc1bf39198be08eb1ef8';
          break;
        default:
          displayName = 'Unknown Wallet';
      }
      
      // Update state
      setIsConnected(true);
      setWalletAddress(mockAddress);
      setWalletName(displayName);
      
      // Save to local storage
      localStorage.setItem('connectedWallet', JSON.stringify({
        address: mockAddress,
        name: displayName
      }));
      
    } catch (e) {
      console.error('Failed to connect wallet', e);
      setError(e instanceof Error ? e : new Error('Failed to connect wallet'));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setWalletName('');
    localStorage.removeItem('connectedWallet');
  };

  const value = {
    isConnected,
    walletAddress,
    walletName,
    connect,
    disconnect,
    isConnecting,
    error
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const WalletConnector: React.FC<{
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  buttonSize?: 'sm' | 'md' | 'lg';
  connectText?: string;
  showAddress?: boolean;
}> = ({
  buttonVariant = 'primary',
  buttonSize = 'md',
  connectText = 'Connect Wallet',
  showAddress = true
}) => {
  const { isConnected, walletAddress, walletName, connect, disconnect } = useWallet();

  return (
    <ConnectWalletButton
      variant={buttonVariant}
      size={buttonSize}
      text={connectText}
      isConnected={isConnected}
      walletAddress={walletAddress}
      walletName={walletName}
      showAddress={showAddress}
      onConnect={connect}
      onDisconnect={disconnect}
    />
  );
};

export default WalletConnector; 
