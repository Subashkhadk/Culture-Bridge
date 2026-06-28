import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create sponsored post
export const createSponsoredPost = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { title, content, category, country, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        country,
        imageUrl,
        isSponsored: true,
        authorId: userId,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Sponsored post created successfully',
      post,
    });
  } catch (error) {
    console.error('❌ Create sponsored post error:', error);
    res.status(500).json({ message: 'Failed to create sponsored post' });
  }
};

// Get sponsored posts
export const getSponsoredPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        isSponsored: true,
        published: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    console.error('❌ Get sponsored posts error:', error);
    res.status(500).json({ message: 'Failed to get sponsored posts' });
  }
};
