'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import { useTransactionNotifier } from './components/TransactionNotifier';
import PropsTable from '@/components/suiflow/Table';

// Source code
const sourcecode = `
'use client';
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck, AlertCircle, AlertTriangle, Info, Loader2, ArrowUpCircle } from 'lucide-react';

// Add transaction status types
type NotifierType = 'success' | 'error' | 'warning' | 'info' | 'submitting' | 'processing' | 'completed' | 'failed';
type NotifierPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface Notification {
  id: number;
  message: string;
  type: NotifierType;
  // Optional transaction hash for Sui transactions
  txHash?: string;
}

interface TransactionNotifierContextType {
  showNotifier: (message: string, type?: NotifierType, position?: NotifierPosition, txHash?: string) => void;
  // Convenience method for transaction status notifications
  showTxStatus: (status: 'submitting' | 'processing' | 'completed' | 'failed', message?: string, txHash?: string, position?: NotifierPosition) => void;
  // Method to set dark mode explicitly
  setDarkModeExplicitly: (isDark: boolean) => void;
}

const TransactionNotifierContext = createContext<TransactionNotifierContextType | undefined>(undefined);

export const TransactionNotifierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<{ notification: Notification; position: NotifierPosition }[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  // Track if dark mode is enabled
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Store timeouts associated with notification IDs
  const [timeouts, setTimeouts] = useState<Record<number, NodeJS.Timeout>>({});

  // Function to explicitly set dark mode (for syncing with UI)
  const setDarkModeExplicitly = useCallback((isDark: boolean) => {
    setIsDarkMode(isDark);
  }, []);

  // Check for system dark mode preference on mount
  useEffect(() => {
    setIsMounted(true);
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    // Listen for changes in system theme preference
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  // Function to clear a specific timeout
  const clearTimeoutById = useCallback((id: number) => {
    setTimeouts(prev => {
      if (prev[id]) {
        clearTimeout(prev[id]);
        const { [id]: _, ...rest } = prev; // Create new object without the id
        return rest;
      }
      return prev;
    });
  }, []);

  // Function to dismiss a notification and clear its timeout
  const dismissNotification = useCallback((id: number) => {
    clearTimeoutById(id); // Clear timeout when dismissing
    setNotifications(prev => prev.filter(item => item.notification.id !== id));
  }, [clearTimeoutById]);

  // Effect to manage auto-close timeouts based on notification type
  useEffect(() => {
    notifications.forEach(({ notification }) => {
      const { id, type } = notification;
      // Determine if this type should auto-close (e.g., success/error states, but not pending ones)
      const shouldAutoClose = type === 'completed' || type === 'failed' || type === 'success' || type === 'error' || type === 'warning' || type === 'info';
      const autoCloseDuration = 5000; // 5 seconds

      // Clear existing timeout if it exists and the notification should no longer auto-close (e.g., updated to 'processing')
      if (timeouts[id] && !shouldAutoClose) {
         clearTimeoutById(id);
      }

      // Set a new timeout if it should auto-close and doesn't have one set already
      if (shouldAutoClose && !timeouts[id]) {
        const timer = setTimeout(() => {
          // Use the dismiss function which also handles timeout clearing
          dismissNotification(id);
        }, autoCloseDuration);
        // Store the timeout ID
        setTimeouts(prev => ({ ...prev, [id]: timer }));
      }
    });

    // --- Cleanup orphaned timeouts ---
    // Get IDs of current notifications
    const currentIds = new Set(notifications.map(n => n.notification.id));
    // Iterate over stored timeouts
    Object.keys(timeouts).forEach(idStr => {
      const idNum = parseInt(idStr, 10);
      // If a stored timeout ID doesn't correspond to a current notification, clear it
      if (!currentIds.has(idNum)) {
        clearTimeoutById(idNum);
      }
    });

    // Dependencies: Run when notifications change or dismiss/clear functions are updated.
    // Avoid adding \`timeouts\` itself to prevent potential loops.
  }, [notifications, dismissNotification, clearTimeoutById]);

  const showNotifier = useCallback((
    message: string,
    type: NotifierType = 'info',
    position: NotifierPosition = 'top-right',
    txHash?: string
  ) => {
    setNotifications(prevNotifications => {
      // Try to find an existing notification with the same txHash and position
      const existingTxIndex = txHash
        ? prevNotifications.findIndex(item => item.notification.txHash === txHash && item.position === position)
        : -1;

      if (existingTxIndex !== -1) {
        // --- Update existing notification ---
        const updatedNotifications = [...prevNotifications];
        const existingItem = updatedNotifications[existingTxIndex];

        // If the type changes, clear any existing timeout; useEffect will set a new one if needed.
        if (existingItem.notification.type !== type) {
           clearTimeoutById(existingItem.notification.id);
        }

        // Update the notification in place, keeping the original ID
        updatedNotifications[existingTxIndex] = {
          ...existingItem,
          notification: {
            ...existingItem.notification, // Keep ID and txHash
            message, // Update message
            type,    // Update type
          },
          // Keep original position
        };
        return updatedNotifications; // Return the updated array
      } else {
        // --- Add new notification ---
        // Use Date.now() or a more robust UUID generator for unique IDs
        const id = Date.now();
        const newNotification = { notification: { id, message, type, txHash }, position };
        // Return a new array with the new notification appended
        return [...prevNotifications, newNotification];
      }
    });
  }, [clearTimeoutById]);

  // Convenience method for transaction status notifications
  const showTxStatus = useCallback((
    status: 'submitting' | 'processing' | 'completed' | 'failed',
    message?: string,
    txHash?: string,
    position: NotifierPosition = 'top-right'
  ) => {
    const statusMessages = {
      submitting: message || 'Submitting transaction to Sui blockchain...',
      processing: message || 'Transaction is being processed...',
      completed: message || 'Transaction completed successfully!',
      failed: message || 'Transaction failed to process. Please try again.'
    };

    // Call showNotifier without the autoClose argument
    showNotifier(statusMessages[status], status, position, txHash);
  }, [showNotifier]);

  if (!isMounted) {
    return null;
  }

  return (
    <TransactionNotifierContext.Provider value={{ showNotifier, showTxStatus, setDarkModeExplicitly }}>
      {children}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'].map((pos) => (
        <NotifierContainer
          key={pos}
          // Pass only notifications matching the current position
          notifications={notifications.filter(t => t.position === pos)}
          position={pos as NotifierPosition}
          isDarkMode={isDarkMode}
          // Pass the enhanced dismissNotification function
          onDismiss={dismissNotification}
        />
      ))}
    </TransactionNotifierContext.Provider>
  );
};

export const useTransactionNotifier = () => {
  const context = useContext(TransactionNotifierContext);
  if (!context) {
    throw new Error('useTransactionNotifier must be used within a TransactionNotifierProvider');
  }
  return context;
};

interface NotifierContainerProps {
  notifications: { notification: Notification; position: NotifierPosition }[];
  position: NotifierPosition;
  isDarkMode: boolean;
  onDismiss: (id: number) => void;
}

const NotifierContainer: React.FC<NotifierContainerProps> = ({ notifications, position, isDarkMode, onDismiss }) => {
  // Determine if it's mobile view to potentially adjust position
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Adjust position for mobile if needed (e.g., consolidate top-left/right to top)
  const adjustedPosition = isMobile ? (position.startsWith('top') ? 'top' : 'bottom') : position;

  const getPositionClasses = () => {
    switch (adjustedPosition) {
      case 'top-left':
        return 'top-20 left-4';
      case 'top-right':
        return 'top-20 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top': // Consolidated mobile top position
        return 'top-20 left-1/2 transform -translate-x-1/2 w-[90%]'; // Make wider on mobile maybe
      case 'bottom': // Consolidated mobile bottom position
        return 'bottom-4 left-1/2 transform -translate-x-1/2 w-[90%]'; // Make wider on mobile maybe
      case 'center': // Center position (might overlap mobile top)
        return 'top-20 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-full'; // Adjust width for mobile/desktop
      default:
        return 'top-20 right-4'; // Default fallback
    }
  };

  const getInitialY = () => {
    // Adjust initial Y based on the *adjusted* position
    if (adjustedPosition.startsWith('top') || adjustedPosition === 'center') {
      return -50; // Animate from top
    } else { // bottom
      return 50;  // Animate from bottom
    }
  };

  return (
    <div className={\`fixed \${getPositionClasses()} max-w-sm px-4 sm:px-0 space-y-2 z-50\`}>
      <AnimatePresence>
        {notifications.map(({ notification }) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: getInitialY() }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: getInitialY() }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <TransactionNotification 
              {...notification} 
              isDarkMode={isDarkMode} 
              onDismiss={() => onDismiss(notification.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface TransactionNotificationProps extends Notification {
  isDarkMode: boolean;
  onDismiss: () => void;
}

const TransactionNotification: React.FC<TransactionNotificationProps> = ({ message, type, txHash, isDarkMode, onDismiss }) => {
  // Configure styles based on type and theme
  const typeConfig = {
    // Light mode styles
    light: {
      success: { icon: CircleCheck, bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' },
      error: { icon: AlertCircle, bgColor: 'bg-red-50', textColor: 'text-red-800', borderColor: 'border-red-200' },
      warning: { icon: AlertTriangle, bgColor: 'bg-yellow-50', textColor: 'text-yellow-800', borderColor: 'border-yellow-200' },
      info: { icon: Info, bgColor: 'bg-blue-50', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
      submitting: { icon: ArrowUpCircle, bgColor: 'bg-indigo-50', textColor: 'text-indigo-800', borderColor: 'border-indigo-200' },
      processing: { icon: Loader2, bgColor: 'bg-purple-50', textColor: 'text-purple-800', borderColor: 'border-purple-200' },
      completed: { icon: CircleCheck, bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' },
      failed: { icon: AlertCircle, bgColor: 'bg-red-50', textColor: 'text-red-800', borderColor: 'border-red-200' }
    },
    // Dark mode styles
    dark: {
      success: { icon: CircleCheck, bgColor: 'bg-green-900/40', textColor: 'text-green-300', borderColor: 'border-green-800' },
      error: { icon: AlertCircle, bgColor: 'bg-red-900/40', textColor: 'text-red-300', borderColor: 'border-red-800' },
      warning: { icon: AlertTriangle, bgColor: 'bg-yellow-900/40', textColor: 'text-yellow-300', borderColor: 'border-yellow-800' },
      info: { icon: Info, bgColor: 'bg-blue-900/40', textColor: 'text-blue-300', borderColor: 'border-blue-800' },
      submitting: { icon: ArrowUpCircle, bgColor: 'bg-indigo-900/40', textColor: 'text-indigo-300', borderColor: 'border-indigo-800' },
      processing: { icon: Loader2, bgColor: 'bg-purple-900/40', textColor: 'text-purple-300', borderColor: 'border-purple-800' },
      completed: { icon: CircleCheck, bgColor: 'bg-green-900/40', textColor: 'text-green-300', borderColor: 'border-green-800' },
      failed: { icon: AlertCircle, bgColor: 'bg-red-900/40', textColor: 'text-red-300', borderColor: 'border-red-800' }
    }
  };

  const theme = isDarkMode ? 'dark' : 'light';
  const { icon: Icon, bgColor, textColor, borderColor } = typeConfig[theme][type];

  // Add spinning animation for processing status
  const iconClass = \`\${textColor} w-5 h-5 \${type === 'processing' ? 'animate-spin' : ''}\`;

  return (
    <div className={\`\${bgColor} \${borderColor} border rounded-lg shadow-lg p-4 flex items-center justify-between max-w-full\`}>
      <div className="flex items-center space-x-3">
        <Icon className={iconClass} />
        <div>
          <p className={\`\${textColor} font-medium\`}>{message}</p>
          {txHash && (
            <a 
              href={\`https://explorer.sui.io/txblock/\${txHash}\`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={\`text-xs \${textColor} opacity-80 hover:opacity-100 hover:underline\`}
            >
              View transaction
            </a>
          )}
        </div>
      </div>
      <button 
        onClick={onDismiss}
        className={\`p-1 rounded-full hover:bg-black/10 \${textColor} opacity-70 hover:opacity-100\`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
`;

