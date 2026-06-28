import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        coverPhoto: true,
        country: true,
        createdAt: true,
        isPremium: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
            bookmarks: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: id, published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({
      ...user,
      posts,
    });
  } catch (error) {
    console.error('❌ Get user profile error:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { name, bio, avatarUrl, coverPhoto, country } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        avatarUrl,
        coverPhoto,
        country,
      },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        coverPhoto: true,
        country: true,
        isPremium: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('❌ Update user profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Update avatar
export const updateAvatar = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        coverPhoto: true,
        country: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('❌ Update avatar error:', error);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};

// Update cover photo
export const updateCoverPhoto = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { coverPhoto } = req.body;

    if (!coverPhoto) {
      return res.status(400).json({ message: 'Cover photo URL is required' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { coverPhoto },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        coverPhoto: true,
        country: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('❌ Update cover photo error:', error);
    res.status(500).json({ message: 'Failed to update cover photo' });
  }
};

// Search users
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        country: true,
        isPremium: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
      take: 20,
      orderBy: {
        name: 'asc',
      },
    });

    res.json(users);
  } catch (error) {
    console.error('❌ Search users error:', error);
    res.status(500).json({ message: 'Failed to search users' });
  }
};
