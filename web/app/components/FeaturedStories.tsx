'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FeaturedStories() {
  const stories = [
    {
      id: 1,
      title: 'The Secret Art of Sourdough in Tuscany',
      category: 'Food & Heritage',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAjF1gWhpVXz6bL9tRICZ-V9TfH2PQezBIG0uf9ut61B8CShyQwYjIaQemDxQs-DSLBFIP-EuJwWLv-QwarzCZOo6jZZh-tk6ZQyUY2kQGhMElGb88ZdizA9JyGXBOVrjXV-vKjVZVFAMeTyeRRZt-sE4C2vUCpKWA3_r-t8nfaI7P-8WPwoaybZIJZq6uqN5T0R_uNUBUXZ7DHrjejmBQvFPEiyPOwoW0mJsHzVpfTXIMLZAXxNLIHfdvNqYApFldx2W3QtWJ1tU',
      borderColor: 'border-secondary',
      bgColor: 'bg-secondary',
      size: 'large',
    },
    {
      id: 2,
      title: 'Holi: The Canvas of Unity',
      category: 'Festivals',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBPDMQ0g55k35lQ2lLfBIvHF3JHCjwyOByZjlS6B0EtXr9FGiJFfOxsHv4Hs4KMYXJyAZk4Gk7pcQhK1_zzsiC094iGKarhvO9wO4OA2pgmkYMWqKBMTArqSza8KSmZvu8tTYIOwo92n_3quij5MjxxgFMAEyondyXiDeyxMnSCYC2q1W2BJ6FssW_-uEDV6ukNnrFrpeFOAyl3XJlm1FGr_2WQ-ZVUKSphQWk6Zbcp84Hg2Mc7cF5kOQBE3Asudj6SUvWwQaS5Kc',
      borderColor: 'border-primary',
      bgColor: 'bg-primary',
      size: 'medium',
    },
    {
      id: 3,
      title: 'Zen in a Cup',
      category: 'Art',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaTV8PO9kC2Rnr1yI2nNLzhi_jdyfPuFcXzO3gokQDXuaZp3CvSyVSjLI0SwOU4tqPqseRF6ZkicLlV9SdhMGJ-_-tZHnMMS3tz86_EWFCGtgKhA3zFW-wWIkmwvXUVZR_Xf8t6Wq_ig_hdxx2jOzEtMji0P1CdoDJNNrCfpD_Fz7VCMr5HCO6aj7abfCg1MZdlTAB-RH0tWfA-WmKnTlIbNodb-Ni3pdXxo-sG8LTRLDfXL_aKlz7612Bpx_3rw2rqzpqckjIFTI',
      borderColor: 'border-tertiary-container',
      bgColor: 'bg-tertiary-container',
      size: 'small',
    },
    {
      id: 4,
      title: 'Calligraphy Roots',
      category: 'Language',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGu_WJ1gaDiDlfMe3NCf2DFUFR346FNeJMRK8L-vjuA4CuAjruaWPqTJ4XdAgtfLab1ZiVZPN1eEoBarbT7sAm9mZfsevV6INbM64e9LH8vvrdb1r9c18z1SL8xDq7SwNkpl_TLsSH0hz7kIMnN5qKW_5BjQxVzGzMXtfDwO8GAJADjMqWkTIbTjfw_nFxqxWe1NwS4RwEu83jsPnIUMpZUwaTvKWFqrAUMcbPnyNIXDsuk_lu7Z8LE8zLWWxTuUaYFv6K5ftMT0c',
      borderColor: 'border-primary-fixed',
      bgColor: 'bg-primary-fixed',
      size: 'small',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bridge-pattern">
      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-background">Featured Cultural Stories</h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">Deep dives into the heartbeat of global traditions.</p>
          </div>
          <Link href="/stories" className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm sm:text-base">
            Explore all stories
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {/* Large Feature */}
          <motion.div 
            className="lg:col-span-2 lg:row-span-2 relative group rounded-2xl overflow-hidden shadow-sm border-t-2 border-secondary h-[300px] sm:h-[400px] lg:h-[500px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={stories[0].image}
              alt={stories[0].title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 lg:p-8">
              <span className="bg-secondary text-on-secondary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium w-fit mb-2">
                {stories[0].category}
              </span>
              <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-1">{stories[0].title}</h3>
              <p className="text-white/80 text-sm sm:text-base line-clamp-2">
                How a 200-year-old starter culture connects generations of a small Italian community.
              </p>
            </div>
          </motion.div>

          {/* Festival Card */}
          <motion.div 
            className="relative group rounded-2xl overflow-hidden shadow-sm border-t-2 border-primary h-[200px] sm:h-[240px] lg:h-[240px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={stories[1].image}
              alt={stories[1].title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 sm:p-4">
              <span className="bg-primary text-on-primary px-2 py-0.5 rounded-full text-xs font-medium w-fit mb-1">
                {stories[1].category}
              </span>
              <h3 className="text-white text-sm sm:text-base font-semibold">{stories[1].title}</h3>
            </div>
          </motion.div>

          {/* Art Card */}
          <motion.div 
            className="relative group rounded-2xl overflow-hidden shadow-sm border-t-2 border-tertiary-container h-[200px] sm:h-[240px] lg:h-[240px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={stories[2].image}
              alt={stories[2].title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 sm:p-4">
              <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full text-xs font-medium w-fit mb-1">
                {stories[2].category}
              </span>
              <h3 className="text-white text-sm sm:text-base font-semibold">{stories[2].title}</h3>
            </div>
          </motion.div>

          {/* Language Card */}
          <motion.div 
            className="relative group rounded-2xl overflow-hidden shadow-sm border-t-2 border-primary-fixed h-[200px] sm:h-[240px] lg:h-[240px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={stories[3].image}
              alt={stories[3].title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 sm:p-4">
              <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full text-xs font-medium w-fit mb-1">
                {stories[3].category}
              </span>
              <h3 className="text-white text-sm sm:text-base font-semibold">{stories[3].title}</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
