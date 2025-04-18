import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TbBrandNextjs } from 'react-icons/tb';
import { SiReact } from 'react-icons/si';
import { BiLogoTailwindCss } from 'react-icons/bi';
import { BiLogoTypescript } from 'react-icons/bi';
import { TbBrandFramerMotion } from 'react-icons/tb';
import Link from 'next/link';
import { Inter } from 'next/font/google';

// Sui Icon component
const SuiIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="currentColor"
      d="M16.129 10.508a5.44 5.44 0 0 1 1.148 3.356a5.47 5.47 0 0 1-1.18 3.399l-.064.079l-.015-.106a5 5 0 0 0-.053-.26c-.37-1.656-1.567-3.08-3.547-4.234c-1.334-.773-2.102-1.705-2.303-2.763a4.1 4.1 0 0 1 .159-1.97c.15-.494.385-.96.694-1.376l.773-.963a.333.333 0 0 1 .518 0zm1.217-.963L12.19 3.092a.243.243 0 0 0-.38 0L6.652 9.55l-.016.016a7.1 7.1 0 0 0-1.519 4.404C5.118 17.85 8.2 21 12 21s6.881-3.15 6.881-7.03a7.1 7.1 0 0 0-1.519-4.404zm-9.46.942l.461-.577l.016.106l.037.254c.302 1.604 1.366 2.938 3.15 3.97c1.55.905 2.45 1.943 2.71 3.081c.106.476.127.942.08 1.35v.026l-.022.01c-.72.36-1.513.547-2.318.546c-2.912 0-5.278-2.414-5.278-5.389c0-1.275.434-2.45 1.165-3.377"
    />
  </svg>
);

const techItems = [
  { href: 'https://nextjs.org/', label: 'Next.js', icon: TbBrandNextjs },
  { href: 'https://react.dev/', label: 'React', icon: SiReact },
  { href: 'https://tailwindcss.com/', label: 'Tailwind', icon: BiLogoTailwindCss },
  { href: 'https://www.typescriptlang.org/', label: 'TypeScript', icon: BiLogoTypescript },
  { href: 'https://www.framer.com/motion/', label: 'Framer Motion', icon: TbBrandFramerMotion },
  { href: 'https://docs.sui.io/guides/developer/programming-with-objects/sdk', label: 'Sui SDK', icon: SuiIcon },
];



const inter = Inter({ subsets: ['latin'], weight: ['500'] });

const TechUsed = () => {

  const [iconSize, setIconSize] = useState(30);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIconSize(20);
      } else {
        setIconSize(30);
      }
    };


    handleResize();


    window.addEventListener('resize', handleResize);


    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`${inter.className} flex justify-center items-center`}>
      <motion.div
        className="flex text-sm justify-center items-center gap-8 flex-wrap"
        initial="visible"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,

          },
        }}
      >
        {techItems.map(({ href, label, icon: Icon }) => (
          <div
            key={label}
            className="relative"
          >
            <Link href={href} target="_blank" className="text-[#E5E7EB] flex items-center hover:text-[#3890E3] transition-colors duration-300">
              <Icon size={iconSize} className="transition-colors duration-300" />
              <motion.span
                className="ml-2 font-medium"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {label}
              </motion.span>
            </Link>
            <motion.div
              className="absolute -top-1 -right-2 w-1 h-1 bg-[#3890E3] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 1, 0],
                transition: { duration: 1.5, repeat: Infinity },
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechUsed;
