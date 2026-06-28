'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to load notifications');
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    if (user) {
      fetchNotifications();
      // Poll every 15 seconds
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'follow': return '👥';
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'mention': return '@';
      case 'post': return '📝';
      case 'event': return '📅';
      case 'event_registration': return '📌';
      case 'profile_update': return '🖼️';
      case 'premium': return '⭐';
      default: return '🔔';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'follow': return 'New Follower';
      case 'like': return 'Like';
      case 'comment': return 'Comment';
      case 'mention': return 'Mention';
      case 'post': return 'New Post';
      case 'event': return 'New Event';
      case 'event_registration': return 'Event Registration';
      case 'profile_update': return 'Profile Update';
      case 'premium': return 'Premium';
      default: return 'Notification';
    }
  };

  if (isLoading || isLoadingNotifications) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin-slow">🔔</div>
            <div className="text-xl text-on-surface-variant">Loading notifications...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">🔔 Notifications</h1>
              {unreadCount > 0 && (
                <span className="text-sm text-primary font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center border border-outline-variant"
            >
              <div className="text-4xl mb-4">🔕</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-on-surface mb-2">
                No notifications yet
              </h2>
              <p className="text-on-surface-variant text-sm">
                You'll see notifications here when someone interacts with your content or follows you.
              </p>
              <Link href="/feed" className="inline-block mt-4 text-primary hover:underline">
                Browse Feed →
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      if (notification.link) {
                        router.push(notification.link);
                      }
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      notification.read
                        ? 'bg-surface-container-low border-outline-variant hover:bg-surface-container'
                        : 'bg-primary-fixed/10 border-primary/20 hover:bg-primary-fixed/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary uppercase tracking-wider">
                            {getTypeLabel(notification.type)}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                        <p className={`text-sm sm:text-base ${notification.read ? 'text-on-surface-variant' : 'text-on-surface font-medium'}`}>
                          {notification.content}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className="text-on-surface-variant text-sm">
                        →
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
