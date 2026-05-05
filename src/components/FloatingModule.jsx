import React from 'react';
import { motion } from 'framer-motion';

const FloatingModule = ({ children, className = '', delay = 0, intensity = 1 }) => {
  return (
    <motion.div
      initial={{ y: 0, rotate: 0, opacity: 0, scale: 0.95 }}
      animate={{ 
        y: [0, -10 * intensity, 0],
        rotate: [0, 0.5 * intensity, 0, -0.5 * intensity, 0],
        opacity: 1,
        scale: 1
      }}
      transition={{
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        },
        rotate: {
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        },
        opacity: { duration: 1 },
        scale: { duration: 0.5 }
      }}
      className={`glass ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 230, 118, 0.2)" }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingModule;
