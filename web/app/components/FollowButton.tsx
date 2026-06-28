'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: string;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
  showCount?: boolean;
}

export default function FollowButton({ 
  userId, 
  className = '', 
  onFollowChange,
  showCount = false
}: FollowButtonProps) {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || user.id === userId) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/check/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.following);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    const fetchFollowersCount = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/followers/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFollowersCount(data.length || 0);
        }
      } catch (error) {
        console.error('Error fetching followers count:', error);
      }
    };

    if (userId) {
      checkFollowStatus();
      if (showCount) {
        fetchFollowersCount();
      }
    }
  }, [userId, user, token, showCount]);

  const handleFollow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.id === userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following);
        setFollowersCount(prev => data.following ? prev + 1 : prev - 1);
        if (onFollowChange) {
          onFollowChange(data.following);
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (user?.id === userId) return null;

  return (
    <motion.button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-1.5 sm:px-5 sm:py-2 text-sm font-medium rounded-full transition-all ${
        isFollowing
          ? 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-highest'
          : 'bg-primary text-on-primary hover:opacity-90'
      } disabled:opacity-50 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⟳</span>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        isFollowing ? 'Following ✓' : '+ Follow'
      )}
      {showCount && followersCount > 0 && (
        <span className="ml-1 text-xs opacity-70">({followersCount})</span>
      )}
    </motion.button>
  );
}
