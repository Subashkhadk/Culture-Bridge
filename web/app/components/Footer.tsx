'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-outline-variant mt-8 sm:mt-12 lg:mt-16">
      <div className="w-full py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-headline-md text-lg sm:text-xl lg:text-2xl text-primary font-bold">🌉 Culture Bridge</span>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-xs">
              Connecting the Global Commons through shared stories and traditions.
            </p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
            <Link href="/preservation" className="text-xs sm:text-sm text-on-surface-variant hover:text-secondary transition-colors">
              Cultural Preservation
            </Link>
            <Link href="/language-exchange" className="text-xs sm:text-sm text-on-surface-variant hover:text-secondary transition-colors">
              Language Exchange
            </Link>
            <Link href="/guidelines" className="text-xs sm:text-sm text-on-surface-variant hover:text-secondary transition-colors">
              Community Guidelines
            </Link>
            <Link href="/support" className="text-xs sm:text-sm text-on-surface-variant hover:text-secondary transition-colors">
              Support
            </Link>
            <Link href="/privacy" className="text-xs sm:text-sm text-on-surface-variant hover:text-secondary transition-colors">
              Privacy
            </Link>
          </nav>
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-on-surface-variant text-center sm:text-left">
            © 2024 Culture Bridge. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="text-outline hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </Link>
            <Link href="#" className="text-outline hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </Link>
            <Link href="#" className="text-outline hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
