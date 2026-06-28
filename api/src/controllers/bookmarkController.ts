import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Toggle bookmark
export const toggleBookmark = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { postId } = req.params;

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      res.json({ bookmarked: false, message: 'Bookmark removed' });
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });
      res.json({ bookmarked: true, message: 'Post bookmarked' });
    }
  } catch (error) {
    console.error('❌ Toggle bookmark error:', error);
    res.status(500).json({ message: 'Failed to toggle bookmark' });
  }
};

// Get user's bookmarks
export const getBookmarks = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
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
        },
      },
    });

    res.json(bookmarks);
  } catch (error) {
    console.error('❌ Get bookmarks error:', error);
    res.status(500).json({ message: 'Failed to get bookmarks' });
  }
};
