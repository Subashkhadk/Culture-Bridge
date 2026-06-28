'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import TranslationButton from '@/app/components/TranslationButton';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  country: string;
  imageUrl: string;
  createdAt: string;
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

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/posts/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to load post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin-slow">🌉</div>
          <div className="text-xl text-gray-600 dark:text-gray-400">Loading post...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-2xl text-red-600 mb-4">❌ {error || 'Post not found'}</div>
          <Link href="/feed" className="text-blue-600 hover:underline">
            ← Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/feed" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to feed
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {post.imageUrl && (
            <div className="w-full h-64 sm:h-96 bg-gray-200 dark:bg-gray-700">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
              <div className="w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2 hover:underline">
                    {post.author.avatarUrl ? (
                      <img src={post.author.avatarUrl} alt={post.author.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {post.author.name?.[0] || post.author.username[0]}
                      </div>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name || post.author.username}</span>
                  </Link>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {post.category && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm whitespace-nowrap">
                  {post.category}
                </span>
              )}
            </div>

            {post.country && (
              <div className="mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">📍 {post.country}</span>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Translation Button */}
            <div className="mb-6">
              <TranslationButton text={post.content} />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">❤️ {post._count?.likes || 0} likes</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">💬 {post._count?.comments || 0} comments</span>
              </div>
            </div>

            {user && user.id === post.author.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
                <Link
                  href={`/edit-post/${post.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  ✏️ Edit
                </Link>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this post?')) {
                      router.push('/feed');
                    }
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
