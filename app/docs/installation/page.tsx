'use client'
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CodeStepper = dynamic(
  () => import('@/components/suiflow/CodeStepper'),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 space-y-4">
        <div className="h-12 w-48 bg-gray-700/30 rounded animate-pulse"></div>
        <div className="h-28 bg-gray-700/20 rounded-lg animate-pulse"></div>
        <div className="h-28 bg-gray-700/20 rounded-lg animate-pulse"></div>
      </div>
    ),
  }
);

const PageTitle = dynamic(
  () => Promise.resolve(({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={className}>{children}</span>
  )),
  { ssr: true }
);

function Installation() {
  return (
    <div className={`bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full h-full pt-28 p-5 relative`}>
      <Suspense fallback={<div className="h-10 w-48 bg-gray-700/30 rounded animate-pulse"></div>}>
        <PageTitle className={`text-4xl font-extrabold pl-4 bg-gradient-to-r from-white to-[#6FBCF0] bg-clip-text text-transparent`}>
          Installation
        </PageTitle>
      </Suspense>
      
      <div>
        <p className={`sm:text-base max-w-md mt-5 pl-4 text-zinc-400 `}>
          Follow these simple steps to integrate SuiFlow UI into your project.
        </p>
      </div>
      
      <div className={`mt-10 relative`}>
        <Suspense fallback={
          <div className="p-6 space-y-4">
            <div className="h-12 w-48 bg-gray-700/30 rounded animate-pulse"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50 shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-full bg-sky-700/30 animate-pulse"></div>
                    <div className="h-6 w-48 bg-gray-700/30 rounded animate-pulse"></div>
                  </div>
                  <div className="mt-4 h-20 bg-gray-700/20 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        }>
          <CodeStepper/>
        </Suspense>
      </div>
    </div>
  );
}

export default Installation;
