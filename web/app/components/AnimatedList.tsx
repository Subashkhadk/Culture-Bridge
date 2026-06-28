'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
}

export default function AnimatedList({ children, className = '' }: AnimatedListProps) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              type: 'spring',
              stiffness: 100
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
