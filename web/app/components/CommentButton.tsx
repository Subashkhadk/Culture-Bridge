'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
}

interface CommentButtonProps {
  postId: string;
  commentCount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CommentButton({ 
  postId, 
  commentCount = 0, 
  className = '',
  size = 'md'
}: CommentButtonProps) {
  const { user, token } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [count, setCount] = useState(commentCount);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data, ...comments]);
        setCount(prev => prev + 1);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
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
    <div className="inline-block">
      <button
        onClick={handleToggleComments}
        className={`flex items-center rounded-full transition-all bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-primary ${sizeClasses[size]} ${className}`}
      >
        <span className={`material-symbols-outlined ${iconSizes[size]}`}>
          chat_bubble
        </span>
        {count > 0 && (
          <span className="font-medium">{count}</span>
        )}
      </button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 border-t border-outline-variant pt-4"
          >
            {user ? (
              <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 text-sm border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                >
                  {isSubmitting ? '...' : 'Post'}
                </button>
              </form>
            ) : (
              <p className="text-sm text-on-surface-variant mb-4">
                <a href="/login" className="text-primary hover:underline">Login</a> to comment
              </p>
            )}

            {isLoading ? (
              <div className="text-center py-4 text-on-surface-variant text-sm">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-on-surface-variant text-sm">No comments yet. Be the first!</div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                      {comment.author.name?.charAt(0) || comment.author.username?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-on-surface truncate">
                          {comment.author.name || comment.author.username}
                        </span>
                        <span className="text-xs text-on-surface-variant flex-shrink-0">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant break-words">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
