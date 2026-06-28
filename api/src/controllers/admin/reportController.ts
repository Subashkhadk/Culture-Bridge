import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all reports
export const getReports = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) {
      where.status = String(status);
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('❌ Get reports error:', error);
    res.status(500).json({ message: 'Failed to get reports' });
  }
};

// Update report status
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await prisma.report.update({
      where: { id },
      data: { status },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    res.json(report);
  } catch (error) {
    console.error('❌ Update report status error:', error);
    res.status(500).json({ message: 'Failed to update report status' });
  }
};

// Create report (user)
export const createReport = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { targetType, targetId, reason, description } = req.body;

    const report = await prisma.report.create({
      data: {
        reporterId: userId,
        targetType,
        targetId,
        reason,
        description,
        status: 'pending',
      },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('❌ Create report error:', error);
    res.status(500).json({ message: 'Failed to create report' });
  }
};
