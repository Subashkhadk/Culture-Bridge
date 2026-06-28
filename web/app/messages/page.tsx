'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

export default function MessagesPage() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          💬 Messages
        </h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No conversations yet. Start messaging someone!
          </div>
        ) : (
          <div className="space-y-4">
            {/* Conversation list */}
          </div>
        )}
      </div>
    </>
  );
}
