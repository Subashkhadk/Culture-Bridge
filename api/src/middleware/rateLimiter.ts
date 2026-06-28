import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (limit: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const data = rateLimitMap.get(key)!;

    if (now > data.resetTime) {
      // Reset window
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (data.count >= limit) {
      return res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    }

    data.count++;
    next();
  };
};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);
