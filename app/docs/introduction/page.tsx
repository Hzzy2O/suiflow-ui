import React from 'react';
import { Inter } from 'next/font/google';
// import Spline from '@splinetool/react-spline';
import IntroCards from '@/components/suiflow/IntroCards';


const inter = Inter({ subsets: ['latin'], weight: '500' });

const cardData = [
  {
    title: 'What is SuiFlow UI?',
    description: 'SuiFlow UI is a specialized component library for the Sui blockchain, built with Next.js, Tailwind CSS, TypeScript, and Framer Motion. It offers reusable Web3 components.',
  },
  {
    title: 'How to use SuiFlow UI?',
    description: 'You can easily integrate components using the planned CLI tool or by directly copying the component code into your Sui project.',
  },
  {
    title: 'Is SuiFlow UI free?',
    description: "Yes! SuiFlow UI is open-source and free for personal and commercial use. Share your creations with the community!",
  }
];

function Introduction() {
  return (
    <div className={`${inter.className} text-white backdrop-blur-lg bg-gradient-to-br from-[#091428] to-black/95 w-full h-full pt-28 overflow-auto p-3 relative`}>
      <div className="relative w-full h-full">
        {/* Spline component */}
        <div className="absolute inset-0 z-10">
          {/* <Spline scene="https://prod.spline.design/jkiOe6OSWymmKUMb/scene.splinecode" /> */}
        </div>

        <div className="relative z-20 flex flex-col justify-between items-center max-w-3xl w-full mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#6FBCF0]">
              Introduction
            </h1>
          </div>
          
          {/* Content Section */}
          <div className="w-full p-6 lg:px-4 lg:py-6 lg:mt-0">
            <IntroCards cards={cardData}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Introduction;