// Example code
const example = [
  {
    title: 'Example.tsx',
    code: `'use client';
import { useTransactionNotifier } from './components/TransactionNotifier';
import { useState, useEffect } from 'react';

function Page() {
  const { showTxStatus, setDarkModeExplicitly } = useTransactionNotifier();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Mock transaction hashes
  const successTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const failedTxHash = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';
  
  // Toggle dark mode
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    // Sync dark mode with the notifier component
    setDarkModeExplicitly(newDarkMode);
    // Update document class if using tailwind dark mode
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Simulate successful Sui transaction
  const simulateSuccessTransaction = async () => {
    // 1. Submission step
    showTxStatus('submitting', 'Transaction submitted to network...', successTxHash);
    
    // 2. Processing step
    setTimeout(() => {
      showTxStatus('processing', 'Transaction is being processed...', successTxHash);
      
      // 3. Complete step (with auto-close enabled - default behavior)
      setTimeout(() => {
        showTxStatus('completed', 'Transaction completed successfully!', successTxHash);
      }, 3000);
    }, 2000);
  };

  // Simulate failed Sui transaction
  const simulateFailedTransaction = async () => {
    // 1. Submission step
    showTxStatus('submitting', 'Transaction submitted to network...', failedTxHash);
    
    // 2. Processing step
    setTimeout(() => {
      showTxStatus('processing', 'Transaction is being processed...', failedTxHash);
      
      // 3. Fail step
      setTimeout(() => {
        showTxStatus('failed', 'Transaction failed: insufficient gas to execute', failedTxHash);
      }, 3000);
    }, 2000);
  };

  return (
    <div className={\`flex flex-col justify-center items-center h-screen space-y-4 \${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}\`}>
      <div className="mb-8">
        <button 
          onClick={toggleTheme} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-full mb-8"
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="flex flex-col items-center space-y-4">
          <h2 className={\`text-xl font-bold mb-2 \${isDarkMode ? 'text-white' : 'text-black'}\`}>Successful Transaction</h2>
          <button 
            onClick={simulateSuccessTransaction} 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full"
          >
            Simulate Success
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <h2 className={\`text-xl font-bold mb-2 \${isDarkMode ? 'text-white' : 'text-black'}\`}>Failed Transaction</h2>
          <button 
            onClick={simulateFailedTransaction} 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full"
          >
            Simulate Failure
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
`,
  },
  {
    title: 'Layout.tsx',
    code: `import { TransactionNotifierProvider } from "./components/TransactionNotifier";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TransactionNotifierProvider>
          <main>
            {children}
          </main>
        </TransactionNotifierProvider>
      </body>
    </html>
  );
}
`,
  },
];

