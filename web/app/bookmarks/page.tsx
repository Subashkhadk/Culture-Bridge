'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';

interface Bookmark {
  id: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    country: string;
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
  };
}

export default function BookmarksPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:5001/api/bookmarks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to load bookmarks');
        const data = await response.json();
        setBookmarks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoadingBookmarks(false);
      }
    };

    if (user) {
      fetchBookmarks();
    }
  }, [user, token]);

  const removeBookmark = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookmarks/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to remove bookmark');
      setBookmarks(bookmarks.filter(b => b.post.id !== postId));
    } catch (err: any) {
      console.error('Error removing bookmark:', err);
    }
  };

  if (isLoading || isLoadingBookmarks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🔖 My Bookmarks</h1>
          <Link href="/dashboard" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
        )}

        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-4xl mb-4">🔖</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 mb-4">Start saving posts you love!</p>
            <Link href="/feed" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Browse Feed 📚
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <Link href={`/post/${bookmark.post.id}`} className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition">
                        {bookmark.post.title}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeBookmark(bookmark.post.id)}
                      className="text-red-500 hover:text-red-700 transition text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mt-2 line-clamp-2">{bookmark.post.content}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>By {bookmark.post.author.name || bookmark.post.author.username}</span>
                    {bookmark.post.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        #{bookmark.post.category}
                      </span>
                    )}
                    {bookmark.post.country && <span>📍 {bookmark.post.country}</span>}
                    <span>❤️ {bookmark.post._count.likes}</span>
                    <span>💬 {bookmark.post._count.comments}</span>
                  </div>
                  
                  <div className="mt-3">
                    <Link href={`/post/${bookmark.post.id}`} className="text-blue-600 hover:underline text-sm">
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
