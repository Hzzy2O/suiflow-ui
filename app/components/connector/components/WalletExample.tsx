import React from 'react';
import { WalletProvider, WalletConnector, useWallet } from '..';

// WalletStatus组件展示当前钱包状态
const WalletStatus = () => {
  const { isConnected, walletAddress, walletName, isConnecting, error } = useWallet();
  
  if (isConnecting) {
    return <div className="p-4 rounded-md bg-blue-50 text-blue-500">正在连接钱包...</div>;
  }
  
  if (error) {
    return <div className="p-4 rounded-md bg-red-50 text-red-500">连接错误: {error.message}</div>;
  }
  
  if (!isConnected) {
    return <div className="p-4 rounded-md bg-gray-50 text-gray-500">未连接钱包</div>;
  }
  
  return (
    <div className="p-4 rounded-md bg-green-50 text-green-700">
      <p className="font-semibold">{walletName} 已连接</p>
      <p className="text-sm break-all">{walletAddress}</p>
    </div>
  );
};

// 示例页面
export const WalletExample = () => {
  return (
    <WalletProvider>
      <div className="max-w-lg mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">钱包连接示例</h1>
          <p className="text-gray-600">这个示例展示了如何使用钱包连接组件</p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">默认样式</h2>
            <WalletConnector />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">二级样式按钮</h2>
            <WalletConnector buttonVariant="secondary" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">轮廓样式按钮</h2>
            <WalletConnector 
              buttonVariant="outline" 
              connectText="连接到钱包" 
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">大尺寸按钮</h2>
            <WalletConnector 
              buttonSize="lg" 
              connectText="连接钱包" 
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">钱包状态</h2>
            <WalletStatus />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default WalletExample; 
