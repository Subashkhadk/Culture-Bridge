'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function DashboardPage() {
  const { user, logout, isLoading, token } = useAuth();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/status`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setIsPremium(data.isPremium);
        }
      } catch (error) {
        console.error('Error fetching premium status:', error);
      }
    };

    if (user) {
      fetchPremiumStatus();
    }
  }, [user, token]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin-slow">🌉</div>
            <div className="text-xl text-on-surface-variant">Loading...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
                  Welcome, {user.name}! 👋
                </h1>
                <p className="text-on-surface-variant text-sm">You're logged in to Culture Bridge</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-error text-on-error rounded-lg hover:opacity-90 transition text-sm"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <Link href="/create-post">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="text-sm font-medium text-on-surface">Create Post</p>
                </div>
              </Link>
              <Link href="/feed">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <p className="text-sm font-medium text-on-surface">Feed</p>
                </div>
              </Link>
              <Link href="/explore">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <p className="text-sm font-medium text-on-surface">Explore</p>
                </div>
              </Link>
              <Link href="/profile">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">👤</div>
                  <p className="text-sm font-medium text-on-surface">Profile</p>
                </div>
              </Link>
              <Link href="/bookmarks">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">🔖</div>
                  <p className="text-sm font-medium text-on-surface">Bookmarks</p>
                </div>
              </Link>
              <Link href="/qa">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">❓</div>
                  <p className="text-sm font-medium text-on-surface">Q&A</p>
                </div>
              </Link>
              <Link href={isPremium ? "/create-sponsored-post" : "/premium"}>
                <div className={`p-4 rounded-xl border text-center transition ${
                  isPremium 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-400 hover:opacity-90'
                    : 'bg-surface-container border-outline-variant hover:border-primary'
                }`}>
                  <div className="text-3xl mb-2">📢</div>
                  <p className="text-sm font-medium text-on-surface">
                    {isPremium ? 'Sponsored Post' : 'Upgrade to Premium'}
                  </p>
                </div>
              </Link>
              <Link href="/premium">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">💎</div>
                  <p className="text-sm font-medium text-on-surface">Premium</p>
                </div>
              </Link>
              <Link href="/settings">
                <div className="bg-surface-container p-4 rounded-xl border border-outline-variant hover:border-primary transition text-center">
                  <div className="text-3xl mb-2">⚙️</div>
                  <p className="text-sm font-medium text-on-surface">Settings</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
