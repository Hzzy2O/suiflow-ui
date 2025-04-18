'use client'
import React from 'react';
import CodeStepper from '@/components/suiflow/CodeStepper';


function Installation() {

  return (
    <div className={`bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full h-full pt-28 p-5 relative`}>
      <span className={`text-4xl font-extrabold pl-4 bg-gradient-to-r from-white to-[#6FBCF0] bg-clip-text text-transparent`}>Installation</span>
      <div>
        <p className={`sm:text-base max-w-md mt-5 pl-4 text-zinc-400 `}>
          Follow these simple steps to integrate SuiFlow UI into your project.
        </p>
      </div>
      <div className={`mt-10 relative`}>
        <CodeStepper/>
      </div>
    </div>
  );
}

export default Installation;
