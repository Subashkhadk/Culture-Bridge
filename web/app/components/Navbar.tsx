'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import PeopleSearch from './PeopleSearch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !user) {
        console.log('No token or user, skipping fetch');
        return;
      }
      
      try {
        // Fetch user profile for avatar
        const userResponse = await fetch(`${API_URL}/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserAvatar(userData.avatarUrl || null);
        } else {
          console.log('Failed to fetch user data:', userResponse.status);
        }

        // Fetch notifications count
        const notifResponse = await fetch(`${API_URL}/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (notifResponse.ok) {
          const data = await notifResponse.json();
          setUnreadCount(data.unreadCount || 0);
        } else {
          console.log('Failed to fetch notifications:', notifResponse.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user, token]);

  useEffect(() => {
    if (user?.avatarUrl) {
      setUserAvatar(user.avatarUrl);
    }
  }, [user?.avatarUrl]);

  const navLinks = [
    { href: '/', label: t('nav.home') || 'Home' },
    { href: '/explore', label: t('nav.explore') || 'Explore' },
    { href: '/qa', label: t('nav.qa') || 'Q&A' },
    { href: '/events', label: t('nav.events') || 'Events' },
  ];

  const avatarUrl = userAvatar || user?.avatarUrl || null;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) || false;
  };

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors duration-300 border-b border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
          <Link href="/" className="flex flex-col items-start leading-tight group">
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-lg sm:text-xl lg:text-2xl font-bold text-primary tracking-tight whitespace-nowrap">
                {t('app.name') || 'Culture Bridge'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-on-surface-variant/70 font-medium tracking-wider mt-0.5">
              <span>多文化</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span>自分文化知</span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span>🌉</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body-md text-sm lg:text-base transition-colors relative ${
                  isActive(link.href)
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <PeopleSearch />
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-highest transition text-sm font-medium text-on-surface-variant hover:text-primary"
            >
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.name}</span>
              <span className="material-symbols-outlined text-[18px]">
                {isLangOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant overflow-hidden z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLangOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-primary-fixed text-primary font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && (
                        <span className="material-symbols-outlined text-[18px] ml-auto">check</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/notifications" className="relative p-1.5 sm:p-2 text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-error text-on-error text-[10px] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link href="/create-post" className="hidden sm:block px-3 py-1.5 bg-primary text-on-primary rounded-full text-sm font-medium hover:opacity-90 transition">
            {t('nav.newPost') || '+ New Post'}
          </Link>

          {user ? (
            <Link href="/profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary-fixed overflow-hidden">
              {avatarUrl ? (
                <img
                  className="w-full h-full object-cover"
                  src={avatarUrl}
                  alt={user.name || user.username}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm sm:text-base">
                  {user.name?.charAt(0) || user.username?.charAt(0) || '?'}
                </div>
              )}
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:block bg-primary text-on-primary px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-all whitespace-nowrap">
              {t('nav.login') || 'Sign In'}
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-surface border-t border-outline-variant"
          >
            <div className="px-4 py-3 space-y-1.5">
              <div className="mb-2">
                <PeopleSearch />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full px-3 py-2.5 rounded-lg transition-colors text-base ${
                    isActive(link.href)
                      ? 'text-primary font-semibold bg-primary-fixed/20'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/create-post"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full px-3 py-2.5 rounded-lg bg-primary text-on-primary text-center font-semibold text-base"
              >
                {t('nav.newPost') || '+ New Post'}
              </Link>
              {!user ? (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors text-base">
                    {t('nav.login') || 'Sign In'}
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="block w-full px-3 py-2.5 rounded-lg bg-primary text-on-primary text-center font-semibold text-base">
                    {t('nav.register') || 'Sign Up'}
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-base text-left"
                >
                  {t('nav.logout') || 'Logout'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
