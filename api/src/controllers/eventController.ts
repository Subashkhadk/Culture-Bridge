import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to validate UUID
const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Create event
export const createEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { title, description, imageUrl, location, address, category, startDate, endDate, maxAttendees } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({ message: 'Title and start date are required' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        location,
        address,
        category,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        organizerId: userId,
        isLive: false,
      },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('❌ Create event error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

// Get all events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { category, upcoming, limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (category) {
      where.category = String(category);
    }
    if (upcoming === 'true') {
      where.startDate = { gte: new Date() };
    }

    const events = await prisma.event.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { startDate: 'asc' },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    const total = await prisma.event.count({ where });

    res.json({
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('❌ Get events error:', error);
    res.status(500).json({ message: 'Failed to get events' });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('❌ Get event error:', error);
    res.status(500).json({ message: 'Failed to get event' });
  }
};

// Register for event
export const registerForEvent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check if event is full
    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: id,
        userId,
        status: 'registered',
      },
    });

    // Update current attendees count
    await prisma.event.update({
      where: { id },
      data: { currentAttendees: { increment: 1 } },
    });

    const updatedEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Successfully registered for event',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('❌ Register for event error:', error);
    res.status(500).json({ message: 'Failed to register for event' });
  }
};

// Cancel registration
export const cancelRegistration = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await prisma.eventRegistration.delete({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    });

    // Update current attendees count
    await prisma.event.update({
      where: { id },
      data: { currentAttendees: { decrement: 1 } },
    });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('❌ Cancel registration error:', error);
    res.status(500).json({ message: 'Failed to cancel registration' });
  }
};

// Get user's registered events
export const getMyEvents = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(registrations);
  } catch (error) {
    console.error('❌ Get my events error:', error);
    res.status(500).json({ message: 'Failed to get your events' });
  }
};
