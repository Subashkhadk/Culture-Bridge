import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple translation dictionary for demo
const translations: Record<string, Record<string, string>> = {
  ja: {
    'Hello': 'こんにちは',
    'Thank you': 'ありがとう',
    'Welcome': 'ようこそ',
    'Culture': '文化',
    'Bridge': '橋',
    'Explore': '探検する',
    'Share': '共有する',
    'Learn': '学ぶ',
    'Connect': '接続する',
    'Community': 'コミュニティ',
    'Heritage': '遺産',
    'Tradition': '伝統',
    'Festival': '祭り',
    'Food': '食べ物',
    'Language': '言語',
    'History': '歴史',
    'Art': 'アート',
    'Story': '物語',
    'Event': 'イベント',
    'Love': '愛',
    'Peace': '平和',
    'Friendship': '友情',
    'Journey': '旅',
    'Discovery': '発見',
  },
  es: {
    'Hello': 'Hola',
    'Thank you': 'Gracias',
    'Welcome': 'Bienvenido',
    'Culture': 'Cultura',
    'Bridge': 'Puente',
    'Explore': 'Explorar',
    'Share': 'Compartir',
    'Learn': 'Aprender',
    'Connect': 'Conectar',
    'Community': 'Comunidad',
    'Heritage': 'Patrimonio',
    'Tradition': 'Tradición',
    'Festival': 'Festival',
    'Food': 'Comida',
    'Language': 'Idioma',
    'History': 'Historia',
    'Art': 'Arte',
    'Story': 'Historia',
    'Event': 'Evento',
    'Love': 'Amor',
    'Peace': 'Paz',
    'Friendship': 'Amistad',
    'Journey': 'Viaje',
    'Discovery': 'Descubrimiento',
  },
  fr: {
    'Hello': 'Bonjour',
    'Thank you': 'Merci',
    'Welcome': 'Bienvenue',
    'Culture': 'Culture',
    'Bridge': 'Pont',
    'Explore': 'Explorer',
    'Share': 'Partager',
    'Learn': 'Apprendre',
    'Connect': 'Connecter',
    'Community': 'Communauté',
    'Heritage': 'Patrimoine',
    'Tradition': 'Tradition',
    'Festival': 'Festival',
    'Food': 'Nourriture',
    'Language': 'Langue',
    'History': 'Histoire',
    'Art': 'Art',
    'Story': 'Histoire',
    'Event': 'Événement',
    'Love': 'Amour',
    'Peace': 'Paix',
    'Friendship': 'Amitié',
    'Journey': 'Voyage',
    'Discovery': 'Découverte',
  },
  zh: {
    'Hello': '你好',
    'Thank you': '谢谢',
    'Welcome': '欢迎',
    'Culture': '文化',
    'Bridge': '桥',
    'Explore': '探索',
    'Share': '分享',
    'Learn': '学习',
    'Connect': '连接',
    'Community': '社区',
    'Heritage': '遗产',
    'Tradition': '传统',
    'Festival': '节日',
    'Food': '食物',
    'Language': '语言',
    'History': '历史',
    'Art': '艺术',
    'Story': '故事',
    'Event': '活动',
  },
  ko: {
    'Hello': '안녕하세요',
    'Thank you': '감사합니다',
    'Welcome': '환영합니다',
    'Culture': '문화',
    'Bridge': '다리',
    'Explore': '탐험',
    'Share': '공유',
    'Learn': '배우다',
    'Connect': '연결',
    'Community': '커뮤니티',
    'Heritage': '유산',
    'Tradition': '전통',
    'Festival': '축제',
    'Food': '음식',
    'Language': '언어',
    'History': '역사',
    'Art': '예술',
    'Story': '이야기',
    'Event': '이벤트',
  },
};

// Translate text function
const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text) return text;
  
  let translated = text;
  const words = text.split(' ');
  
  for (const word of words) {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (translations[targetLang]?.[cleanWord]) {
      translated = translated.replace(cleanWord, translations[targetLang][cleanWord]);
    }
  }
  
  return translated;
};

// Check if user has translation limit
const checkTranslationLimit = async (userId: string): Promise<{ allowed: boolean; remaining: number }> => {
  // Check if user is premium - for now, return allowed
  // In production, check the database for premium status
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true },
    });

    if (user?.isPremium) {
      return { allowed: true, remaining: -1 };
    }
  } catch (error) {
    console.log('Could not check premium status, allowing translation');
  }

  // Free users: 5 translations per day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const translationCount = await prisma.translation.count({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });

  const maxFreeTranslations = 5;
  const remaining = Math.max(0, maxFreeTranslations - translationCount);
  
  return { 
    allowed: remaining > 0, 
    remaining 
  };
};

// Translate text endpoint
export const translateTextHandler = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - userId is added by auth middleware
    const userId = req.userId;
    const { text, targetLanguage, sourceLanguage } = req.body;

    console.log('📝 Translation request:', { text, targetLanguage, sourceLanguage, userId });

    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        success: false,
        message: 'Text and target language are required' 
      });
    }

    // Check translation limit
    const limitCheck = await checkTranslationLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: `Free users have 5 translations per day. You have ${limitCheck.remaining} remaining. Upgrade to Premium for unlimited translations!`,
        remaining: limitCheck.remaining,
        requiresPremium: true,
      });
    }

    const translatedText = await translateText(text, targetLanguage);

    // Save translation to database
    let translation = null;
    try {
      translation = await prisma.translation.create({
        data: {
          sourceText: text,
          translatedText,
          sourceLanguage: sourceLanguage || 'en',
          targetLanguage,
          userId: userId,
        },
      });
      console.log('✅ Translation saved to database');
    } catch (dbError) {
      console.log('⚠️ Could not save translation to database:', dbError);
    }

    // Get remaining translations for free users
    const updatedLimit = await checkTranslationLimit(userId);

    res.json({
      success: true,
      originalText: text,
      translatedText,
      sourceLanguage: sourceLanguage || 'en',
      targetLanguage,
      translationId: translation?.id || null,
      remaining: updatedLimit.remaining,
      isPremium: updatedLimit.remaining === -1,
    });
  } catch (error) {
    console.error('❌ Translation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to translate text',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
};

// Get translation history
export const getTranslationHistory = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const translations = await prisma.translation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      translations,
    });
  } catch (error) {
    console.error('❌ Get translation history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get translation history' 
    });
  }
};

// Translate post content
export const translatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetLanguage } = req.body;
    // @ts-ignore
    const userId = req.userId;

    if (!targetLanguage) {
      return res.status(400).json({ 
        success: false,
        message: 'Target language is required' 
      });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
      },
    });

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found' 
      });
    }

    const translatedTitle = await translateText(post.title, targetLanguage);
    const translatedContent = await translateText(post.content, targetLanguage);

    res.json({
      success: true,
      title: translatedTitle,
      content: translatedContent,
      targetLanguage,
    });
  } catch (error) {
    console.error('❌ Translate post error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to translate post' 
    });
  }
};
