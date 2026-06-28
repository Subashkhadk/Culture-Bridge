'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ja' | 'es' | 'fr' | 'zh' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.qa": "Q&A",
    "nav.events": "Events",
    "nav.login": "Sign In",
    "nav.register": "Sign Up",
    "nav.logout": "Logout",
    "nav.newPost": "+ New Post",
    "app.name": "Culture Bridge",
    "hero.title": "Connecting Worlds, Sharing Cultures",
    "feed.title": "📚 Culture Feed",
  },
  ja: {
    "nav.home": "ホーム",
    "nav.explore": "探検",
    "nav.qa": "Q&A",
    "nav.events": "イベント",
    "nav.login": "ログイン",
    "nav.register": "登録",
    "nav.logout": "ログアウト",
    "nav.newPost": "+ 新規投稿",
    "app.name": "Culture Bridge",
    "hero.title": "世界をつなぐ、文化を共有する",
    "feed.title": "📚 カルチャーフィード",
  },
  es: {
    "nav.home": "Inicio",
    "nav.explore": "Explorar",
    "nav.qa": "Preguntas",
    "nav.events": "Eventos",
    "nav.login": "Iniciar Sesión",
    "nav.register": "Registrarse",
    "nav.logout": "Cerrar Sesión",
    "nav.newPost": "+ Nueva Publicación",
    "app.name": "Culture Bridge",
    "hero.title": "Conectando Mundos, Compartiendo Culturas",
    "feed.title": "📚 Feed Cultural",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.explore": "Explorer",
    "nav.qa": "Q&R",
    "nav.events": "Événements",
    "nav.login": "Se connecter",
    "nav.register": "S'inscrire",
    "nav.logout": "Se déconnecter",
    "nav.newPost": "+ Nouvelle publication",
    "app.name": "Culture Bridge",
    "hero.title": "Connecter les mondes, partager les cultures",
    "feed.title": "📚 Flux culturel",
  },
  zh: {
    "nav.home": "首页",
    "nav.explore": "探索",
    "nav.qa": "问答",
    "nav.events": "活动",
    "nav.login": "登录",
    "nav.register": "注册",
    "nav.logout": "退出",
    "nav.newPost": "+ 新帖子",
    "app.name": "Culture Bridge",
    "hero.title": "连接世界，分享文化",
    "feed.title": "📚 文化动态",
  },
  ko: {
    "nav.home": "홈",
    "nav.explore": "탐험",
    "nav.qa": "Q&A",
    "nav.events": "이벤트",
    "nav.login": "로그인",
    "nav.register": "등록",
    "nav.logout": "로그아웃",
    "nav.newPost": "+ 새 게시물",
    "app.name": "Culture Bridge",
    "hero.title": "세계를 연결하고 문화를 공유하다",
    "feed.title": "📚 문화 피드",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && translations[saved]) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
