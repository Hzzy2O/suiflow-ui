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
        <h3 className="text-xl font-semibold text-white">连接钱包</h3>
        <button
          type="button"
          className="rounded-full p-1 text-gray-400 hover:bg-[#1E3A8A]/10 hover:text-white"
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">关闭</span>
        </button>
      </div>

      <div className="p-6">
        <p className="mb-4 text-sm text-gray-300">
          选择您喜欢的钱包连接到此应用程序。
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
          什么是钱包？
        </button>
      </div>
    </>
  );

  // Render what is wallet view
  const renderWhatIsWallet = () => (
    <>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">什么是钱包？</h3>
        <p className="text-sm text-gray-300 mb-4">
          区块链钱包是一个数字工具，使您能够与区块链网络进行交互。它存储您的数字资产（如加密货币或NFT）的私钥，并允许您发送、接收和管理这些资产。
        </p>
        
        <h4 className="text-lg font-medium text-white mb-2">钱包的主要功能：</h4>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-4">
          <li>保护您的数字资产</li>
          <li>发送和接收加密货币和其他数字资产</li>
          <li>与去中心化应用（DApps）交互</li>
          <li>查看您的交易历史</li>
          <li>管理您的数字身份</li>
        </ul>
        
        <p className="text-sm text-gray-300">
          钱包可以采取多种形式，包括浏览器扩展、移动应用程序或硬件设备。选择适合您需求的钱包类型非常重要。
        </p>
      </div>
      
      <div className="border-t border-[#1E3A8A]/20 px-6 py-4">
        <button 
          className="w-full rounded-md bg-[#3890E3] py-2 text-white hover:bg-[#4A90E2] transition-colors"
          onClick={() => setCurrentView('getting-started')}
        >
          如何开始使用钱包
        </button>
      </div>
    </>
  );

  // Render getting started view
  const renderGettingStarted = () => (
    <>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">开始使用钱包</h3>
        
        <div className="space-y-4">
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">1. 选择一个钱包</h4>
            <p className="text-sm text-gray-300">
              为Sui区块链选择一个兼容的钱包，如Sui钱包、Ethos或Suiet。
            </p>
          </div>
          
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">2. 安装钱包</h4>
            <p className="text-sm text-gray-300">
              从官方网站或应用商店下载并安装您选择的钱包。
            </p>
          </div>
          
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">3. 创建或导入钱包</h4>
            <p className="text-sm text-gray-300">
              按照应用程序的指导创建新钱包或使用恢复短语导入现有钱包。
            </p>
          </div>
          
          <div className="rounded-lg border border-[#1E3A8A]/20 p-4">
            <h4 className="text-lg font-medium text-white mb-2">4. 连接到应用</h4>
            <p className="text-sm text-gray-300">
              返回此应用并点击"连接钱包"按钮，然后选择您的钱包。
            </p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#1E3A8A]/20 px-6 py-4">
        <button 
          className="w-full rounded-md bg-[#3890E3] py-2 text-white hover:bg-[#4A90E2] transition-colors"
          onClick={() => setCurrentView('wallet-list')}
        >
          返回钱包列表
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
              正在连接到 {selectedWallet.name}...
            </p>
            <p className="mt-2 text-xs text-gray-400">
              请在{selectedWallet.name}中批准连接请求
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
              已成功连接到 {selectedWallet.name}!
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
              连接 {selectedWallet.name} 失败
            </p>
            <button 
              className="w-full rounded-md bg-[#3890E3] py-2 text-white hover:bg-[#4A90E2] transition-colors"
              onClick={handleRetryConnection}
            >
              重试
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
            <span className="sr-only">返回</span>
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
            <span className="sr-only">关闭</span>
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
