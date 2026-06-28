'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { motion } from 'framer-motion';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  onLikeChange?: (isLiked: boolean, newCount: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LikeButton({ 
  postId, 
  initialLikes = 0, 
  onLikeChange,
  className = '',
  size = 'md'
}: LikeButtonProps) {
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newLiked = data.liked;
        const newCount = newLiked ? likeCount + 1 : likeCount - 1;
        
        setIsLiked(newLiked);
        setLikeCount(newCount);
        
        if (onLikeChange) {
          onLikeChange(newLiked, newCount);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'text-sm gap-1 px-2 py-1',
    md: 'text-base gap-1.5 px-3 py-1.5',
    lg: 'text-lg gap-2 px-4 py-2',
  };

  const iconSizes = {
    sm: 'text-[18px]',
    md: 'text-[22px]',
    lg: 'text-[28px]',
  };

  return (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center rounded-full transition-all ${
        isLiked 
          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
          : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-red-600'
      } ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={`material-symbols-outlined ${iconSizes[size]}`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
        favorite
      </span>
      {likeCount > 0 && (
        <span className="font-medium">{likeCount}</span>
      )}
    </motion.button>
  );
}
