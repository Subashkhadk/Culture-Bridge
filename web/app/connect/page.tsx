'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

export default function ConnectPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-on-surface text-center mb-4">Connect with the World</h1>
          <p className="text-center text-on-surface-variant text-lg max-w-2xl mx-auto mb-8">
            Discover, connect, and learn from cultures around the globe.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Explore Card */}
            <Link href="/explore" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-outline-variant h-full">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition">Explore Cultures</h3>
                <p className="text-on-surface-variant mt-2">Discover countries, traditions, and stories from around the world.</p>
              </div>
            </Link>

            {/* Q&A Card */}
            <Link href="/qa" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-outline-variant h-full">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition">Community Q&A</h3>
                <p className="text-on-surface-variant mt-2">Ask questions and get answers from locals and experts.</p>
              </div>
            </Link>

            {/* Stories Card */}
            <Link href="/stories" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-outline-variant h-full">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition">Cultural Stories</h3>
                <p className="text-on-surface-variant mt-2">Read and share stories about traditions, food, and heritage.</p>
              </div>
            </Link>

            {/* Events Card */}
            <Link href="/events" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-outline-variant h-full">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition">Events</h3>
                <p className="text-on-surface-variant mt-2">Join cultural events and meetups happening around the world.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
