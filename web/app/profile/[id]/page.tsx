'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
    likes: number;
  };
  posts: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    country: string;
    createdAt: string;
  }[];
}

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${params.id}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-600 mb-4">❌ {error || 'User not found'}</div>
          <Link href="/feed" className="text-blue-600 hover:underline">← Back to feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6">
          <Link href="/feed" className="text-blue-600 hover:underline">← Back to feed</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-4xl text-white font-bold flex-shrink-0">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.name?.[0] || profile.username[0]
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{profile.name || profile.username}</h1>
              <p className="text-gray-600">@{profile.username}</p>
              {profile.bio && <p className="text-gray-700 mt-2">{profile.bio}</p>}
              <div className="flex gap-6 mt-3 text-sm text-gray-600">
                <span>📝 {profile._count?.posts || 0} posts</span>
                <span>💬 {profile._count?.comments || 0} comments</span>
                <span>❤️ {profile._count?.likes || 0} likes</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Posts</h2>
        {profile.posts?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-500">No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.posts?.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition h-full">
                  {post.imageUrl && (
                    <div className="h-48 bg-gray-200">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      {post.category && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">#{post.category}</span>}
                      {post.country && <span>📍 {post.country}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
