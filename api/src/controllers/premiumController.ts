import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Country-based pricing
const COUNTRY_PRICING = {
  // Asia
  'Japan': { currency: 'JPY', symbol: '¥', monthly: 1500, yearly: 15000 },
  'South Korea': { currency: 'KRW', symbol: '₩', monthly: 13000, yearly: 130000 },
  'China': { currency: 'CNY', symbol: '¥', monthly: 70, yearly: 700 },
  'India': { currency: 'INR', symbol: '₹', monthly: 800, yearly: 8000 },
  'Thailand': { currency: 'THB', symbol: '฿', monthly: 350, yearly: 3500 },
  'Vietnam': { currency: 'VND', symbol: '₫', monthly: 250000, yearly: 2500000 },
  'Singapore': { currency: 'SGD', symbol: 'S$', monthly: 15, yearly: 150 },
  'Malaysia': { currency: 'MYR', symbol: 'RM', monthly: 45, yearly: 450 },
  'Philippines': { currency: 'PHP', symbol: '₱', monthly: 600, yearly: 6000 },
  'Indonesia': { currency: 'IDR', symbol: 'Rp', monthly: 160000, yearly: 1600000 },
  
  // North America
  'USA': { currency: 'USD', symbol: '$', monthly: 10, yearly: 100 },
  'Canada': { currency: 'CAD', symbol: 'C$', monthly: 13, yearly: 130 },
  'Mexico': { currency: 'MXN', symbol: 'Mex$', monthly: 200, yearly: 2000 },
  
  // Europe
  'UK': { currency: 'GBP', symbol: '£', monthly: 8, yearly: 80 },
  'Germany': { currency: 'EUR', symbol: '€', monthly: 9, yearly: 90 },
  'France': { currency: 'EUR', symbol: '€', monthly: 9, yearly: 90 },
  'Italy': { currency: 'EUR', symbol: '€', monthly: 9, yearly: 90 },
  'Spain': { currency: 'EUR', symbol: '€', monthly: 9, yearly: 90 },
  'Netherlands': { currency: 'EUR', symbol: '€', monthly: 9, yearly: 90 },
  'Switzerland': { currency: 'CHF', symbol: 'Fr', monthly: 10, yearly: 100 },
  'Sweden': { currency: 'SEK', symbol: 'kr', monthly: 100, yearly: 1000 },
  'Norway': { currency: 'NOK', symbol: 'kr', monthly: 100, yearly: 1000 },
  'Denmark': { currency: 'DKK', symbol: 'kr', monthly: 70, yearly: 700 },
  'Poland': { currency: 'PLN', symbol: 'zł', monthly: 40, yearly: 400 },
  'Turkey': { currency: 'TRY', symbol: '₺', monthly: 300, yearly: 3000 },
  
  // Oceania
  'Australia': { currency: 'AUD', symbol: 'A$', monthly: 15, yearly: 150 },
  'New Zealand': { currency: 'NZD', symbol: 'NZ$', monthly: 16, yearly: 160 },
  
  // South America
  'Brazil': { currency: 'BRL', symbol: 'R$', monthly: 50, yearly: 500 },
  'Argentina': { currency: 'ARS', symbol: '$', monthly: 3000, yearly: 30000 },
  'Chile': { currency: 'CLP', symbol: '$', monthly: 8000, yearly: 80000 },
  'Colombia': { currency: 'COP', symbol: '$', monthly: 40000, yearly: 400000 },
  'Peru': { currency: 'PEN', symbol: 'S/', monthly: 35, yearly: 350 },
  
  // Africa
  'South Africa': { currency: 'ZAR', symbol: 'R', monthly: 180, yearly: 1800 },
  'Nigeria': { currency: 'NGN', symbol: '₦', monthly: 4000, yearly: 40000 },
  'Egypt': { currency: 'EGP', symbol: '£', monthly: 150, yearly: 1500 },
  'Kenya': { currency: 'KES', symbol: 'KSh', monthly: 1300, yearly: 13000 },
  'Morocco': { currency: 'MAD', symbol: 'DH', monthly: 100, yearly: 1000 },
  
  // Middle East
  'UAE': { currency: 'AED', symbol: 'د.إ', monthly: 35, yearly: 350 },
  'Saudi Arabia': { currency: 'SAR', symbol: '﷼', monthly: 35, yearly: 350 },
  'Israel': { currency: 'ILS', symbol: '₪', monthly: 35, yearly: 350 },
  
  // Default
  'default': { currency: 'USD', symbol: '$', monthly: 10, yearly: 100 },
};

