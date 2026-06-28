'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function EventsPage() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchRegisteredEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
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
        fetchEvents();
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
        fetchEvents();
        alert('Registration cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration');
    }
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

  const isEventFull = (event: Event) => {
    return event.maxAttendees && event._count.registrations >= event.maxAttendees;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">📅 Events</h1>
              <p className="text-sm text-on-surface-variant">Discover and join cultural events</p>
            </div>
            <Link href="/create-event">
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                + Create Event
              </button>
            </Link>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {events.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-12 text-center border border-outline-variant">
              <div className="text-4xl mb-4">📭</div>
              <h2 className="text-xl font-semibold text-on-surface mb-2">No events yet</h2>
              <p className="text-on-surface-variant text-sm mb-4">Be the first to create a cultural event!</p>
              <Link href="/create-event">
                <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition text-sm font-medium">
                  Create Event 🚀
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                    <h3 className="text-lg font-semibold text-on-surface">{event.title}</h3>
                    <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-on-surface-variant">
                      <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>👤 {event._count.registrations} / {event.maxAttendees || '∞'} attending</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-outline-variant gap-2">
                      <span className="text-xs text-on-surface-variant">
                        Organized by {event.organizer.name || event.organizer.username}
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
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
