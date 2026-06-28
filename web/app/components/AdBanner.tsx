'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Ad {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  clicks: number;
  impressions: number;
}

export default function AdBanner() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/ads/active');
        if (response.ok) {
          const data = await response.json();
          setAds(data);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const handleAdClick = async (ad: Ad) => {
    try {
      await fetch(`http://localhost:5001/api/ads/${ad.id}/click`, {
        method: 'POST',
      });
      window.open(ad.linkUrl, '_blank');
    } catch (error) {
      console.error('Error tracking ad click:', error);
      window.open(ad.linkUrl, '_blank');
    }
  };

  if (isLoading || ads.length === 0) {
    return null;
  }

  const ad = ads[currentAdIndex];

  return (
    <motion.div
      key={ad.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onClick={() => handleAdClick(ad)}
      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all max-w-4xl mx-auto my-4"
    >
      <div className="absolute top-2 right-2 text-xs text-gray-400 bg-black/50 text-white px-2 py-1 rounded">
        Sponsored
      </div>
      
      {ad.imageUrl && (
        <div className="w-full h-32 sm:h-48 bg-gray-200 dark:bg-gray-700">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">{ad.title}</h3>
        {ad.content && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ad.content}</p>
        )}
        <div className="mt-2 text-xs text-gray-400">
          {ads.length > 1 && `Advertisement ${currentAdIndex + 1}/${ads.length}`}
        </div>
      </div>
    </motion.div>
  );
}
