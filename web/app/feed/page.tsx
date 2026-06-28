'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import LikeButton from '@/app/components/LikeButton';
import CommentButton from '@/app/components/CommentButton';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  country: string;
  imageUrl: string;
  createdAt: string;
  isSponsored: boolean;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        if (!response.ok) {
          throw new Error('Failed to load posts');
        }
        const data = await response.json();
        const sortedPosts = (data.posts || []).sort((a: Post, b: Post) => {
          if (a.isSponsored && !b.isSponsored) return -1;
          if (!a.isSponsored && b.isSponsored) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(sortedPosts);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
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
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">📚 Culture Feed</h1>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Link href="/create-sponsored-post" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base font-medium">
                  📢 Sponsored
                </button>
              </Link>
              <Link href="/create-post" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm sm:text-base font-medium">
                  📝 New Post
                </button>
              </Link>
              <Link href="/dashboard" className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-container border border-outline-variant rounded-lg hover:bg-surface-container-highest transition text-sm sm:text-base">
                  ← Dashboard
                </button>
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center border border-outline-variant">
              <div className="text-4xl mb-4">📭</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-on-surface mb-2">No posts yet</h2>
              <p className="text-on-surface-variant text-sm mb-4">Be the first to share a cultural story!</p>
              <Link href="/create-post">
                <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                  Create Your First Post 🚀
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <div className={`bg-surface-container-low rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border ${
                    post.isSponsored ? 'border-yellow-400 border-2' : 'border-outline-variant'
                  }`}>
                    {post.isSponsored && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs sm:text-sm font-medium px-3 py-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">stars</span>
                        Sponsored Content
                      </div>
                    )}
                    {post.imageUrl && (
                      <div className="w-full h-48 sm:h-56 bg-surface-container">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-2">
                        <Link href={`/post/${post.id}`} className="flex-1 w-full">
                          <h2 className="text-lg sm:text-xl font-semibold text-on-surface hover:text-primary transition line-clamp-2">
                            {post.title}
                          </h2>
                        </Link>
                        {post.category && (
                          <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-full text-xs whitespace-nowrap">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-on-surface-variant mb-3 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-on-surface-variant">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/profile?id=${post.author.id}`} className="flex items-center gap-2 hover:text-primary transition">
                            {post.author.avatarUrl ? (
                              <img src={post.author.avatarUrl} alt={post.author.name} className="w-5 h-5 rounded-full" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary">
                                {post.author.name?.[0] || post.author.username[0]}
                              </div>
                            )}
                            <span className="truncate max-w-[80px] sm:max-w-none">{post.author.name || post.author.username}</span>
                          </Link>
                          {post.country && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>📍 {post.country}</span>
                            </>
                          )}
                        </div>
                        <span className="text-xs">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Like and Comment Buttons */}
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-outline-variant">
                        <LikeButton 
                          postId={post.id} 
                          initialLikes={post._count?.likes || 0}
                          size="sm"
                        />
                        <CommentButton 
                          postId={post.id} 
                          commentCount={post._count?.comments || 0}
                          size="sm"
                        />
                        <Link href={`/post/${post.id}`} className="text-sm text-primary hover:underline ml-auto">
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
