'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden hero-gradient">
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-secondary-container/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 bg-tertiary-container/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 sm:py-12 lg:py-16">
        {/* Left Content */}
        <motion.div 
          className="space-y-4 sm:space-y-6 text-center lg:text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-fixed/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary-container/20 mx-auto lg:mx-0">
            <span className="material-symbols-outlined text-primary text-[16px] sm:text-[18px]">public</span>
            <span className="text-xs sm:text-sm font-medium text-on-primary-fixed-variant">Bridging 195+ Countries</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-on-background tracking-tight">
            <span className="block">Connecting Worlds,</span>
            <span className="block text-primary">Sharing Cultures</span>
          </h1>

          {/* Description - Single paragraph with normal flow */}
          <p className="text-base sm:text-lg lg:text-xl text-on-surface-variant max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Explore the rich tapestry of human heritage. Exchange stories, master languages, and build lifelong connections across borders.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-surface-container-lowest p-1.5 sm:p-2 rounded-full shadow-md border border-outline-variant w-full max-w-xl mx-auto lg:mx-0">
            <div className="flex items-center flex-1 px-3 sm:px-4 gap-2">
              <span className="material-symbols-outlined text-outline text-[20px]">search</span>
              <input
                className="w-full border-none focus:ring-0 bg-transparent text-sm sm:text-base outline-none placeholder:text-on-surface-variant/60"
                placeholder="Search cultures, traditions..."
                type="text"
              />
            </div>
            <button className="bg-primary text-on-primary px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 shadow-sm whitespace-nowrap">
              Explore Now
            </button>
          </div>
        </motion.div>

        {/* Right Content - Image Grid */}
        <motion.div 
          className="relative hidden lg:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-high/30 rounded-2xl sm:rounded-3xl lg:rounded-[40px] backdrop-blur-sm border border-white/50">
            <div className="space-y-3">
              <div className="h-32 sm:h-40 lg:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transform translate-y-4 sm:translate-y-6 lg:translate-y-8">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ47vrtu17hg1uUtXR6eD6iP-JEIJZqa-isM8d_4SRplZjscI87VzvedOadUFpwmHLC3rWmNen9yngb5ZFHGB__ppgVQiMnTmJ9t8eTqrpi3ljUj0fjSNSgwkMsWpfdTieWieOb0lBDeSR0OfgGz6MokI4WZi5I3x_MI3ryn5P_A5NyMjwM86vo-BXF6LJVqOU2BX50ahmkOETJpDctVJYQso0IJd6e58pieI8SepuJMmsh2xgendg25cy3_Qtr5pnx8xfH79RpSc"
                  alt="People sharing culture"
                />
              </div>
              <div className="h-40 sm:h-48 lg:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfBzXiPpBkk4uerJBUIjYEZUV1giOHU1zNubjVKTotMkqdIjww0-mFtKhLzyW-MLNfMT8yPp7AO-SIYpcYnT_euk4qNMmg3iS9RdJQiKpwP0yWsHBCpuzvtZbe_xf4Cabf6tmqTfjiDFCKbv5X_-fsrTIUjr-3_0-XG--o87tpmzhskf4IQfi5YPTztQ41hQ2Wrq2Evo_kLYIGXtANbGjz4x74ONKXvhSpN8Egh24MOn7ijeUOQ4NIjXX9qFldHui3HNuouyWvjsk"
                  alt="Traditional weaving"
                />
              </div>
            </div>
            <div className="space-y-3 pt-6 sm:pt-8 lg:pt-12">
              <div className="h-40 sm:h-48 lg:h-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC70BdiPbev9NgA9Rk7lfMPP_6cLgekRXBa9C7vaa7HzGc-wtZAdYz8ZHrqgeI1hEt7DMcluXltFzydSvpsMefF-Nf0C2LcOevi4ikvtnsFCbbJvLBgHnOT_m8jGDqXTha1sap74xPH0ka73rmNObL0RPFmF-l9HNSc92EltlASHfTP9HzxBj9bfM1juNcmCkgU3poN9rS8ar7tDmJprjChhpki0m2c-c2QDu3HpaF7oERxrk_wj7mfTQFTISKf56O3mPIeSGVmzuk"
                  alt="Festival celebration"
                />
              </div>
              <div className="h-32 sm:h-40 lg:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg transform -translate-y-4 sm:-translate-y-6 lg:-translate-y-8">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSaKz2WBZkoaTALv1WypvehiVPOnj4D1LoxfJxU2AAxmxkWWJGgSP2Zad3yjslM6hE_VdUJorclLlKBnQ-SrcSpBbHy4n3xzOOiXREWmGVR4Y5dQ48uwE1EmR3wnMuOuzuxgwh9NJGU7jBXSvYHv4Brlsr9INsFRNYVBRWFMjQiA6_ttBYxriV7SA9JJXv8iqlby2_YFzfqaglSAHHFwC_kXLqkQnfwZ5uJqqCBm6N1wOhvZwd6QayRXofUjZiHDdShkueFPQEOGQ"
                  alt="Storytelling"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
