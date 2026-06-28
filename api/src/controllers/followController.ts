import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createNotification } from '../services/notificationService';

const prisma = new PrismaClient();

// Helper to validate UUID
const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Follow a user
export const followUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - userId is added by auth middleware
    const followerId = req.userId;
    const { userId: followingId } = req.params;

    if (!isValidUUID(followingId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    if (followerId === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const follower = await prisma.user.findUnique({
      where: { id: followerId },
      select: { name: true, username: true },
    });

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      return res.json({ following: false, message: 'Unfollowed successfully' });
    } else {
      const follow = await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });

      const actorName = follower?.name || follower?.username || 'Someone';
      await createNotification(
        followingId,
        'follow',
        `${actorName} started following you`,
        `/profile?id=${followerId}`
      );

      return res.json({ following: true, message: 'Followed successfully', follow });
    }
  } catch (error) {
    console.error('❌ Follow user error:', error);
    return res.status(500).json({ message: 'Failed to follow/unfollow user' });
  }
};

// Get followers
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.json(followers.map(f => f.follower));
  } catch (error) {
    console.error('❌ Get followers error:', error);
    return res.status(500).json({ message: 'Failed to get followers' });
  }
};

// Get following
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.json(following.map(f => f.following));
  } catch (error) {
    console.error('❌ Get following error:', error);
    return res.status(500).json({ message: 'Failed to get following' });
  }
};

// Check if following
export const checkFollowing = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - userId is added by auth middleware
    const followerId = req.userId;
    const { userId: followingId } = req.params;

    if (!isValidUUID(followingId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return res.json({ following: !!follow });
  } catch (error) {
    console.error('❌ Check following error:', error);
    return res.status(500).json({ message: 'Failed to check following status' });
  }
};
