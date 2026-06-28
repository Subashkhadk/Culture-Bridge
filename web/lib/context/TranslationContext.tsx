'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface TranslationContextType {
  translateText: (text: string, targetLang: string) => Promise<string>;
  isTranslating: boolean;
  supportedLanguages: { code: string; name: string }[];
  remainingTranslations: number | null;
  isPremium: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const supportedLanguages = [
  { code: 'ja', name: 'Japanese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [remainingTranslations, setRemainingTranslations] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const { token, user } = useAuth();

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (!text || !targetLang) return text;

    if (!user) {
      throw new Error('Please login to use translation');
    }

    setIsTranslating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const url = `${apiUrl}/translate/translate`;
      
      console.log('📤 Translation request:', { url, text, targetLang });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
          sourceLanguage: 'en',
        }),
      });

      console.log('📥 Translation response status:', response.status);

      // Try to parse the response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        // Check if it's a premium limit error
        if (data.requiresPremium) {
          throw new Error(data.message || 'Premium required for more translations');
        }
        throw new Error(data.message || `Translation failed (${response.status})`);
      }

      // Update remaining translations
      if (data.remaining !== undefined) {
        setRemainingTranslations(data.remaining);
      }
      if (data.isPremium !== undefined) {
        setIsPremium(data.isPremium);
      }
      
      console.log('✅ Translation success:', data);
      
      return data.translatedText || text;
    } catch (error: any) {
      console.error('❌ Translation error:', error);
      // Re-throw the error so the component can handle it
      throw error;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        translateText,
        isTranslating,
        supportedLanguages,
        remainingTranslations,
        isPremium,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
