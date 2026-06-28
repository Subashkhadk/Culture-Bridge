import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import likeRoutes from './routes/likeRoutes';
import bookmarkRoutes from './routes/bookmarkRoutes';
import userRoutes from './routes/userRoutes';
import translationRoutes from './routes/translationRoutes';
import followRoutes from './routes/followRoutes';
import notificationRoutes from './routes/notificationRoutes';
import premiumRoutes from './routes/premiumRoutes';
import sponsoredRoutes from './routes/sponsoredRoutes';
import adRoutes from './routes/adRoutes';
import eventRoutes from './routes/eventRoutes';
import adminRoutes from './routes/admin/adminRoutes';
import reportRoutes from './routes/admin/reportRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: '🌉 Culture Bridge API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      auth: '/api/auth',
      posts: '/api/posts',
      comments: '/api/comments',
      likes: '/api/likes',
      bookmarks: '/api/bookmarks',
      users: '/api/users',
      translations: '/api/translate',
      follow: '/api/follow',
      notifications: '/api/notifications',
      premium: '/api/premium',
      sponsored: '/api/sponsored',
      ads: '/api/ads',
      events: '/api/events',
      admin: '/api/admin',
      reports: '/api/reports',
    }
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Culture Bridge API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/sponsored', sponsoredRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`📚 Posts: http://localhost:${PORT}/api/posts`);
  console.log(`💬 Comments: http://localhost:${PORT}/api/comments`);
  console.log(`❤️ Likes: http://localhost:${PORT}/api/likes`);
  console.log(`🔖 Bookmarks: http://localhost:${PORT}/api/bookmarks`);
  console.log(`👤 Users: http://localhost:${PORT}/api/users`);
  console.log(`🌐 Translate: http://localhost:${PORT}/api/translate`);
  console.log(`👥 Follow: http://localhost:${PORT}/api/follow`);
  console.log(`🔔 Notifications: http://localhost:${PORT}/api/notifications`);
  console.log(`💰 Premium: http://localhost:${PORT}/api/premium`);
  console.log(`📢 Sponsored: http://localhost:${PORT}/api/sponsored`);
  console.log(`📊 Ads: http://localhost:${PORT}/api/ads`);
  console.log(`📅 Events: http://localhost:${PORT}/api/events`);
  console.log(`🛡️ Admin: http://localhost:${PORT}/api/admin`);
  console.log(`📋 Reports: http://localhost:${PORT}/api/reports`);
});

export default app;