// Props data for TransactionStatusNotifier
const propsData = [
  {
    name: 'showNotifier',
    type: 'function',
    description: 'Shows a transaction notification with specified message, type, position, and optional transaction hash.',
  },
  {
    name: 'showTxStatus',
    type: 'function',
    description: 'Convenience method specifically for transaction status notifications with predefined messages.',
  },
  {
    name: 'message',
    type: 'string',
    description: 'The text message to display in the notification.',
  },
  {
    name: 'type',
    type: 'string',
    description: '"submitting" | "processing" | "completed" | "failed" | "success" | "error" | "warning" | "info"',
  },
  {
    name: 'position',
    type: 'string',
    description: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"',
  },
  {
    name: 'txHash',
    type: 'string',
    description: 'Optional transaction hash that adds a link to Sui Explorer and ensures status updates replace previous ones.',
  },
  {
    name: 'setDarkModeExplicitly',
    type: 'function',
    description: 'Function to sync theme mode with other components in your application.',
  },
];

function NotifierPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { showTxStatus, setDarkModeExplicitly } = useTransactionNotifier();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Sync with the TransactionNotifier component
    setDarkModeExplicitly(newDarkMode);
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

  // Mock transaction hash for demonstration
  const mockTxHash1 = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const mockTxHash2 = '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba';

  // Simulate successful Sui transaction
  const simulateSuccessTransaction = async () => {
    // 1. Submission step
    showTxStatus('submitting', 'Transaction submitted to network...', mockTxHash1);
    
    // 2. Processing step
    setTimeout(() => {
      showTxStatus('processing', 'Transaction is being processed...', mockTxHash1);
      
      // 3. Complete step
      setTimeout(() => {
        showTxStatus('completed', 'Transaction completed successfully!', mockTxHash1);
      }, 3000);
    }, 2000);
  };

  // Simulate failed Sui transaction
  const simulateFailedTransaction = async () => {
    // 1. Submission step
    showTxStatus('submitting', 'Transaction submitted to network...', mockTxHash2);
    
    // 2. Processing step
    setTimeout(() => {
      showTxStatus('processing', 'Transaction is being processed...', mockTxHash2);
      
      // 3. Fail step
      setTimeout(() => {
        showTxStatus('failed', 'Transaction failed: insufficient gas to execute', mockTxHash2);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">Transaction Status Notifier</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400 max-w-lg">
          Display Sui blockchain transaction status notifications with theme support. Perfect for showing transaction submission, processing, and completion states.
        </p>
      </div>

      <div className="flex flex-col items-start mt-10">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              Preview
            </button>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                />
              </svg>
              Code
            </button>
          </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <div className="bg-[#0A1428]/80 border rounded-lg border-[#2A3746] w-full h-auto mt-2">
          <div>
            {activeTab === 'Preview' && (
              <div className="p-8 relative bg-[#0A1428] border-[#2A3746] rounded-lg" style={{
                backgroundImage: `linear-gradient(to right, rgba(58, 145, 227, 0.07) 1px, transparent 1px), 
                                  linear-gradient(to bottom, rgba(58, 145, 227, 0.07) 1px, transparent 1px)`,
                backgroundSize: '10px 10px',
              }}>
                <div className={darkMode ? "dark" : ""}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <h3 className="text-sm font-medium mb-2 text-white">Successful Transaction</h3>
                      <button 
                        onClick={simulateSuccessTransaction} 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full"
                      >
                        Simulate Successful Transaction
                      </button>
                      <div className="text-gray-400 text-sm max-w-md text-center">
                        Click to simulate a Sui transaction flow that completes successfully.
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <h3 className="text-sm font-medium mb-2 text-white">Failed Transaction</h3>
                      <button 
                        onClick={simulateFailedTransaction} 
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full"
                      >
                        Simulate Failed Transaction
                      </button>
                      <div className="text-gray-400 text-sm max-w-md text-center">
                        Click to simulate a Sui transaction flow that fails due to insufficient gas.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'Code' && (
              <div>
                <SuiFlowSourceCodeBlock
                  codeString={sourcecode}
                  language="javascript"
                />
              </div>
            )}
          </div>
        </div>

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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            Installation
          </div>
        </div>

        <div>
          <div className="absolute sm:ml-3">
            <pre className="bg-[#0A1428] p-3 rounded-md overflow-auto text-sm sm:text-base w-[350px] sm:w-[600px] border border-[#2A3746]">
              <code className="text-zinc-300">
                npx @suiflow-ui@latest add transaction-status-notifier
              </code>
            </pre>
            <button
              onClick={() =>
                copyToClipboard('npx @suiflow-ui@latest add transaction-status-notifier', 1)
              }
              className="absolute right-0 top-2 p-2 w-10 h-auto bg-[#0A1428] rounded border-r border-[#2A3746]"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </motion.svg>
              ) : (
                <span className="relative -top-1 -left-1">
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 6.75H7.75C6.64543 6.75 5.75 7.64543 5.75 8.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V8.75C18.25 7.64543 17.3546 6.75 16.25 6.75H15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                    <path d="M14 8.25H10C9.44772 8.25 9 7.80228 9 7.25V5.75C9 5.19772 9.44772 4.75 10 4.75H14C14.5523 4.75 15 5.19772 15 5.75V7.25C15 7.80228 14.5523 8.25 14 8.25Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                    <path d="M9.75 12.25H14.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                    <path d="M9.75 15.25H14.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                  </svg>
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center mt-28 py-3 sm:pl-4 text-xl font-semibold">
            <div className="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-[#6FBCF0]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                />
              </svg>
            </div>
            Usage
          </div>
        </div>

        <SuiFlowExampleBlock files={example} />

        <div className="container mx-auto p-1 sm:p-4 mt-20">
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 text-[#6FBCF0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <h1 className="text-xl font-semibold ml-2">Props</h1>
          </div>
          <PropsTable propsData={propsData} />
        </div>
      </div>
    </div>
  )
}

export default NotifierPage;
