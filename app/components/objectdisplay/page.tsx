'use client';
import React, { useState } from 'react';
import SuiFlowSourceCodeBlock from '@/components/suiflow/SuiFlowSourceCodeBlock';
import SuiFlowExampleBlock from '@/components/suiflow/SuiFlowExampleBlock';
import PropsTable from '@/components/suiflow/Table';
import { motion, AnimatePresence } from 'framer-motion';
import { ObjectDisplay } from '.';
import { createNetworkConfig, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

// Create a client
const queryClient = new QueryClient();

export default function ObjectDisplayPage() {
  const [activeTab, setActiveTab] = useState('Preview');
  const [darkMode, setDarkMode] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [objectId, setObjectId] = useState("0x0000000000000000000000000000000000000000000000000000000000000006");

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

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

  // Source code for the component
  const sourceCode = `import React, { useState } from 'react';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ExternalLink, Copy } from 'lucide-react';

export interface ObjectDisplayProps {
  // Sui object properties
  objectId: string;
  
  // Display options
  variant?: 'default' | 'compact' | 'detailed';
  showExplorerLink?: boolean;
  showCopyButton?: boolean;
  showObjectType?: boolean;
  showPackage?: boolean;
  showModuleName?: boolean;
  showProperties?: boolean;
  maxProperties?: number;
  explorerUrl?: string;
  network?: 'mainnet' | 'testnet' | 'devnet';
  
  // State and error handling
  loadingPlaceholder?: React.ReactNode;
  errorPlaceholder?: React.ReactNode;
  
  // Interaction properties
  onClick?: () => void;
  className?: string;
  
  // Style properties
  size?: 'sm' | 'md' | 'lg';
}

const ObjectDisplay: React.FC<ObjectDisplayProps> = ({
  objectId,
  variant = 'default',
  showExplorerLink = true,
  // ...other props
}) => {
  // Component implementation
  // ...
  
  return (
    <div className="border rounded p-3">
      <div className="font-medium">{displayName}</div>
      <div>{formatAddress(objectId)}</div>
      {/* Show object type, properties, etc. */}
    </div>
  );
};

export default ObjectDisplay;`;

  // Props data for ObjectDisplay
  const propsData = [
    {
      name: 'objectId',
      type: 'string',
      description: 'Sui object ID to display information for',
      required: true,
    },
    {
      name: 'variant',
      type: "'default' | 'compact' | 'detailed'",
      description: 'Visual style of the component',
      defaultValue: 'default',
    },
    {
      name: 'showExplorerLink',
      type: 'boolean',
      description: 'Whether to show a link to explore the object in a block explorer',
      defaultValue: 'true',
    },
    {
      name: 'showCopyButton',
      type: 'boolean',
      description: 'Whether to show a button to copy the object ID',
      defaultValue: 'true',
    },
    {
      name: 'showObjectType',
      type: 'boolean',
      description: 'Whether to show the type of the object',
      defaultValue: 'true',
    },
    {
      name: 'showPackage',
      type: 'boolean',
      description: 'Whether to show the package ID of the object',
      defaultValue: 'false for default/compact, true for detailed',
    },
    {
      name: 'showModuleName',
      type: 'boolean',
      description: 'Whether to show the module name in the type',
      defaultValue: 'false for default/compact, true for detailed',
    },
    {
      name: 'showProperties',
      type: 'boolean',
      description: 'Whether to show the object properties',
      defaultValue: 'false for default/compact, true for detailed',
    },
    {
      name: 'maxProperties',
      type: 'number',
      description: 'Maximum number of properties to show before collapsing',
      defaultValue: '5',
    },
    {
      name: 'explorerUrl',
      type: 'string',
      description: 'Override URL for the block explorer',
    },
    {
      name: 'network',
      type: "'mainnet' | 'testnet' | 'devnet'",
      description: 'Network to use for explorer links',
      defaultValue: 'mainnet',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the component',
      defaultValue: 'md',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Function to call when the component is clicked',
    },
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS class names',
    },
  ];

  const handleObjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectId(e.target.value);
  };

  // Standard Object IDs
  const sampleObjectIds = [
    {
      name: "SUI Token",
      value: "0x0000000000000000000000000000000000000000000000000000000000000006"
    },
    {
      name: "Clock Object",
      value: "0x0000000000000000000000000000000000000000000000000000000000000006"
    },
    {
      name: "Sample Coin",
      value: "0x3c2cf35a0b7e9a6508c5f0f0e9d3bd21864e14597ea3f5e1695688c9030ea4a5"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full pt-24 overflow-auto p-5">
      <span className="text-4xl font-semibold pl-1">ObjectDisplay Component</span>
      <div>
        <p className="sm:text-base mt-4 pl-1 text-gray-400">
          The <code className="bg-gray-800 px-1 py-0.5 rounded">ObjectDisplay</code> component is designed specifically for Sui blockchain objects, providing a user-friendly way to view Sui object information in your application.
          Simply pass an <code className="bg-gray-800 px-1 py-0.5 rounded">objectId</code> to the component, and it will fetch and display the object&apos;s information.
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
            <button
              className={`flex items-center text-white px-3 py-1 rounded-md ${
                activeTab === 'Props'
                  ? 'bg-gradient-to-r from-[#0A1428] to-[#0A2440] text-[#6FBCF0] border-b-2 border-[#3890E3]'
                  : ''
              }`}
              onClick={() => handleTabChange('Props')}
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              Props
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
                <QueryClientProvider client={queryClient}>
                  <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
                    <div className={darkMode ? "dark" : ""}>
                      <div className="mb-6">
                        <div className="mb-3">
                          <label htmlFor="objectId" className="block text-sm font-medium text-gray-300 mb-1">
                            Object ID:
                          </label>
                          <input
                            type="text"
                            id="objectId"
                            value={objectId}
                            onChange={handleObjectIdChange}
                            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
                            placeholder="Enter Sui object ID (0x...)"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sampleObjectIds.map((obj) => (
                            <button
                              key={obj.value}
                              onClick={() => setObjectId(obj.value)}
                              className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                            >
                              {obj.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-white">Default Variant</h3>
                          <ObjectDisplay objectId={objectId} />
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-white">Compact Variant</h3>
                          <ObjectDisplay objectId={objectId} variant="compact" />
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-white">Detailed Variant</h3>
                          <ObjectDisplay objectId={objectId} variant="detailed" />
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Size Variations</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Small</p>
                              <ObjectDisplay objectId={objectId} size="sm" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Medium (default)</p>
                              <ObjectDisplay objectId={objectId} size="md" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Large</p>
                              <ObjectDisplay objectId={objectId} size="lg" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2 text-white">Custom Configuration</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Without explorer and copy buttons</p>
                              <ObjectDisplay 
                                objectId={objectId} 
                                showExplorerLink={false}
                                showCopyButton={false}
                              />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Without type information</p>
                              <ObjectDisplay 
                                objectId={objectId} 
                                showObjectType={false}
                              />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">With properties in default variant</p>
                              <ObjectDisplay 
                                objectId={objectId} 
                                showProperties={true}
                                maxProperties={2}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SuiClientProvider>
                </QueryClientProvider>
              </div>
            )}
            {activeTab === 'Code' && (
              <div>
                <SuiFlowSourceCodeBlock 
                  codeString={sourceCode} 
                  language="javascript" 
                />
              </div>
            )}

            {activeTab === 'Props' && (
              <div className="p-6 bg-[#0A1428] overflow-auto">
                <PropsTable 
                  propsData={propsData} 
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
                  d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                />
              </svg>
            </div>
            Usage Examples
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SuiFlowExampleBlock
            files={[
              {
                title: "Basic Usage",
                code: `<ObjectDisplay objectId="0x1234..." />`
              }
            ]}
          />
          
          <SuiFlowExampleBlock
            files={[
              {
                title: "Detailed View",
                code: `<ObjectDisplay 
  objectId="0x1234..." 
  variant="detailed"
/>`
              }
            ]}
          />
          
          <SuiFlowExampleBlock
            files={[
              {
                title: "Custom Network",
                code: `<ObjectDisplay 
  objectId="0x1234..." 
  network="testnet"
/>`
              }
            ]}
          />
          
          <SuiFlowExampleBlock
            files={[
              {
                title: "With Click Handler",
                code: `<ObjectDisplay 
  objectId="0x1234..." 
  onClick={() => alert('Object clicked!')}
/>`
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
