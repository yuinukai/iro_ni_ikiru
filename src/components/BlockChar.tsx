'use client';

import { motion } from 'framer-motion';

interface BlockCharProps {
  char: string;
  color: string;
  darkColor: string;
  mediumColor: string;
  lightColor: string;
  transform?: string;
}

export default function BlockChar({ char, color, darkColor, mediumColor, lightColor, transform = 'rotateY(0deg) rotateX(0deg)' }: BlockCharProps) {
  return (
    <motion.div
      className="relative inline-block"
      style={{
        transform,
        transformStyle: 'preserve-3d'
      }}
      whileHover={{ 
        rotateY: Math.random() * 30 - 15, 
        rotateX: Math.random() * 30 - 15,
        scale: 1.15
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* 前面 - 最も明るい */}
      <span style={{
        position: 'relative',
        zIndex: 15,
        color: color,
        fontWeight: 900,
        WebkitTextStroke: `2px ${lightColor}`
      }}>{char}</span>
      
      {/* 右側面 */}
      <span 
        className="absolute top-0"
        style={{
          left: 'clamp(4px, 1.5vw, 8px)',
          zIndex: 12,
          color: lightColor,
          fontWeight: 900,
          opacity: 0.9,
          WebkitTextStroke: `clamp(1px, 0.5vw, 2px) ${mediumColor}`
        }}>{char}</span>
      
      {/* 下側面 */}
      <span 
        className="absolute left-0"
        style={{
          top: 'clamp(4px, 1.5vw, 8px)',
          zIndex: 13,
          color: mediumColor,
          fontWeight: 900,
          opacity: 0.8,
          WebkitTextStroke: `clamp(1px, 0.5vw, 2px) ${darkColor}`
        }}>{char}</span>
      
      {/* 右下角 */}
      <span 
        className="absolute"
        style={{
          top: 'clamp(4px, 1.5vw, 8px)',
          left: 'clamp(4px, 1.5vw, 8px)',
          zIndex: 10,
          color: darkColor,
          fontWeight: 900,
          opacity: 0.7
        }}>{char}</span>
      
      {/* 奥行き層1 */}
      <span 
        className="absolute"
        style={{
          top: 'clamp(8px, 3vw, 16px)',
          left: 'clamp(8px, 3vw, 16px)',
          zIndex: 8,
          color: darkColor,
          fontWeight: 900,
          opacity: 0.5
        }}>{char}</span>
      
      {/* 奥行き層2 */}
      <span 
        className="absolute"
        style={{
          top: 'clamp(12px, 4.5vw, 24px)',
          left: 'clamp(12px, 4.5vw, 24px)',
          zIndex: 6,
          color: darkColor,
          fontWeight: 900,
          opacity: 0.3
        }}>{char}</span>
      
      {/* 最奥層 */}
      <span 
        className="absolute"
        style={{
          top: 'clamp(16px, 6vw, 32px)',
          left: 'clamp(16px, 6vw, 32px)',
          zIndex: 4,
          color: darkColor,
          fontWeight: 900,
          opacity: 0.15
        }}>{char}</span>
    </motion.div>
  );
}