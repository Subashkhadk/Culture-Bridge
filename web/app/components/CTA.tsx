'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-2xl relative overflow-hidden bg-primary overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="container max-w-[1280px] mx-auto px-gutter relative z-10 text-center text-on-primary">
        <motion.h2 
          className="text-display-lg font-display-lg mb-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ready to build your bridge?
        </motion.h2>
        <motion.p 
          className="text-body-lg font-body-lg mb-xl max-w-2xl mx-auto opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join 5 million+ members sharing their heritage and learning from one another in the digital global commons.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-md justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/register">
            <button className="bg-white text-primary px-2xl py-md rounded-full font-bold hover:bg-surface transition-all active:scale-95 shadow-lg">
              Sign Up for Free
            </button>
          </Link>
          <Link href="/explore">
            <button className="bg-primary-container/30 backdrop-blur-md text-white border border-white/20 px-2xl py-md rounded-full font-bold hover:bg-primary-container/50 transition-all active:scale-95">
              Explore Guest Access
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
