import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    // Get user stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
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

    // Get post engagement
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      select: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        createdAt: true,
      },
    });

    const totalLikes = posts.reduce((sum, p) => sum + p._count.likes, 0);
    const totalComments = posts.reduce((sum, p) => sum + p._count.comments, 0);

    res.json({
      user: {
        posts: user?._count.posts || 0,
        comments: user?._count.comments || 0,
        likes: user?._count.likes || 0,
        bookmarks: user?._count.bookmarks || 0,
        followers: user?._count.followers || 0,
        following: user?._count.following || 0,
      },
      engagement: {
        totalLikes,
        totalComments,
        averageLikes: posts.length > 0 ? totalLikes / posts.length : 0,
        averageComments: posts.length > 0 ? totalComments / posts.length : 0,
      },
      posts: posts.length,
    });
  } catch (error) {
    console.error('❌ Get analytics error:', error);
    res.status(500).json({ message: 'Failed to get analytics' });
  }
};
