'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import FollowButton from '@/app/components/FollowButton';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  isPremium?: boolean;
}

export default function FollowersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState<'followers' | 'following'>('followers');

  const userId = searchParams.get('id') || user?.id;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userId || !token) {
        setIsLoadingUsers(false);
        return;
      }

      setIsLoadingUsers(true);
      setError('');
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const url = `${apiUrl}/follow/${type}/${userId}`;
        console.log('Fetching users from:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch ${type}`);
        }

        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (userId) {
      fetchUsers();
    } else {
      setIsLoadingUsers(false);
    }
  }, [userId, token, type]);

  const toggleType = (newType: 'followers' | 'following') => {
    setType(newType);
  };

  if (isLoading || isLoadingUsers) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin-slow">👥</div>
            <div className="text-xl text-on-surface-variant">Loading...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const title = type === 'followers' ? 'Followers' : 'Following';
  const icon = type === 'followers' ? '👥' : '👤';
  const emptyMessage = type === 'followers'
    ? "You don't have any followers yet. Start engaging with the community!"
    : "You're not following anyone yet. Explore the community to find interesting people!";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-surface-container rounded-lg transition"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              {icon} {title}
            </h1>
          </div>

          {/* Toggle Tabs */}
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 mb-6">
            <button
              onClick={() => toggleType('followers')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                type === 'followers'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => toggleType('following')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                type === 'following'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              Following
            </button>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {/* Users List */}
          {users.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center border border-outline-variant">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-on-surface mb-2">
                No {type} yet
              </h2>
              <p className="text-on-surface-variant text-sm">
                {emptyMessage}
              </p>
              <Link href="/explore">
                <button className="mt-4 px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                  Explore Community
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((userItem) => (
                <motion.div
                  key={userItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-low rounded-xl p-4 border border-outline-variant hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/profile?id=${userItem.id}`} 
                      className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                        {userItem.avatarUrl ? (
                          <img src={userItem.avatarUrl} alt={userItem.name} className="w-full h-full object-cover" />
                        ) : (
                          userItem.name?.charAt(0) || userItem.username?.charAt(0) || '?'
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-on-surface truncate">
                            {userItem.name || userItem.username}
                          </p>
                          {userItem.isPremium && (
                            <span className="text-[10px] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full font-medium">⭐</span>
                          )}
                        </div>
                        <p className="text-sm text-on-surface-variant truncate">
                          @{userItem.username}
                        </p>
                      </div>
                    </Link>
                    
                    <FollowButton 
                      userId={userItem.id} 
                      className="flex-shrink-0"
                    />
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