// Detect country from IP or use default
const detectCountry = async (ip: string): Promise<string> => {
  try {
    // You can use a geolocation service here
    // For now, return default
    return 'default';
  } catch (error) {
    return 'default';
  }
};

// Get pricing for a country
const getPricingForCountry = (country: string) => {
  return COUNTRY_PRICING[country as keyof typeof COUNTRY_PRICING] || COUNTRY_PRICING.default;
};

// Get premium plans with country pricing
export const getPlans = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    let country = 'default';
    
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { country: true },
      });
      if (user?.country) {
        country = user.country;
      }
    }

    const pricing = getPricingForCountry(country);
    
    const plans = {
      monthly: {
        id: 'monthly',
        name: 'Monthly Premium',
        price: pricing.monthly,
        currency: pricing.currency,
        symbol: pricing.symbol,
        interval: 'month',
        country: country,
        features: [
          'Unlimited posts',
          'Ad-free experience',
          'Priority support',
          'Advanced analytics',
          'Custom profile badge',
          'Early access to features',
          '🌐 Unlimited AI Translations',
        ],
      },
      yearly: {
        id: 'yearly',
        name: 'Yearly Premium',
        price: pricing.yearly,
        currency: pricing.currency,
        symbol: pricing.symbol,
        interval: 'year',
        country: country,
        features: [
          'Everything in Monthly',
          '2 months free',
          'Exclusive content access',
          'Featured profile',
          'Premium support',
          '🌐 Unlimited AI Translations',
        ],
      },
    };

    res.json({
      plans,
      country,
      pricing,
    });
  } catch (error) {
    console.error('❌ Get plans error:', error);
    res.status(500).json({ message: 'Failed to get premium plans' });
  }
};

// Check user premium status
export const checkPremiumStatus = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isPremium: true,
        premiumSince: true,
        premiumExpiresAt: true,
        country: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      isPremium: user.isPremium || false,
      premiumSince: user.premiumSince,
      premiumExpiresAt: user.premiumExpiresAt,
      country: user.country || 'default',
    });
  } catch (error) {
    console.error('❌ Check premium status error:', error);
    res.status(500).json({ message: 'Failed to check premium status' });
  }
};

// Create subscription
export const createSubscription = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { country: true, name: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const country = user.country || 'default';
    const pricing = getPricingForCountry(country);
    const price = planId === 'monthly' ? pricing.monthly : pricing.yearly;
    const planName = planId === 'monthly' ? 'Monthly Premium' : 'Yearly Premium';
    const interval = planId === 'monthly' ? 'month' : 'year';

    const now = new Date();
    const expiresAt = new Date(now);
    if (interval === 'month') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Update user premium status
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumSince: now,
        premiumExpiresAt: expiresAt,
      },
    });

    res.json({
      success: true,
      message: `Successfully subscribed to ${planName}`,
      user: {
        isPremium: true,
        premiumSince: now,
        premiumExpiresAt: expiresAt,
        country: country,
      },
      plan: {
        id: planId,
        name: planName,
        price: price,
        currency: pricing.currency,
        symbol: pricing.symbol,
        interval: interval,
      },
    });
  } catch (error) {
    console.error('❌ Create subscription error:', error);
    res.status(500).json({ message: 'Failed to create subscription' });
  }
};

// Cancel subscription
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: false,
        premiumExpiresAt: null,
      },
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('❌ Cancel subscription error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
};
