'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import LikeButton from '@/app/components/LikeButton';
import CommentButton from '@/app/components/CommentButton';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  country: string;
  imageUrl: string;
  createdAt: string;
  isSponsored: boolean;
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
}

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  category: string;
  startDate: string;
  endDate?: string;
  maxAttendees: number;
  currentAttendees: number;
  isLive: boolean;
  organizer: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  _count: {
    registrations: number;
  };
}

export default function HomePage() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?upcoming=true&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Fetch registered events for current user
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      if (!user || !token) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/my-events`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const ids = new Set(data.map((reg: any) => reg.eventId));
          setRegisteredEvents(ids);
        }
      } catch (error) {
        console.error('Error fetching registered events:', error);
      }
    };

    fetchRegisteredEvents();
  }, [user, token]);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        if (!response.ok) {
          throw new Error('Failed to load posts');
        }
        const data = await response.json();
        const sortedPosts = (data.posts || []).sort((a: Post, b: Post) => {
          if (a.isSponsored && !b.isSponsored) return -1;
          if (!a.isSponsored && b.isSponsored) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(sortedPosts);
        
        // Calculate trending posts (based on likes + comments)
        const trending = [...sortedPosts].sort((a, b) => {
          const aEngagement = (a._count?.likes || 0) + (a._count?.comments || 0);
          const bEngagement = (b._count?.likes || 0) + (b._count?.comments || 0);
          return bEngagement - aEngagement;
        }).slice(0, 10);
        setTrendingPosts(trending);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch following list and following posts
  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user || !token) return;

      setIsLoadingFollowing(true);
      try {
        const followingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/following/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          const ids = followingData.map((u: any) => u.id);
          setFollowingIds(ids);

          if (ids.length > 0) {
            const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
            if (postsResponse.ok) {
              const allPosts = await postsResponse.json();
              const filteredPosts = (allPosts.posts || []).filter((post: Post) => 
                ids.includes(post.author.id)
              );
              setFollowingPosts(filteredPosts);
            }
          } else {
            setFollowingPosts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching following posts:', error);
      } finally {
        setIsLoadingFollowing(false);
      }
    };

    fetchFollowing();
  }, [user, token]);

  // Handle event registration
  const handleRegister = async (eventId: string) => {
    if (!user) {
      alert('Please login to register for events');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRegisteredEvents(prev => new Set(prev).add(eventId));
        const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?upcoming=true&limit=10`);
        if (eventsResponse.ok) {
          const data = await eventsResponse.json();
          setEvents(data.events || []);
        }
        alert('Successfully registered for the event!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event');
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel your registration?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/register`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const newSet = new Set(registeredEvents);
        newSet.delete(eventId);
        setRegisteredEvents(newSet);
        const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?upcoming=true&limit=10`);
        if (eventsResponse.ok) {
          const data = await eventsResponse.json();
          setEvents(data.events || []);
        }
        alert('Registration cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration');
    }
  };

  // Get posts based on active tab
  const getDisplayedPosts = () => {
    if (activeTab === 'following') {
      return followingPosts;
    }
    if (activeTab === 'trending') {
      return trendingPosts;
    }
    return posts;
  };

  const displayedPosts = getDisplayedPosts();

  const tabs = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'following', label: 'Following', icon: 'group' },
    { id: 'trending', label: 'Trending', icon: 'trending_up' },
    { id: 'events', label: 'Events', icon: 'event' },
  ];

  const isEventFull = (event: Event) => {
    return event.maxAttendees && event._count.registrations >= event.maxAttendees;
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">🌉 Culture Bridge</h1>
              <p className="text-sm text-on-surface-variant">Connect, share, and discover cultures</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/create-post">
                <button className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                  + New Post
                </button>
              </Link>
              {user && (
                <Link href="/create-sponsored-post">
                  <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:opacity-90 transition text-sm font-medium">
                    📢 Sponsored
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide mb-6 border-b border-outline-variant">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-on-surface hover:border-outline-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                {tab.label}
                {tab.id === 'following' && followingIds.length > 0 && (
                  <span className="ml-1 text-xs bg-primary-fixed text-primary px-1.5 py-0.5 rounded-full">
                    {followingIds.length}
                  </span>
                )}
                {tab.id === 'trending' && trendingPosts.length > 0 && (
                  <span className="ml-1 text-xs bg-error-fixed text-error px-1.5 py-0.5 rounded-full animate-pulse">
                    🔥
                  </span>
                )}
                {tab.id === 'events' && events.length > 0 && (
                  <span className="ml-1 text-xs bg-secondary-fixed text-secondary px-1.5 py-0.5 rounded-full">
                    {events.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Events Tab */}
              {activeTab === 'events' ? (
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center border border-outline-variant">
                      <div className="text-4xl mb-4">📅</div>
                      <h2 className="text-xl font-semibold text-on-surface mb-2">No upcoming events</h2>
                      <p className="text-on-surface-variant text-sm mb-4">Be the first to create a cultural event!</p>
                      <Link href="/create-event">
                        <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                          Create Event 🚀
                        </button>
                      </Link>
                    </div>
                  ) : (
                    events.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-surface-container-low rounded-2xl overflow-hidden border ${
                          event.isLive ? 'border-error border-2' : 'border-outline-variant'
                        } hover:shadow-md transition`}
                      >
                        {event.imageUrl && (
                          <div className="w-full h-48 bg-surface-container">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-medium px-2 py-0.5 bg-primary-fixed text-primary rounded-full">
                              {event.category || 'Event'}
                            </span>
                            {event.location && (
                              <span className="text-xs text-on-surface-variant">📍 {event.location}</span>
                            )}
                            {event.isLive && (
                              <span className="text-xs text-error font-medium animate-pulse">● LIVE</span>
                            )}
                          </div>
                          <Link href={`/events/${event.id}`}>
                            <h3 className="text-lg font-semibold text-on-surface hover:text-primary transition">
                              {event.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{event.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-on-surface-variant">
                            <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>👤 {event._count.registrations} / {event.maxAttendees || '∞'} attending</span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-outline-variant gap-2">
                            <span className="text-xs text-on-surface-variant">
                              By {event.organizer.name || event.organizer.username}
                            </span>
                            {user ? (
                              registeredEvents.has(event.id) ? (
                                <button
                                  onClick={() => handleCancelRegistration(event.id)}
                                  className="px-4 py-1.5 bg-surface-container border border-outline-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-container-highest transition"
                                >
                                  Cancel
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRegister(event.id)}
                                  disabled={isEventFull(event)}
                                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                                    isEventFull(event)
                                      ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                                      : 'bg-primary text-on-primary hover:opacity-90'
                                  }`}
                                >
                                  {isEventFull(event) ? 'Full' : event.isLive ? 'Join Now' : 'Register'}
                                </button>
                              )
                            ) : (
                              <Link href="/login">
                                <button className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:opacity-90 transition">
                                  Login to Register
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                /* Posts Feed */
                <>
                  {displayedPosts.length === 0 && activeTab === 'following' && (
                    <div className="bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center border border-outline-variant">
                      <div className="text-4xl mb-4">👥</div>
                      <h2 className="text-xl font-semibold text-on-surface mb-2">No one to follow yet</h2>
                      <p className="text-on-surface-variant text-sm mb-4">
                        Start following people to see their posts here!
                      </p>
                      <Link href="/explore">
                        <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                          Explore Community
                        </button>
                      </Link>
                    </div>
                  )}

                  {displayedPosts.length === 0 && activeTab === 'trending' && (
                    <div className="bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center border border-outline-variant">
                      <div className="text-4xl mb-4">🔥</div>
                      <h2 className="text-xl font-semibold text-on-surface mb-2">No trending posts yet</h2>
                      <p className="text-on-surface-variant text-sm mb-4">
                        Posts with the most engagement will appear here!
                      </p>
                      <Link href="/create-post">
                        <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                          Create a Post 🚀
                        </button>
                      </Link>
                    </div>
                  )}

                  {displayedPosts.length === 0 && activeTab === 'all' ? (
                    <div className="bg-surface-container-low rounded-2xl p-8 sm:p-12 text-center border border-outline-variant">
                      <div className="text-4xl mb-4">📭</div>
                      <h2 className="text-xl font-semibold text-on-surface mb-2">No posts yet</h2>
                      <p className="text-on-surface-variant text-sm mb-4">Be the first to share a cultural story!</p>
                      <Link href="/create-post">
                        <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                          Create Your First Post 🚀
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {displayedPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className={`bg-surface-container-low rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border ${
                            post.isSponsored ? 'border-yellow-400 border-2' : 'border-outline-variant'
                          }`}>
                            {post.isSponsored && (
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-3 py-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">stars</span>
                                Sponsored Content
                              </div>
                            )}
                            {post.imageUrl && (
                              <div className="w-full h-48 sm:h-64 bg-surface-container">
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-2">
                                <Link href={`/post/${post.id}`} className="flex-1 w-full">
                                  <h2 className="text-lg sm:text-xl font-semibold text-on-surface hover:text-primary transition line-clamp-2">
                                    {post.title}
                                  </h2>
                                </Link>
                                {post.category && (
                                  <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-full text-xs whitespace-nowrap">
                                    {post.category}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-on-surface-variant mb-3 line-clamp-3">
                                {post.content}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant mb-3">
                                <Link href={`/profile?id=${post.author.id}`} className="flex items-center gap-1.5 hover:text-primary transition">
                                  {post.author.avatarUrl ? (
                                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-5 h-5 rounded-full" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary">
                                      {post.author.name?.[0] || post.author.username[0]}
                                    </div>
                                  )}
                                  <span className="truncate max-w-[80px]">{post.author.name || post.author.username}</span>
                                </Link>
                                <span>•</span>
                                <span>{post.country || 'Global'}</span>
                                <span>•</span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>

                              {/* Like and Comment Buttons */}
                              <div className="flex items-center gap-3 pt-3 border-t border-outline-variant">
                                <LikeButton 
                                  postId={post.id} 
                                  initialLikes={post._count?.likes || 0}
                                  size="sm"
                                />
                                <CommentButton 
                                  postId={post.id} 
                                  commentCount={post._count?.comments || 0}
                                  size="sm"
                                />
                                <Link href={`/post/${post.id}`} className="text-sm text-primary hover:underline ml-auto">
                                  Read more →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Welcome Card */}
              {user && (
                <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg">
                      {user.name?.charAt(0) || user.username?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Welcome back!</p>
                      <p className="text-sm text-on-surface-variant">{user.name || user.username}</p>
                    </div>
                  </div>
                  {followingIds.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-outline-variant">
                      <Link href={`/followers?id=${user.id}`}>
                        <p className="text-sm text-on-surface-variant">
                          Following <span className="font-semibold text-on-surface">{followingIds.length}</span> people
                        </p>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
                <h3 className="font-semibold text-on-surface mb-3">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/create-post">
                    <button className="w-full px-3 py-2 bg-primary-fixed text-primary rounded-lg hover:opacity-80 transition text-sm font-medium">
                      📝 New Post
                    </button>
                  </Link>
                  <Link href="/create-event">
                    <button className="w-full px-3 py-2 bg-secondary-fixed text-secondary rounded-lg hover:opacity-80 transition text-sm font-medium">
                      📅 New Event
                    </button>
                  </Link>
                  <Link href="/explore">
                    <button className="w-full px-3 py-2 bg-surface-container text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container-highest transition text-sm font-medium">
                      🌍 Explore
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="w-full px-3 py-2 bg-surface-container text-on-surface border border-outline-variant rounded-lg hover:bg-surface-container-highest transition text-sm font-medium">
                      👤 Profile
                    </button>
                  </Link>
                </div>
              </div>

              {/* Upcoming Events Mini */}
              <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-on-surface">📅 Upcoming Events</h3>
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {events.slice(0, 2).map((event) => (
                    <div 
                      key={event.id} 
                      className="flex gap-3 cursor-pointer hover:bg-surface-container-highest p-2 rounded-lg transition" 
                      onClick={() => setActiveTab('events')}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                        <img src={event.imageUrl || 'https://via.placeholder.com/100'} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface line-clamp-1">{event.title}</p>
                        <p className="text-xs text-on-surface-variant">{new Date(event.startDate).toLocaleDateString()}</p>
                        <p className="text-xs text-on-surface-variant">👤 {event._count.registrations} attending</p>
                        {event.isLive && (
                          <span className="text-xs text-error font-medium animate-pulse">● LIVE</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-sm text-on-surface-variant text-center py-2">No upcoming events</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
