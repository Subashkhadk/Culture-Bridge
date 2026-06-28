'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  title: string;
  content: string;
  category: string;
  location: string;
  time: string;
  votes: number;
  answers: number;
  isVerified?: boolean;
  author: {
    name: string;
    avatar?: string;
  };
}

export default function QAPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [questions] = useState<Question[]>([
    {
      id: 1,
      title: 'How do I behave at a Japanese wedding?',
      content: "I'm attending my first Japanese wedding next month in Kyoto. I've heard the gift-giving process is very specific (Goshuugi) and I don't want to cause any offense...",
      category: 'Etiquette',
      location: 'Tokyo, Japan',
      time: '2h ago',
      votes: 142,
      answers: 24,
      isVerified: true,
      author: { name: 'Hiroki K.' },
    },
    {
      id: 2,
      title: 'Best place for authentic Pho in Tokyo?',
      content: "Craving a warm bowl of Pho after walking around Harajuku. Looking for something that isn't too commercialized, maybe a family-run hidden gem?",
      category: 'Food',
      location: 'Shibuya',
      time: '5h ago',
      votes: 89,
      answers: 12,
      author: { name: 'Anya M.' },
    },
    {
      id: 3,
      title: "Nuance of 'Otsukaresama' in business?",
      content: "I started working at a Japanese firm recently. My colleagues use 'Otsukaresama desu' constantly. Is it ever weird if I say it first to a senior?",
      category: 'Language',
      location: 'London',
      time: '1d ago',
      votes: 31,
      answers: 8,
      isVerified: true,
      author: { name: 'Soji T.' },
    },
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const categories = [
    { name: 'Food', icon: 'restaurant' },
    { name: 'Festivals', icon: 'celebration' },
    { name: 'Language', icon: 'translate' },
    { name: 'History', icon: 'history_edu' },
    { name: 'Art', icon: 'palette' },
  ];

  const filters = [
    { label: 'Sort By', value: 'Trending', icon: 'trending_up' },
    { label: 'Status', value: 'Unanswered', icon: 'question_mark' },
    { label: 'Region', value: 'All Regions', icon: 'public' },
    { label: 'Category', value: 'Everything', icon: 'filter_list' },
  ];

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
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar - Hidden on Mobile */}
            <aside className="hidden lg:flex flex-col p-4 gap-2 bg-surface-container-low h-fit w-64 rounded-xl sticky top-24">
              <div className="mb-2 px-2">
                <h2 className="text-xl font-bold text-primary">Explore Culture</h2>
                <p className="text-sm text-on-surface-variant">Discover heritage</p>
              </div>
              <nav className="flex flex-col gap-1">
                {categories.map((cat, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-all ${
                      index === 0
                        ? 'bg-primary-container text-on-primary-container font-medium'
                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    {cat.name}
                  </a>
                ))}
              </nav>
              <div className="mt-4 p-3 bg-secondary-container text-on-secondary-container rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wider mb-1">Active Community</p>
                <p className="text-sm mb-3">Join a Bridge Group to dive deeper into specific regions.</p>
                <button className="w-full bg-on-secondary-container text-secondary-container py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all">
                  Join a Bridge Group
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <motion.div 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Community Q&amp;A</h1>
                  <p className="text-sm sm:text-base text-on-surface-variant">Connect with locals and enthusiasts around the globe.</p>
                </div>
                <Link href="/ask-question">
                  <button className="bg-primary text-on-primary px-4 sm:px-6 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm sm:text-base font-medium active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[20px]">add_comment</span>
                    Ask a Question
                  </button>
                </Link>
              </motion.div>

              {/* Filter Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {filters.map((filter, index) => (
                  <motion.div
                    key={index}
                    className="bg-surface-container border border-outline-variant p-3 rounded-xl flex items-center justify-between group cursor-pointer hover:border-primary transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-on-surface-variant uppercase tracking-wider">{filter.label}</p>
                      <p className="text-xs sm:text-sm font-bold">{filter.value}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[20px]">{filter.icon}</span>
                  </motion.div>
                ))}
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    className="glass-card p-4 sm:p-6 rounded-2xl flex gap-4 hover:shadow-md transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {/* Vote Buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors hover:bg-surface-container rounded-lg p-1 text-[20px]">
                        expand_less
                      </button>
                      <span className="font-bold text-primary text-sm sm:text-base">{question.votes}</span>
                      <button className="material-symbols-outlined text-outline hover:text-secondary transition-colors hover:bg-surface-container rounded-lg p-1 text-[20px]">
                        expand_more
                      </button>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          question.category === 'Etiquette' ? 'bg-secondary-fixed text-on-secondary-fixed-variant' :
                          question.category === 'Food' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                          'bg-primary-fixed text-on-primary-fixed-variant'
                        }`}>
                          {question.category}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          Asked in {question.location} • {question.time}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors cursor-pointer">
                        {question.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">
                        {question.content}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full ring-2 ring-surface bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary">
                              {question.author.name.charAt(0)}
                            </div>
                            <div className="w-6 h-6 rounded-full ring-2 ring-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary">
                              +12
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {question.isVerified && (
                            <div className="flex items-center gap-1 text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-0.5 rounded-lg">
                              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                verified
                              </span>
                              <span className="text-[10px] sm:text-xs font-medium">Verified Local Answer</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                            <span className="text-sm">{question.answers} answers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="py-6 flex justify-center">
                <button className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-sm sm:text-base">
                  Show more insights
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <aside className="hidden xl:block w-72 space-y-4">
              <div className="bg-surface-container-high rounded-2xl p-4 border border-outline-variant">
                <h4 className="font-medium text-on-surface mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">local_fire_department</span>
                  Top Contributors
                </h4>
                <div className="space-y-3">
                  {[
                    { initials: 'HK', name: 'Hiroki K.', badges: '1.2k Badges', isTop: true },
                    { initials: 'AM', name: 'Anya M.', badges: '980 Badges', isTop: true },
                    { initials: 'ST', name: 'Soji T.', badges: '850 Badges', isTop: false },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        index === 0 ? 'bg-primary-fixed text-primary' :
                        index === 1 ? 'bg-secondary-fixed text-secondary' :
                        'bg-tertiary-fixed text-tertiary'
                      }`}>
                        {user.initials}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-on-surface-variant">{user.badges}</p>
                      </div>
                      {user.isTop && (
                        <span className="material-symbols-outlined text-tertiary text-[20px]">military_tech</span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 py-2 text-primary text-sm font-medium border border-primary rounded-full hover:bg-primary hover:text-on-primary transition-all">
                  View Leaderboard
                </button>
              </div>

              {/* Featured Guide */}
              <div className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ 
                    backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuA3cwdhczH5kOSZk0Iu_UOjYK2ONCMr5V80BKAvTP6ivi6fgl54tTEWiSGSS7JtuGLJ0Yu4K8o4HLpTHKc6Gd1YGzMnTBFGgdoMP-Lcn8lt6Vfbs3iwN2cUlTXcjQxUaRqbX21v8PYAlLsB5xGxMK0KGGacDO45FOviJvFmbmxXoL5_eOoFuCzsR4dCNWSi4YGD3uwB4LcPcEE_1iKjbVpVNNulmI5nrxtkBFPigeAqPPkiMoj1ukQgh-rt3hkY77Gzv7yO5Q7MX8E)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3 text-white">
                  <p className="text-[10px] uppercase tracking-widest font-bold">Featured Guide</p>
                  <h5 className="text-sm font-bold">Exploring Nara Park</h5>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
