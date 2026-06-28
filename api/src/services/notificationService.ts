import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNotification = async (
  userId: string,
  type: string,
  content: string,
  link?: string
) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        content,
        link,
        read: false,
      },
    });
  } catch (error) {
    console.error('❌ Create notification error:', error);
    return null;
  }
};

export const notifyFollowers = async (
  userId: string,
  content: string,
  link: string
) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      select: {
        followerId: true,
      },
    });

    if (followers.length === 0) return;

    const notifications = followers.map((f) => ({
      userId: f.followerId,
      type: 'activity',
      content,
      link,
      read: false,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });
  } catch (error) {
    console.error('❌ Error notifying followers:', error);
  }
};
