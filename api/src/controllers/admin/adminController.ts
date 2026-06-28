import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get admin dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalEvents,
      totalReports,
      pendingReports,
      premiumUsers,
      newUsersToday,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.event.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        isPremium: true,
        isVerified: true,
        createdAt: true,
      },
    });

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        totalEvents,
        totalReports,
        pendingReports,
        premiumUsers,
        newUsersToday,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { username: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (role === 'admin') {
      where.isAdmin = true;
    } else if (role === 'premium') {
      where.isPremium = true;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          avatarUrl: true,
          country: true,
          isPremium: true,
          isVerified: true,
          isAdmin: true,
          createdAt: true,
          lastLogin: true,
          _count: {
            select: {
              posts: true,
              comments: true,
              likes: true,
              followers: true,
              following: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('❌ Get all users error:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Get user by ID (admin)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Get user by ID error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

// Update user (admin)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, email, country, isPremium, isVerified, isAdmin } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        email,
        country,
        isPremium,
        isVerified,
        isAdmin,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        country: true,
        isPremium: true,
        isVerified: true,
        isAdmin: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user (admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Toggle admin status
export const toggleAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { isAdmin: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isAdmin: !user.isAdmin },
      select: {
        id: true,
        name: true,
        username: true,
        isAdmin: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Toggle admin error:', error);
    res.status(500).json({ message: 'Failed to toggle admin status' });
  }
};
