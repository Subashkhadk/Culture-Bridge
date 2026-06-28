'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';

interface DashboardStats {
  stats: {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    totalEvents: number;
    totalReports: number;
    pendingReports: number;
    premiumUsers: number;
    newUsersToday: number;
  };
  recentUsers: any[];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to load dashboard');
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin-slow">📊</div>
          <div className="text-on-surface-variant">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-lg">
        {error}
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalEvents: 0,
    totalReports: 0,
    pendingReports: 0,
    premiumUsers: 0,
    newUsersToday: 0,
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Posts', value: stats.totalPosts, icon: '📝', color: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Comments', value: stats.totalComments, icon: '💬', color: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Events', value: stats.totalEvents, icon: '📅', color: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Total Reports', value: stats.totalReports, icon: '🚨', color: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: '⏳', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Premium Users', value: stats.premiumUsers, icon: '⭐', color: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'New Users Today', value: stats.newUsersToday, icon: '✨', color: 'bg-teal-50 dark:bg-teal-900/20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">📊 Dashboard</h1>
        <p className="text-sm text-on-surface-variant">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-4 rounded-xl border border-outline-variant`}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-on-surface">{stat.value}</div>
            <div className="text-xs text-on-surface-variant">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
        <h2 className="text-lg font-semibold text-on-surface mb-3">Recent Users</h2>
        {data?.recentUsers?.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No users yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-on-surface-variant border-b border-outline-variant">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium hidden sm:table-cell">Email</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium hidden md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentUsers?.map((user) => (
                  <tr key={user.id} className="border-b border-outline-variant/50">
                    <td className="py-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">
                        {user.name?.charAt(0) || user.username?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{user.name || user.username}</div>
                        <div className="text-xs text-on-surface-variant">@{user.username}</div>
                      </div>
                    </td>
                    <td className="py-2 hidden sm:table-cell text-on-surface-variant">{user.email}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-1">
                        {user.isPremium && <span className="text-xs text-yellow-500">⭐</span>}
                        {user.isVerified && <span className="text-xs text-green-500">✅</span>}
                        {user.isAdmin && <span className="text-xs text-red-500">🛡️</span>}
                      </div>
                    </td>
                    <td className="py-2 hidden md:table-cell text-on-surface-variant text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
