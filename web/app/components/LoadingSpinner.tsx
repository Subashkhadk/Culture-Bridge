'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const hellos = [
  { lang: 'English', text: 'Hello', flag: '🇺🇸' },
  { lang: 'Japanese', text: 'こんにちは', flag: '🇯🇵' },
  { lang: 'Spanish', text: 'Hola', flag: '🇪🇸' },
  { lang: 'French', text: 'Bonjour', flag: '🇫🇷' },
  { lang: 'German', text: 'Hallo', flag: '🇩🇪' },
  { lang: 'Italian', text: 'Ciao', flag: '🇮🇹' },
  { lang: 'Portuguese', text: 'Olá', flag: '🇵🇹' },
  { lang: 'Russian', text: 'Привет', flag: '🇷🇺' },
  { lang: 'Chinese', text: '你好', flag: '🇨🇳' },
  { lang: 'Korean', text: '안녕하세요', flag: '🇰🇷' },
  { lang: 'Arabic', text: 'مرحبا', flag: '🇸🇦' },
  { lang: 'Hindi', text: 'नमस्ते', flag: '🇮🇳' },
  { lang: 'Turkish', text: 'Merhaba', flag: '🇹🇷' },
  { lang: 'Greek', text: 'Γειά σου', flag: '🇬🇷' },
  { lang: 'Thai', text: 'สวัสดี', flag: '🇹🇭' },
  { lang: 'Vietnamese', text: 'Xin chào', flag: '🇻🇳' },
  { lang: 'Indonesian', text: 'Halo', flag: '🇮🇩' },
  { lang: 'Dutch', text: 'Hallo', flag: '🇳🇱' },
  { lang: 'Swedish', text: 'Hej', flag: '🇸🇪' },
  { lang: 'Polish', text: 'Cześć', flag: '🇵🇱' },
  { lang: 'Hebrew', text: 'שלום', flag: '🇮🇱' },
  { lang: 'Latin', text: 'Salve', flag: '🏛️' },
  { lang: 'Hawaiian', text: 'Aloha', flag: '🌺' },
  { lang: 'Swahili', text: 'Jambo', flag: '🇰🇪' },
];

export default function LoadingSpinner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hellos.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const currentHello = hellos[currentIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-4 border-primary/40"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.div
            className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl mb-1">{currentHello.flag}</div>
                <div className="text-xs font-medium text-on-surface-variant">
                  {currentHello.lang}
                </div>
                <div className="text-lg font-bold text-primary mt-0.5">
                  {currentHello.text}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        <motion.p
          className="text-sm text-on-surface-variant"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Connecting cultures...
        </motion.p>
        <motion.p
          className="text-xs text-on-surface-variant/60"
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {currentIndex + 1} / {hellos.length} languages
        </motion.p>
      </div>
    </div>
  );
}
