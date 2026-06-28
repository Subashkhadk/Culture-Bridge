import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const isValidUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, content, category, country, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category: category || null,
        country: country || null,
        imageUrl: imageUrl || null,
        authorId: userId,
        published: true,
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatarUrl: true },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('❌ Create post error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category, country, search, author, limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { published: true };
    
    if (category) where.category = String(category);
    if (country) where.country = String(country);
    if (author) where.authorId = String(author);

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { content: { contains: String(search), mode: 'insensitive' } },
        { category: { contains: String(search), mode: 'insensitive' } },
        { country: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, username: true, name: true, avatarUrl: true } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({ posts, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    console.error('❌ Get posts error:', error);
    res.status(500).json({ message: 'Failed to get posts' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) return res.status(400).json({ message: 'Invalid post ID format' });

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, name: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('❌ Get post error:', error);
    res.status(500).json({ message: 'Failed to get post' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { title, content, category, country, imageUrl } = req.body;

    if (!isValidUUID(id)) return res.status(400).json({ message: 'Invalid post ID format' });

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return res.status(404).json({ message: 'Post not found' });
    if (existingPost.authorId !== userId) return res.status(403).json({ message: 'Not authorized' });

    const post = await prisma.post.update({
      where: { id },
      data: { title, content, category, country, imageUrl },
      include: { author: { select: { id: true, username: true, name: true, avatarUrl: true } } },
    });

    res.json(post);
  } catch (error) {
    console.error('❌ Update post error:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!isValidUUID(id)) return res.status(400).json({ message: 'Invalid post ID format' });

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) return res.status(404).json({ message: 'Post not found' });
    if (existingPost.authorId !== userId) return res.status(403).json({ message: 'Not authorized' });

    await prisma.post.delete({ where: { id } });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('❌ Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { category: true, country: true },
    });

    const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
    const countries = [...new Set(posts.map(p => p.country).filter(Boolean))];

    res.json({ categories, countries });
  } catch (error) {
    console.error('❌ Get categories error:', error);
    res.status(500).json({ message: 'Failed to get categories' });
  }
};
