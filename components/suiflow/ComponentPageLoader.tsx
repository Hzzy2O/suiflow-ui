import React from "react";
import { motion } from "framer-motion";

const ComponentPageLoader = () => {
  return (
    <div className="w-44 h-44 md:w-80 md:h-80 items-center justify-center text-white flex bg-gradient-to-br from-[#3890E3] to-[#40BFCF] rounded-2xl shadow-lg relative">
      <motion.div
        className="absolute w-[60%] h-[60%] rounded-xl"
        initial={{ opacity: 0.3, scale: 0.6 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut" 
        }}
      />
      <motion.div
        className="absolute w-[60%] h-[60%] rounded-xl"
        initial={{ opacity: 0.1, scale: 0.6 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1 
        }}
      />
    </div>
  );
};

export default ComponentPageLoader; 
