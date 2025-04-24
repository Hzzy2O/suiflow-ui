import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export interface WalletOption {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string) => void;
  className?: string;
  walletOptions?: WalletOption[];
  title?: string;
  description?: string;
  footerText?: string;
  closeButtonContent?: React.ReactNode;
  backdropClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  walletItemClassName?: string;
  showFooter?: boolean;
  showWhatIsWallet?: boolean;
  showGettingStarted?: boolean;
  renderWalletItem?: (wallet: WalletOption, onSelect: (wallet: WalletOption) => void) => React.ReactNode;
  renderWhatIsWallet?: () => React.ReactNode;
  renderGettingStarted?: () => React.ReactNode;
  renderConnectionStatus?: (wallet: WalletOption, status: ConnectionStatus) => React.ReactNode;
}

const defaultWalletOptions: WalletOption[] = [
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

type ModalView = 'wallet-list' | 'what-is-wallet' | 'getting-started' | 'connection-status';

type ConnectionStatus = 'connecting' | 'failed' | 'success' | null;

export const ConnectWalletModal = ({
  isOpen,
  onClose,
  onConnect,
  className,
  walletOptions = defaultWalletOptions,
  title = 'Connect Wallet',
  description = 'Choose your preferred wallet to connect to this application.',
  backdropClassName,
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  walletItemClassName,
  showFooter = true,
  showWhatIsWallet = true,
  showGettingStarted = true,
  footerText = 'By connecting a wallet, you agree to the application\'s terms of service and privacy policy.',
  closeButtonContent,
  renderWalletItem,
  renderWhatIsWallet,
  renderGettingStarted,
  renderConnectionStatus,
}: ConnectWalletModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>('wallet-list');
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const resetModal = () => {
    setCurrentView('wallet-list');
    setSelectedWallet(null);
    setConnectionStatus(null);
  };

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
        resetModal();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if ((!isVisible && !isOpen) || !mounted) {
    return null;
  }

  const handleWalletSelect = (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setCurrentView('connection-status');
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setConnectionStatus(success ? 'success' : 'failed');
      
      if (success) {
        setTimeout(() => {
          onConnect(wallet.id);
        }, 1000);
      }
    }, 2000);
  };

  const handleBack = () => {
    if (currentView === 'connection-status') {
      setConnectionStatus(null);
    }
    setCurrentView('wallet-list');
  };

  const handleRetry = () => {
    if (selectedWallet) {
      setConnectionStatus('connecting');
      
      setTimeout(() => {
        const success = Math.random() > 0.2;
        setConnectionStatus(success ? 'success' : 'failed');
        
        if (success) {
          setTimeout(() => {
            onConnect(selectedWallet.id);
          }, 1000);
        }
      }, 2000);
    }
  };

  const defaultRenderWalletItem = (wallet: WalletOption) => (
    <div
      key={wallet.id}
      className={cn(
        "flex cursor-pointer items-center rounded-lg border border-[#1E3A8A]/20 p-3 transition-colors hover:bg-[#1E3A8A]/10",
        walletItemClassName
      )}
      onClick={() => handleWalletSelect(wallet)}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1E3A8A]/20">
        {wallet.logo ? (
          <img src={wallet.logo} alt={wallet.name} className="h-6 w-6" />
        ) : (
          <div className="h-6 w-6 rounded-full bg-[#3890E3]" />
        )}
      </div>
      <div className="ml-3">
        <h4 className="font-medium text-white">{wallet.name}</h4>
        <p className="text-xs text-gray-400">{wallet.description}</p>
      </div>
    </div>
  );

  const defaultRenderWhatIsWallet = () => (
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

  const defaultRenderGettingStarted = () => (
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

  const defaultRenderConnectionStatus = (wallet: WalletOption, status: ConnectionStatus) => (
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E3A8A]/20">
        {wallet.logo ? (
          <img src={wallet.logo} alt={wallet.name} className="h-10 w-10" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-[#3890E3]" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{wallet.name}</h3>
      
      {status === 'connecting' && (
        <>
          <div className="my-6 h-8 w-8 animate-spin rounded-full border-2 border-[#3890E3] border-t-transparent"></div>
          <p className="text-sm text-gray-300">
            正在连接到 {wallet.name}...
          </p>
          <p className="mt-2 text-xs text-gray-400">
            请在{wallet.name}中批准连接请求
          </p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <div className="my-6 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-300">
            已成功连接到 {wallet.name}!
          </p>
        </>
      )}
      
      {status === 'failed' && (
        <>
          <div className="my-6 flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            连接到 {wallet.name} 失败
          </p>
          <button 
            className="rounded-md bg-[#3890E3] px-4 py-2 text-white hover:bg-[#4A90E2] transition-colors"
            onClick={handleRetry}
          >
            重试
          </button>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'what-is-wallet':
        return renderWhatIsWallet ? renderWhatIsWallet() : defaultRenderWhatIsWallet();
      case 'getting-started':
        return renderGettingStarted ? renderGettingStarted() : defaultRenderGettingStarted();
      case 'connection-status':
        return selectedWallet && (renderConnectionStatus 
          ? renderConnectionStatus(selectedWallet, connectionStatus) 
          : defaultRenderConnectionStatus(selectedWallet, connectionStatus));
      case 'wallet-list':
      default:
        return (
          <>
            <div className={cn("flex items-center justify-between border-b border-[#1E3A8A]/20 px-6 py-4", headerClassName)}>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 hover:bg-[#1E3A8A]/10 hover:text-white"
                onClick={onClose}
              >
                {closeButtonContent || (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="sr-only">关闭</span>
              </button>
            </div>

            <div className={cn("p-6", bodyClassName)}>
              {description && <p className="mb-4 text-sm text-gray-300">{description}</p>}
              
              <div className="space-y-3">
                {walletOptions.map((wallet) => (
                  renderWalletItem 
                    ? renderWalletItem(wallet, handleWalletSelect)
                    : defaultRenderWalletItem(wallet)
                ))}
              </div>
            </div>

            {showFooter && (
              <div className={cn("border-t border-[#1E3A8A]/20 px-6 py-4", footerClassName)}>
                {showWhatIsWallet && (
                  <button
                    className="text-sm text-[#3890E3] hover:text-[#4A90E2] w-full text-center"
                    onClick={() => setCurrentView('what-is-wallet')}
                  >
                    什么是钱包？
                  </button>
                )}
                {!showWhatIsWallet && (
                  <p className="text-xs text-gray-400 text-center">{footerText}</p>
                )}
              </div>
            )}
          </>
        );
    }
  };

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity',
        isOpen ? 'opacity-100' : 'opacity-0',
        !isOpen && 'pointer-events-none',
        className
      )}
    >
      <div 
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0',
          backdropClassName
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full max-w-md overflow-hidden rounded-2xl bg-[#0A1428] border border-[#1E3A8A]/30 shadow-xl transition-all',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          contentClassName
        )}
      >
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
        
        {currentView === 'wallet-list' && (
          <button
            type="button"
            className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-[#1E3A8A]/10 hover:text-white z-10"
            onClick={onClose}
          >
            {closeButtonContent || (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="sr-only">关闭</span>
          </button>
        )}
        
        {renderContent()}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConnectWalletModal; 
