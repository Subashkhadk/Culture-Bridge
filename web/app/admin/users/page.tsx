'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  country: string;
  isPremium: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string;
  _count: {
    posts: number;
    comments: number;
    likes: number;
    followers: number;
    following: number;
  };
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filter) params.append('role', filter);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load users');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleAdmin = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/toggle-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling admin:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin-slow">👥</div>
          <div className="text-on-surface-variant">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">👥 Users</h1>
        <p className="text-sm text-on-surface-variant">Manage all users</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="flex-1 px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none bg-surface-container-lowest text-on-surface"
        >
          <option value="">All Users</option>
          <option value="admin">Admins</option>
          <option value="premium">Premium</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface-container-low rounded-2xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant border-b border-outline-variant">
                <th className="p-3 font-medium">User</th>
                <th className="p-3 font-medium hidden md:table-cell">Email</th>
                <th className="p-3 font-medium hidden lg:table-cell">Country</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-outline-variant/50 hover:bg-surface-container/50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">
                        {user.name?.charAt(0) || user.username?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">{user.name || user.username}</div>
                        <div className="text-xs text-on-surface-variant">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-on-surface-variant">{user.email}</td>
                  <td className="p-3 hidden lg:table-cell text-on-surface-variant">{user.country || 'N/A'}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {user.isPremium && <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">⭐ Premium</span>}
                      {user.isVerified && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">✅ Verified</span>}
                      {user.isAdmin && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">🛡️ Admin</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleAdmin(user.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        user.isAdmin
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
