import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Toggle like
export const toggleLike = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { postId } = req.params;

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      res.json({ liked: false, message: 'Post unliked' });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      res.json({ liked: true, message: 'Post liked' });
    }
  } catch (error) {
    console.error('❌ Toggle like error:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// Get like count for a post
export const getLikeCount = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const count = await prisma.like.count({
      where: { postId },
    });

    res.json({ count });
  } catch (error) {
    console.error('❌ Get like count error:', error);
    res.status(500).json({ message: 'Failed to get like count' });
  }
};
