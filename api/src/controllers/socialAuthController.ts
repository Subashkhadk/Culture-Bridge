import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const prisma = new PrismaClient();

// Google OAuth login
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // Verify Google token
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );

    const { email, name, sub: googleId, picture } = response.data;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          username: email.split('@')[0] + Math.random().toString(36).slice(2, 6),
          name,
          avatarUrl: picture,
          isVerified: true,
        },
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token: jwtToken,
    });
  } catch (error) {
    console.error('❌ Google login error:', error);
    res.status(500).json({ message: 'Google login failed' });
  }
};
