"use client";

import React, { useState } from 'react';
import { ConnectWalletButton } from './';
import SideBar from '@/components/suiflow/SideBar';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import ComponentFooter from '@/components/suiflow/ComponentFooter';

const ConnectWalletPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setWalletAddress('0x1234567890abcdef1234567890abcdef');
  };

  const handleDisconnect = () => {
    // Simulate wallet disconnection
    setIsConnected(false);
    setWalletAddress('');
  };

  // Demo components and their code
  const exampleBlocks = [
    {
      title: '基础连接按钮',
      description: '最基础的连接钱包按钮，点击后会显示钱包连接模态框。',
      component: (
        <div className="flex items-center justify-center p-4">
          <ConnectWalletButton
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
        </div>
      ),
      code: `import { ConnectWalletButton } from '@/app/components/connect-wallet';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = () => {
    setIsConnected(true);
    setWalletAddress('0x1234567890abcdef1234567890abcdef');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  return (
    <ConnectWalletButton
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      isConnected={isConnected}
      walletAddress={walletAddress}
    />
  );
}`,
    },
    {
      title: '不同样式的连接按钮',
      description: '连接按钮支持多种样式变体，包括主要、次要和轮廓样式。',
      component: (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          <ConnectWalletButton
            variant="primary"
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
          <ConnectWalletButton
            variant="secondary"
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
          <ConnectWalletButton
            variant="outline"
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
        </div>
      ),
      code: `import { ConnectWalletButton } from '@/app/components/connect-wallet';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <div className="flex gap-4">
      <ConnectWalletButton
        variant="primary"
        onConnect={() => {}}
        onDisconnect={() => {}}
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
      <ConnectWalletButton
        variant="secondary"
        onConnect={() => {}}
        onDisconnect={() => {}}
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
      <ConnectWalletButton
        variant="outline"
        onConnect={() => {}}
        onDisconnect={() => {}}
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
    </div>
  );
}`,
    },
    {
      title: '不同尺寸的连接按钮',
      description: '连接按钮支持多种尺寸变体，包括小、中和大尺寸。',
      component: (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          <ConnectWalletButton
            size="sm"
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
          <ConnectWalletButton
            size="md"
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
          <ConnectWalletButton
            size="lg"
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
        </div>
      ),
      code: `import { ConnectWalletButton } from '@/app/components/connect-wallet';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <div className="flex gap-4">
      <ConnectWalletButton
        size="sm"
        onConnect={() => {}}
        onDisconnect={() => {}}
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
      <ConnectWalletButton
        size="md"
        onConnect={() => {}}
        onDisconnect={() => {}}
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
      <ConnectWalletButton
        size="lg"
        onConnect={() => {}}
        onDisconnect={() => {}}
        isConnected={isConnected}
        walletAddress={walletAddress}
      />
    </div>
  );
}`,
    },
    {
      title: '自定义文本的连接按钮',
      description: '连接按钮支持自定义文本和连接后显示文本。',
      component: (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          <ConnectWalletButton
            text="连接 Sui 钱包"
            connectedText="已连接"
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
            showAddress={false}
          />
        </div>
      ),
      code: `import { ConnectWalletButton } from '@/app/components/connect-wallet';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <ConnectWalletButton
      text="连接 Sui 钱包"
      connectedText="已连接"
      onConnect={() => {}}
      onDisconnect={() => {}}
      isConnected={isConnected}
      walletAddress={walletAddress}
      showAddress={false}
    />
  );
}`,
    },
  ];

  // Source code for the components
  const componentSourceCode = {
    button: `import React, { useState } from 'react';
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
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const ConnectWalletButton = ({
  className,
  variant = 'primary',
  size = 'md',
  text = 'Connect Wallet',
  connectedText = 'Connected',
  isConnected = false,
  walletAddress = '',
  showAddress = true,
  onConnect,
  onDisconnect,
  ...props
}: ConnectWalletButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format address for display (shortened format)
  const formatAddress = (address: string) => {
    if (!address) return '';
    return \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
  };

  const handleButtonClick = () => {
    if (isConnected) {
      // If connected, trigger disconnect callback
      onDisconnect?.();
    } else {
      // If not connected, open the modal
      setIsModalOpen(true);
    }
  };

  const handleConnect = (walletType: string) => {
    // Close the modal
    setIsModalOpen(false);
    // Trigger the connect callback with wallet type
    onConnect?.();
  };

  return (
    <>
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
        {isConnected ? (
          <div className="flex items-center">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
            {showAddress && walletAddress ? formatAddress(walletAddress) : connectedText}
          </div>
        ) : (
          text
        )}
      </button>

      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
      />
    </>
  );
};`,
    modal: `import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
    } else {
      // Delay hiding to allow close animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent rendering if not visible
  if (!isVisible && !isOpen) {
    return null;
  }

  // Handle wallet selection
  const handleWalletSelect = (walletId: string) => {
    onConnect(walletId);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity',
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
};

export default ConnectWalletModal;`,
  };

  // Component documentation
  const documentation = {
    title: '连接钱包组件',
    description:
      '连接钱包组件是 SuiFlow UI 的核心 Web3 组件，用于处理钱包连接过程。它包含一个连接按钮和一个连接模态框。',
    usage: `import { ConnectWalletButton } from '@/app/components/connect-wallet';

export default function App() {
  return <ConnectWalletButton />;
}`,
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'outline'",
        defaultValue: 'primary',
        description: '按钮的样式变体。',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: 'md',
        description: '按钮的尺寸。',
      },
      {
        name: 'text',
        type: 'string',
        defaultValue: 'Connect Wallet',
        description: '未连接状态下显示的文本。',
      },
      {
        name: 'connectedText',
        type: 'string',
        defaultValue: 'Connected',
        description: '已连接状态下显示的文本（当 showAddress 为 false 时）。',
      },
      {
        name: 'isConnected',
        type: 'boolean',
        defaultValue: 'false',
        description: '钱包是否已连接。',
      },
      {
        name: 'walletAddress',
        type: 'string',
        defaultValue: "''",
        description: '已连接的钱包地址。',
      },
      {
        name: 'showAddress',
        type: 'boolean',
        defaultValue: 'true',
        description: '是否在已连接状态下显示钱包地址。',
      },
      {
        name: 'onConnect',
        type: '() => void',
        defaultValue: 'undefined',
        description: '钱包连接成功时的回调函数。',
      },
      {
        name: 'onDisconnect',
        type: '() => void',
        defaultValue: 'undefined',
        description: '钱包断开连接时的回调函数。',
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <SideBar />
      <div className="flex-1 px-4 lg:px-8 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#3890E3]">
              {documentation.title}
            </h1>
            <p className="text-[#E5E7EB] mt-4 text-base">{documentation.description}</p>

            <div className="mt-10 space-y-10">
              {/* Example usage */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">使用示例</h2>
                <SuiFlowSourceCodeBlock codeString={documentation.usage} language="javascript" />
              </div>

              {/* Props */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">属性</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#1E3A8A]/20">
                        <th className="py-2 px-4 text-left text-white font-semibold">属性名</th>
                        <th className="py-2 px-4 text-left text-white font-semibold">类型</th>
                        <th className="py-2 px-4 text-left text-white font-semibold">默认值</th>
                        <th className="py-2 px-4 text-left text-white font-semibold">描述</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E3A8A]/20">
                      {documentation.props.map((prop) => (
                        <tr key={prop.name}>
                          <td className="py-2 px-4 text-white font-mono text-sm">{prop.name}</td>
                          <td className="py-2 px-4 text-[#3890E3] font-mono text-sm">{prop.type}</td>
                          <td className="py-2 px-4 text-gray-400 font-mono text-sm">{prop.defaultValue}</td>
                          <td className="py-2 px-4 text-gray-300 text-sm">{prop.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Examples */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">示例</h2>
                <div className="space-y-6">
                  {exampleBlocks.map((block, index) => {
                    // 使用默认title或创建文件数组以适配SuiFlowExampleBlock组件
                    const files = [{
                      title: block.title || 'example.js',
                      code: block.code
                    }];
                    
                    return (
                      <div key={index} className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-2">{block.title}</h3>
                        <p className="text-gray-300 mb-4">{block.description}</p>
                        <SuiFlowExampleBlock
                          files={files}
                          defaultTitle={files[0].title}
                        >
                          {block.component}
                        </SuiFlowExampleBlock>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Component Code */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">组件源代码</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">ConnectWalletButton.tsx</h3>
                    <SuiFlowSourceCodeBlock codeString={componentSourceCode.button} language="javascript" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">ConnectWalletModal.tsx</h3>
                    <SuiFlowSourceCodeBlock codeString={componentSourceCode.modal} language="javascript" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ComponentFooter />
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletPage; 
