'use client';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import CustomTheme from '@/app/themes/customTheme';
import CopyButton from './Copy';

interface CodeBlockProps {
  codeString: string;
  language?: 'javascript' | 'xml'; 
}

const SuiFlowSourceCodeBlock: React.FC<CodeBlockProps> = ({ codeString, language = 'javascript' }) => {
  const handleCopyCode = () => {
    const el = document.createElement('textarea');
    el.value = codeString.trim();
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <div className="overflow-y-auto max-h-600px w-full max-w-[63rem] max-h-[600px] rounded-lg relative border border-[#2A3746] bg-[#0A1428]/90">
      <button
        className="absolute top-2 right-2 px-3 py-1 text-[#6FBCF0] hover:text-white transition-colors duration-200"
        onClick={handleCopyCode}
      >
        <CopyButton />
      </button>
      <SyntaxHighlighter
        language={language}
        style={CustomTheme}
        customStyle={{ 
          padding: '1rem',
          background: '#0A1428', 
          borderRadius: '0.375rem',
        }}
      >
        {codeString.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

export default SuiFlowSourceCodeBlock;
