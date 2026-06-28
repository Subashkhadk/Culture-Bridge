import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create an ad
export const createAd = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { title, content, imageUrl, linkUrl } = req.body;

    if (!title || !linkUrl) {
      return res.status(400).json({ message: 'Title and link URL are required' });
    }

    // Return mock response for now
    res.status(201).json({
      message: 'Ad created successfully',
      ad: {
        id: 'mock-ad-id',
        title,
        content: content || '',
        imageUrl,
        linkUrl,
        advertiserId: userId,
        isActive: true,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('❌ Create ad error:', error);
    res.status(500).json({ message: 'Failed to create ad' });
  }
};

// Get active ads
export const getActiveAds = async (req: Request, res: Response) => {
  try {
    // Return mock ads
    res.json([
      {
        id: 'mock-1',
        title: 'Learn Japanese Culture',
        content: 'Join our cultural exchange program',
        imageUrl: 'https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=Culture+Bridge+Ad',
        linkUrl: 'https://example.com',
        clicks: 0,
        impressions: 0,
        isActive: true,
      },
      {
        id: 'mock-2',
        title: 'Explore World Festivals',
        content: 'Discover festivals around the world',
        imageUrl: 'https://via.placeholder.com/400x200/EC4899/FFFFFF?text=Festival+Ad',
        linkUrl: 'https://example.com',
        clicks: 0,
        impressions: 0,
        isActive: true,
      },
    ]);
  } catch (error) {
    console.error('❌ Get active ads error:', error);
    res.json([]);
  }
};

// Track ad click
export const trackAdClick = async (req: Request, res: Response) => {
  try {
    res.json({ 
      message: 'Ad click tracked',
      linkUrl: 'https://example.com',
    });
  } catch (error) {
    console.error('❌ Track ad click error:', error);
    res.status(500).json({ message: 'Failed to track ad click' });
  }
};

// Get advertiser's ads
export const getMyAds = async (req: Request, res: Response) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('❌ Get my ads error:', error);
    res.status(500).json({ message: 'Failed to get ads' });
  }
};
