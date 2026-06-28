'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/context/TranslationContext';
import { useAuth } from '@/lib/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface TranslationButtonProps {
  text: string;
  className?: string;
}

export default function TranslationButton({ text, className = '' }: TranslationButtonProps) {
  const { translateText, isTranslating, supportedLanguages } = useTranslation();
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState('ja');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresPremium, setRequiresPremium] = useState(false);

  const handleTranslate = async () => {
    if (!user) {
      setError('Please login to use translation');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (showTranslation) {
      setShowTranslation(false);
      setTranslatedText(null);
      setError(null);
      setRequiresPremium(false);
      return;
    }

    setError(null);
    setRequiresPremium(false);
    
    try {
      const result = await translateText(text, selectedLang);
      
      if (result === text) {
        setError('Translation failed. Please try again.');
        setTimeout(() => setError(null), 3000);
      } else {
        setTranslatedText(result);
        setShowTranslation(true);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Translation failed';
      if (errorMsg.includes('Premium') || errorMsg.includes('premium')) {
        setRequiresPremium(true);
        setError('You have reached your daily translation limit. Upgrade to Premium for unlimited translations!');
      } else {
        setError(errorMsg);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        className="px-2 py-1 text-xs sm:text-sm border border-outline-variant rounded-lg bg-surface-container-low text-on-surface focus:ring-primary focus:border-primary outline-none"
        disabled={isTranslating}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <button
        onClick={handleTranslate}
        disabled={isTranslating}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
          showTranslation
            ? 'bg-primary text-on-primary hover:opacity-90'
            : 'bg-primary-container text-on-primary-container hover:opacity-80'
        } disabled:opacity-50`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isTranslating ? 'progress_activity' : showTranslation ? 'close' : 'auto_fix_high'}
        </span>
        {isTranslating ? 'Translating...' : showTranslation ? 'Hide' : 'Translate'}
      </button>

      {error && (
        <div className="w-full">
          {requiresPremium ? (
            <div className="mt-1 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">{error}</p>
              <Link href="/premium">
                <button className="mt-2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
                  Upgrade to Premium
                </button>
              </Link>
            </div>
          ) : (
            <p className="text-xs text-error mt-1">{error}</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {showTranslation && translatedText && !requiresPremium && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full mt-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant"
          >
            <p className="text-xs text-on-surface-variant mb-1">Translated:</p>
            <p className="text-sm text-on-surface">{translatedText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
