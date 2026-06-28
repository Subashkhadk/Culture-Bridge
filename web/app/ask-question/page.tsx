'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

const categories = [
  'Etiquette',
  'Food',
  'Language',
  'History',
  'Art',
  'Festivals',
  'Traditions',
  'Lifestyle',
];

const locations = [
  'Tokyo, Japan',
  'Kyoto, Japan',
  'Osaka, Japan',
  'Shibuya',
  'London, UK',
  'New York, USA',
  'Paris, France',
  'Sydney, Australia',
];

export default function AskQuestionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // API call will go here
      console.log('Question submitted:', formData);
      router.push('/qa');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <p className="text-body-lg text-on-surface-variant mb-4">Please login to ask a question</p>
            <Link href="/login" className="bg-primary text-on-primary px-lg py-md rounded-full font-label-md">
              Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-gutter py-xl min-h-screen">
        <div className="flex justify-between items-center mb-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Ask a Question</h1>
          <Link href="/qa" className="text-primary hover:underline font-label-md">
            ← Back to Q&A
          </Link>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-xl border border-outline-variant">
          {error && (
            <div className="bg-error-container text-on-error-container p-md rounded-lg mb-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label className="block font-label-md font-bold text-on-surface mb-sm">
                Question Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What would you like to ask?"
                className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-label-md font-bold text-on-surface mb-sm">
                Details *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Provide context, your experience, and what you'd like to know..."
                rows={6}
                className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-md font-bold text-on-surface mb-sm">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none"
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-md font-bold text-on-surface mb-sm">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-primary outline-none"
                >
                  <option value="">Select a location...</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-md rounded-full font-label-md font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : '📤 Post Question'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
