'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin || false);
          if (!data.isAdmin) {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/');
      }
    };

    if (user) {
      checkAdmin();
    } else if (!isLoading) {
      router.push('/login');
    }
  }, [user, token, isLoading, router]);

  const navItems = [
    { href: '/admin', label: '📊 Dashboard', icon: 'dashboard' },
    { href: '/admin/users', label: '👥 Users', icon: 'people' },
    { href: '/admin/posts', label: '📝 Posts', icon: 'article' },
    { href: '/admin/reports', label: '🚨 Reports', icon: 'report' },
    { href: '/admin/events', label: '📅 Events', icon: 'event' },
    { href: '/admin/settings', label: '⚙️ Settings', icon: 'settings' },
  ];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin-slow">🛡️</div>
            <div className="text-xl text-on-surface-variant">Loading admin panel...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant sticky top-24">
                <div className="mb-4 pb-4 border-b border-outline-variant">
                  <h2 className="text-lg font-bold text-primary">🛡️ Admin Panel</h2>
                  <p className="text-xs text-on-surface-variant">Manage your platform</p>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                        pathname === item.href
                          ? 'bg-primary-fixed text-primary font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
