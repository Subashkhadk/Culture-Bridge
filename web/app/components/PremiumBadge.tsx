'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function PremiumBadge({ size = 'md', showLabel = true }: PremiumBadgeProps) {
  const { user, token } = useAuth();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsPremium(data.isPremium || false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };

    if (user) {
      checkPremium();
    }
  }, [user, token]);

  if (!isPremium) return null;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-full ${sizeClasses[size]}`}>
      <span className="material-symbols-outlined text-[14px]">stars</span>
      {showLabel && 'Premium'}
    </span>
  );
}
