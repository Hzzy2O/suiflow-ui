'use client'
import ShowcaseCard from "@/components/suiflow/ShowcaseCard";
import NFTCardThumbnail from '@/app/images/thumbnails/NewsletterThumbnailtest.png';
import ImageGallaryThumbnail from '@/app/images/thumbnails///ImageGallaryThumbnail.png';
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });


const ShowcaseCardContent = [
     {
      title: "NewsLetter Card",
      description: "NewsLetter component designed to display a newsletter subscription form with animation transitions using Framer Motion.",
      imageUrl: NFTCardThumbnail,
      projectUrl: "/components/newsletter"
    },
    {
      title: "Image Gallary",
      description: "Interactive image gallery that displays images in a grid, click on an image to view it in a modal with a smooth transition.",
      imageUrl: ImageGallaryThumbnail,
      projectUrl: "/components/imagegallery"
    },
  ];


function ComponentsPage() {

  return (
   <div className={`${inter.className} bg-gradient-to-br from-[#091428] to-black/95 text-white backdrop-blur-md w-full h-full pt-28 overflow-auto p-5`}>
      <div className='max-w-screen-lg mx-auto'>
        <h1 className={`text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-[#3890E3]`}>Explore Components</h1>
        <p className="text-center text-[#E5E7EB] mt-4 mb-8 max-w-2xl mx-auto">
          Collection of customizable and open source components made with Next.js, Tailwind, TypeScript, and Framer Motion.
        </p>
      </div>
      <div className="mt-8">
        <ShowcaseCard ShowcaseCardContent={ShowcaseCardContent}/>
      </div>
    </div>
  )
}

export default ComponentsPage;
