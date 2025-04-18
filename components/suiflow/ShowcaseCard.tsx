'use client'
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface Project {
  imageUrl: StaticImageData;
  projectUrl: string;
  title: string;
  description: string;
}

interface ShowcaseCardProps {
  ShowcaseCardContent: Project[];
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ ShowcaseCardContent }) => {
  return (
    <div className={`${inter.className} grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 sm:p-5 max-w-screen-xl mx-auto`}>
      {ShowcaseCardContent.map((project, index) => (
        <IndividualShowcaseCard key={index} project={project} />
      ))}
    </div>
  );
};

interface IndividualShowcaseCardProps {
  project: Project;
}

const IndividualShowcaseCard: React.FC<IndividualShowcaseCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const lightSize = 80;

  const lightX = useTransform(x, (value) => value - lightSize / 2);
  const lightY = useTransform(y, (value) => value - lightSize / 2);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <motion.div
      className="relative bg-[#0A1428]/60 border border-[#2A3746]/60 rounded-xl overflow-hidden backdrop-filter backdrop-blur-lg shadow-lg hover:shadow-[#3890E3]/10 transition-all duration-300"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {isHovered && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: lightSize,
            height: lightSize,
            background: 'rgba(56, 144, 227, 0.2)',
            filter: 'blur(30px)',
            x: lightX,
            y: lightY,
          }}
        ></motion.div>
      )}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="p-3">
          <div className="relative h-52 overflow-hidden rounded-xl">
            <Image 
              src={project.imageUrl} 
              alt="Project Thumbnail" 
              layout="fill"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-xl object-cover transition-transform duration-500 hover:scale-105"
              rel="preload"
            />
          </div>
        </div>
        <div className="p-4 flex flex-col backdrop-filter backdrop-blur-lg rounded-b-xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-[#3890E3]/90">{project.title}</h2>
            <Link prefetch href={project.projectUrl}>
              <div className="bg-[#0A1428]/80 hover:bg-[#3890E3]/20 rounded-md p-1.5 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#3890E3]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
            </Link>
          </div>
          <div className='mt-1'>
            <p className="text-gray-300 text-sm mb-3">{project.description}</p>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
};

export default ShowcaseCard;
