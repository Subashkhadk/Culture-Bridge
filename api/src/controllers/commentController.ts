import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create comment
export const createComment = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
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

    res.status(201).json(comment);
  } catch (error) {
    console.error('❌ Create comment error:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Get comments for a post
export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
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
      },
    });

    res.json(comments);
  } catch (error) {
    console.error('❌ Get comments error:', error);
    res.status(500).json({ message: 'Failed to get comments' });
  }
};

// Delete comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('❌ Delete comment error:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
